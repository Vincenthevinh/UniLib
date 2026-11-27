import { prisma } from "../db.js";
import { HttpError, requireUuid } from "../lib/errors.js";

const ACTIVE = ["Pending", "Ready"];
const HOLD_MS = 72 * 60 * 60 * 1000;
const orderBy = [{ createdAt: "asc" }, { id: "asc" }];
const serializable = { isolationLevel: "Serializable", timeout: 10000, maxWait: 10000 };

async function lockUser(tx, readerId) {
  await tx.$queryRawUnsafe('SELECT id FROM "users" WHERE id = $1::uuid FOR UPDATE', readerId);
}

async function lockTitle(tx, titleId) {
  await tx.$queryRawUnsafe('SELECT id FROM "book_titles" WHERE id = $1::uuid FOR UPDATE', titleId);
}

async function lockCopy(tx, copyId) {
  await tx.$queryRawUnsafe('SELECT id FROM "book_copies" WHERE id = $1::uuid FOR UPDATE', copyId);
}

function ensureReader(reader) {
  if (!reader || reader.role !== "Reader" || !reader.isActive) {
    throw new HttpError(422, "READER_INACTIVE", "Only active Readers may reserve titles");
  }
}

async function queuePosition(tx, reservation) {
  if (reservation.status !== "Pending") return 0;
  const waiting = await tx.reservation.findMany({
    where: { titleId: reservation.titleId, status: "Pending" },
    orderBy,
    select: { id: true },
  });
  return waiting.findIndex((entry) => entry.id === reservation.id) + 1;
}

export async function placeReservation(readerId, titleId, now = new Date()) {
  requireUuid(readerId, "readerId");
  requireUuid(titleId, "titleId");
  return prisma.$transaction(async (tx) => {
    // Serialize all reservations by reader and by title before checking limits/availability.
    await lockUser(tx, readerId);
    await lockTitle(tx, titleId);
    const [reader, title] = await Promise.all([
      tx.user.findUnique({ where: { id: readerId } }),
      tx.bookTitle.findUnique({ where: { id: titleId } }),
    ]);
    ensureReader(reader);
    if (!title || !title.isActive) throw new HttpError(404, "BOOK_NOT_FOUND", "Book title not found");
    const [copyCount, availableCount, circulatingCount, activeHolds, sameTitleHold, activeLoan, overdueLoan] = await Promise.all([
      tx.bookCopy.count({ where: { titleId } }),
      tx.bookCopy.count({ where: { titleId, status: "Available" } }),
      tx.bookCopy.count({ where: { titleId, status: { in: ["Borrowed", "Reserved"] } } }),
      tx.reservation.count({ where: { readerId, status: { in: ACTIVE } } }),
      tx.reservation.count({ where: { readerId, titleId, status: { in: ACTIVE } } }),
      tx.loan.count({ where: { readerId, returnedAt: null, copy: { titleId } } }),
      tx.loan.count({ where: { readerId, returnedAt: null, dueAt: { lt: now } } }),
    ]);
    if (availableCount > 0) throw new HttpError(422, "COPY_AVAILABLE", "An available copy must be borrowed, not reserved");
    if (copyCount === 0 || circulatingCount === 0) {
      throw new HttpError(422, "NO_CIRCULATING_COPY", "No circulating copy can fulfill this reservation");
    }
    if (overdueLoan > 0) throw new HttpError(422, "READER_OVERDUE", "Overdue loans block new reservations");
    if (activeLoan > 0) throw new HttpError(422, "TITLE_ALREADY_BORROWED", "Reader already borrows this title");
    if (sameTitleHold > 0) throw new HttpError(422, "RESERVATION_DUPLICATE", "Reader already reserved this title");
    if (activeHolds >= 2) throw new HttpError(422, "RESERVATION_LIMIT", "Reader already has two active reservations");
    const reservation = await tx.reservation.create({
      data: { readerId, titleId, status: "Pending", createdAt: now },
    });
    return { reservation, queuePosition: await queuePosition(tx, reservation) };
  }, serializable);
}

export async function listMine(readerId) {
  requireUuid(readerId, "readerId");
  const reservations = await prisma.reservation.findMany({
    where: { readerId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: { title: { select: { id: true, title: true, isbn: true } } },
  });
  const result = [];
  for (const reservation of reservations) {
    result.push({ ...reservation, queuePosition: await queuePosition(prisma, reservation) });
  }
  return result;
}

export async function listQueue(titleId) {
  const where = { status: { in: ACTIVE } };
  if (titleId) where.titleId = requireUuid(titleId, "titleId");
  return prisma.reservation.findMany({
    where,
    orderBy: [{ titleId: "asc" }, { createdAt: "asc" }, { id: "asc" }],
    include: {
      reader: { select: { id: true, username: true, fullName: true } },
      title: { select: { id: true, title: true, isbn: true } },
      heldCopy: { select: { id: true, barcode: true, shelfLocation: true } },
    },
  });
}

export async function allocateNextHold(tx, titleId, copyId, now = new Date()) {
  requireUuid(titleId, "titleId");
  requireUuid(copyId, "copyId");
  // Caller must hold the title/copy lock inside its checkout/check-in/expiry transaction.
  const pending = await tx.reservation.findFirst({
    where: { titleId, status: "Pending" },
    orderBy,
  });
  if (!pending) {
    await tx.bookCopy.update({ where: { id: copyId }, data: { status: "Available" } });
    return null;
  }
  const ready = await tx.reservation.update({
    where: { id: pending.id },
    data: {
      status: "Ready",
      heldCopyId: copyId,
      readyAt: now,
      expiresAt: new Date(now.getTime() + HOLD_MS),
    },
  });
  await tx.bookCopy.update({ where: { id: copyId }, data: { status: "Reserved" } });
  return ready;
}

export async function cancelReservation(readerId, reservationId, now = new Date()) {
  requireUuid(readerId, "readerId");
  requireUuid(reservationId, "reservationId");
  const found = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!found) throw new HttpError(404, "RESERVATION_NOT_FOUND", "Reservation not found");
  if (found.readerId !== readerId) throw new HttpError(403, "FORBIDDEN", "Cannot cancel another reader's reservation");
  return prisma.$transaction(async (tx) => {
    await lockUser(tx, readerId);
    await lockTitle(tx, found.titleId);
    const hold = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!hold || !ACTIVE.includes(hold.status)) {
      throw new HttpError(409, "RESERVATION_NOT_ACTIVE", "Reservation is no longer active");
    }
    if (hold.heldCopyId) await lockCopy(tx, hold.heldCopyId);
    const cancelled = await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "Cancelled", cancelledAt: now },
    });
    if (hold.status === "Ready" && hold.heldCopyId) {
      await allocateNextHold(tx, hold.titleId, hold.heldCopyId, now);
    }
    return cancelled;
  }, serializable);
}

export async function fulfillHeldReservation(tx, readerId, copyId, now = new Date()) {
  requireUuid(readerId, "readerId");
  requireUuid(copyId, "copyId");
  const candidate = await tx.reservation.findFirst({
    where: { heldCopyId: copyId, status: "Ready" },
  });
  if (!candidate) throw new HttpError(409, "HOLD_NOT_FOUND", "Copy has no active Ready hold");
  await lockTitle(tx, candidate.titleId);
  const hold = await tx.reservation.findUnique({ where: { id: candidate.id } });
  if (hold.status !== "Ready" || hold.readerId !== readerId || hold.expiresAt <= now) {
    throw new HttpError(409, "HOLD_NOT_ELIGIBLE", "Hold belongs to a different reader or has expired");
  }
  return tx.reservation.update({ where: { id: hold.id }, data: { status: "Fulfilled", fulfilledAt: now } });
}

export async function sweepExpiredHolds(now = new Date(), maxRows = 100) {
  const due = await prisma.reservation.findMany({
    where: { status: "Ready", expiresAt: { lte: now } },
    orderBy: [{ expiresAt: "asc" }, { id: "asc" }],
    take: maxRows,
    select: { id: true, titleId: true },
  });
  let expired = 0;
  for (const candidate of due) {
    const handled = await prisma.$transaction(async (tx) => {
      await lockTitle(tx, candidate.titleId);
      const current = await tx.reservation.findUnique({ where: { id: candidate.id } });
      if (!current || current.status !== "Ready" || !current.heldCopyId || current.expiresAt > now) {
        return false;
      }
      await lockCopy(tx, current.heldCopyId);
      await tx.reservation.update({ where: { id: current.id }, data: { status: "Expired" } });
      await allocateNextHold(tx, current.titleId, current.heldCopyId, now);
      return true;
    }, serializable);
    if (handled) expired += 1;
  }
  return { inspected: due.length, expired };
}