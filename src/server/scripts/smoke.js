import "dotenv/config";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { allocateNextHold, sweepExpiredHolds, fulfillHeldReservation } from "../services/reservations.js";

const prisma = new PrismaClient();
const base = process.env.API_BASE_URL || "http://127.0.0.1:18081";
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) throw new Error("JWT_SECRET is required for smoke test");

async function call(path, options = {}, expected) {
  const response = await fetch(base + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const json = response.status === 204 ? null : await response.json();
  if (expected !== undefined) assert.equal(response.status, expected, path + " yielded " + response.status + " " + JSON.stringify(json));
  return { status: response.status, body: json };
}

function auth(user) {
  return { Authorization: "Bearer " + jwt.sign({ sub: user.id, role: user.role }, secret, { algorithm: "HS256" }) };
}

async function main() {
  const [reader6, reader4, reader5, librarian, title1, title2] = await Promise.all([
    prisma.user.findUnique({ where: { username: "reader6" } }),
    prisma.user.findUnique({ where: { username: "reader4" } }),
    prisma.user.findUnique({ where: { username: "reader5" } }),
    prisma.user.findUnique({ where: { username: "librarian1" } }),
    prisma.bookTitle.findFirst({ where: { title: "Database Systems" } }),
    prisma.bookTitle.findFirst({ where: { title: "Clean Code" } }),
  ]);
  assert.ok(reader6 && reader4 && reader5 && librarian && title1 && title2, "Demo seed missing");
  assert.equal((await call("/api/health", {}, 200)).body.status, "ok");
  const all = await call("/api/books?page=1&pageSize=10", {}, 200);
  assert.equal(all.body.pagination.total, 30);
  assert.equal(all.body.items.length, 10);
  const details = await call("/api/books/" + title1.id, {}, 200);
  assert.equal(details.body.availableCopies, 0);
  assert.equal(details.body.borrowedCopies, 3);
  const available = await call("/api/books?available=true", {}, 200);
  assert.ok(!available.body.items.some((b) => b.id === title1.id));
  const copiesResponse = await call("/api/books/" + title1.id + "/copies", {}, 200);
  assert.equal(copiesResponse.body.items.length, 3);
  const duplicate = await call("/api/books", {
    method: "POST", headers: auth(librarian),
    body: JSON.stringify({ isbn: title1.isbn, title: "Duplicate", author: "Demo", category: "Demo", publicationYear: 2026 }),
  }, 409);
  assert.equal(duplicate.body.error.code, "DUPLICATE_RESOURCE");
  const search = await call("/api/books?q=database", {}, 200);
  assert.ok(search.body.items.some((b) => b.title === "Database Systems"));
  await call("/api/books?page=0", {}, 400);
  await call("/api/books", { method: "POST", body: JSON.stringify({ title: "Forbidden" }) }, 401);
  await call("/api/books", { method: "POST", body: JSON.stringify({ title: "Forbidden" }), headers: auth(reader6) }, 403);
  const denied = await call("/api/reservations", {
    method: "POST", headers: auth(reader6), body: JSON.stringify({ titleId: title2.id }),
  }, 422);
  assert.equal(denied.body.error.code, "COPY_AVAILABLE");

  // Two concurrent requests from one Reader must yield at most one active hold.
  const attempts = await Promise.all([1, 2].map(() => call("/api/reservations", {
    method: "POST", headers: auth(reader6), body: JSON.stringify({ titleId: title1.id }),
  })));
  const success = attempts.filter((r) => r.status === 201);
  assert.equal(success.length, 1, JSON.stringify(attempts));
  assert.ok([409, 422].includes(attempts.find((r) => r.status !== 201).status));
  assert.equal(success[0].body.queuePosition, 3);
  const newId = success[0].body.reservation.id;
  const cancelled = await call("/api/reservations/" + newId, { method: "DELETE", headers: auth(reader6) }, 200);
  assert.equal(cancelled.body.status, "Cancelled");

  const mine = await call("/api/reservations/me", { headers: auth(reader4) }, 200);
  assert.ok(mine.body.items.some((r) => r.titleId === title1.id && r.queuePosition === 1));
  const queue = await call("/api/reservations/queue?titleId=" + title1.id, { headers: auth(librarian) }, 200);
  assert.equal(queue.body.items.length, 2);
  assert.equal(queue.body.items[0].readerId, reader4.id);
  assert.equal(queue.body.items[1].readerId, reader5.id);

  // Exercise the real DB hold-routing functions; this is an integration seam, not F05 HTTP.
  const loan = await prisma.loan.findFirst({
    where: { copy: { titleId: title1.id }, returnedAt: null },
    orderBy: { checkedOutAt: "asc" },
  });
  assert.ok(loan);
  const at = new Date();
  const ready = await prisma.$transaction(async (tx) => {
    await tx.$queryRawUnsafe('SELECT id FROM "book_titles" WHERE id = $1::uuid FOR UPDATE', title1.id);
    await tx.$queryRawUnsafe('SELECT id FROM "book_copies" WHERE id = $1::uuid FOR UPDATE', loan.copyId);
    await tx.loan.update({ where: { id: loan.id }, data: { returnedAt: at } });
    return allocateNextHold(tx, title1.id, loan.copyId, at);
  }, { isolationLevel: "Serializable" });
  assert.equal(ready.readerId, reader4.id);
  assert.equal(ready.expiresAt.getTime() - at.getTime(), 72 * 60 * 60 * 1000);
  const expiryAt = new Date(ready.expiresAt.getTime() + 1000);
  const expiry = await sweepExpiredHolds(expiryAt);
  assert.equal(expiry.expired, 1);
  const next = await prisma.reservation.findFirst({ where: { titleId: title1.id, status: "Ready" } });
  assert.equal(next.readerId, reader5.id);
  const fulfilled = await prisma.$transaction(async (tx) => {
    await tx.$queryRawUnsafe('SELECT id FROM "book_titles" WHERE id = $1::uuid FOR UPDATE', title1.id);
    await tx.$queryRawUnsafe('SELECT id FROM "book_copies" WHERE id = $1::uuid FOR UPDATE', loan.copyId);
    const result = await fulfillHeldReservation(tx, reader5.id, loan.copyId, expiryAt);
    await tx.bookCopy.update({ where: { id: loan.copyId }, data: { status: "Borrowed" } });
    await tx.loan.create({
      data: { readerId: reader5.id, copyId: loan.copyId, checkedOutAt: expiryAt, dueAt: new Date(expiryAt.getTime() + 14 * 24 * 60 * 60 * 1000) },
    });
    return result;
  }, { isolationLevel: "Serializable" });
  assert.equal(fulfilled.status, "Fulfilled");

  console.log(JSON.stringify({
    status: "PASS",
    checked: ["health", "pagination", "detail/counters", "search", "400", "401", "403", "BR05 422", "concurrent hold", "FIFO", "cancel", "return allocation", "72h expiry", "queue advance", "held checkout fulfillment"],
    note: "Smoke mutated demo data; reset via npm run db:reset before presenting demo",
  }, null, 2));
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}