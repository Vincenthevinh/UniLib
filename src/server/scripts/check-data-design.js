import "dotenv/config";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const root = resolve(import.meta.dirname, "../../..");
const schema = readFileSync(resolve(root, "src/server/prisma/schema.prisma"), "utf8");
const dbml = readFileSync(resolve(root, "docs/design/erd.dbml"), "utf8");
const migration = readFileSync(resolve(root, "src/server/prisma/migrations/20261123000000_init/migration.sql"), "utf8");
const spec = readFileSync(resolve(root, "docs/pa3/data-design.md"), "utf8");

const scalarTypes = new Set(["String", "Int", "Boolean", "DateTime", "Role", "CopyStatus", "ReservationStatus"]);
const models = new Map();
for (const match of schema.matchAll(/model\s+(\w+)\s*{([\s\S]*?)\n}/g)) {
  const name = match[1];
  const body = match[2];
  const table = body.match(/@@map\("([^"]+)"\)/)?.[1];
  assert.ok(table, "Missing @@map on " + name);
  const fields = [];
  for (const line of body.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;
    if (!scalarTypes.has(parts[1].replace("?", ""))) continue;
    const dbName = line.match(/@map\("([^"]+)"\)/)?.[1] || parts[0];
    fields.push(dbName);
  }
  models.set(table, { name, columns: fields.sort() });
}
assert.equal(models.size, 5, "Expected five normalized models");

const diagrams = new Map();
for (const match of dbml.matchAll(/Table\s+(\w+)\s*{([\s\S]*?)\n}/g)) {
  const rows = [];
  for (const line of match[2].split("\n")) {
    const column = line.match(/^\s{2}([A-Za-z_]\w*)\s+(?:uuid|varchar|boolean|smallint|timestamptz|Role|CopyStatus|ReservationStatus|text)\b/);
    if (column) rows.push(column[1]);
  }
  diagrams.set(match[1], rows.sort());
}
assert.equal(diagrams.size, 5, "ERD must show five tables");

const prisma = new PrismaClient();
try {
  const liveColumns = await prisma.$queryRawUnsafe(
    "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('users','book_titles','book_copies','loans','reservations')"
  );
  for (const [table, model] of models) {
    const actual = liveColumns.filter((row) => row.table_name === table).map((row) => row.column_name).sort();
    assert.deepEqual(actual, model.columns, table + " live SQL != Prisma schema");
    assert.deepEqual(diagrams.get(table), model.columns, table + " DBML != Prisma schema");
    assert.ok(migration.includes('CREATE TABLE "' + table + '"'), "Migration missing table " + table);
    assert.ok(spec.includes(table), "Data Specification missing table " + table);
  }
  const liveIndexes = await prisma.$queryRawUnsafe("SELECT indexname FROM pg_indexes WHERE schemaname='public'");
  const names = new Set(liveIndexes.map((row) => row.indexname));
  const required = [
    "book_titles_isbn_key", "book_copies_barcode_key",
    "book_copies_title_id_status_idx", "loans_reader_id_returned_at_idx",
    "reservations_title_id_created_at_idx", "loans_copy_active_unique",
    "reservations_ready_copy_unique", "reservations_active_reader_title_unique",
    "book_titles_title_trgm", "book_titles_author_trgm",
    "book_titles_category_trgm", "book_titles_isbn_trgm",
  ];
  for (const name of required) assert.ok(names.has(name), "Missing index " + name);
  console.log(JSON.stringify({ status: "PASS", tables: [...models.keys()], checkedColumns: liveColumns.length, checkedIndexes: required.length }, null, 2));
} finally {
  await prisma.$disconnect();
}