import { prisma } from "../db.js";
import { HttpError, requireField, requireUuid } from "../lib/errors.js";

const copyFields = { id: true, barcode: true, status: true, shelfLocation: true, conditionNotes: true };

function parseNumber(value, fallback, min, max, name) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new HttpError(400, "VALIDATION_ERROR", name + " must be an integer from " + min + " to " + max);
  }
  return number;
}

function bookView(book, detail = false) {
  const counts = { Available: 0, Borrowed: 0, Reserved: 0, Damaged: 0, Lost: 0 };
  for (const copy of book.copies) counts[copy.status] += 1;
  const { copies, ...fields } = book;
  const result = {
    ...fields,
    totalCopies: copies.length,
    availableCopies: counts.Available,
    borrowedCopies: counts.Borrowed,
    reservedCopies: counts.Reserved,
    damagedCopies: counts.Damaged,
    lostCopies: counts.Lost,
    shelfLocations: [...new Set(copies.map((copy) => copy.shelfLocation))].sort(),
  };
  if (detail) result.copies = copies;
  return result;
}

const withCopies = { copies: { select: copyFields, orderBy: { barcode: "asc" } } };

export async function listBooks(query) {
  const page = parseNumber(query.page, 1, 1, 1000000, "page");
  const pageSize = parseNumber(query.pageSize, 10, 1, 100, "pageSize");
  const sort = query.sort ?? "title";
  if (!["title", "year"].includes(sort)) {
    throw new HttpError(400, "VALIDATION_ERROR", "sort must be title or year");
  }
  if (query.available !== undefined && !["true", "false", "all"].includes(String(query.available))) {
    throw new HttpError(400, "VALIDATION_ERROR", "available must be true, false or all");
  }
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const category = typeof query.category === "string" ? query.category.trim() : "";
  if (q.length > 150 || category.length > 100) throw new HttpError(400, "VALIDATION_ERROR", "Search filter too long");
  const where = { isActive: true };
  if (q) {
    where.OR = ["title", "author", "category", "isbn"].map((key) => ({
      [key]: { contains: q, mode: "insensitive" },
    }));
  }
  if (category) where.category = { equals: category, mode: "insensitive" };
  if (query.available === "true") where.copies = { some: { status: "Available" } };
  const orderBy = sort === "year"
    ? [{ publicationYear: "desc" }, { title: "asc" }, { id: "asc" }]
    : [{ title: "asc" }, { id: "asc" }];
  const [total, books] = await Promise.all([
    prisma.bookTitle.count({ where }),
    prisma.bookTitle.findMany({ where, include: withCopies, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  return { items: books.map((book) => bookView(book)), pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
}

export async function getBook(id) {
  requireUuid(id);
  const book = await prisma.bookTitle.findFirst({ where: { id, isActive: true }, include: withCopies });
  if (!book) throw new HttpError(404, "BOOK_NOT_FOUND", "Book title not found");
  return bookView(book, true);
}

function bookInput(input, partial = false) {
  const data = {};
  for (const key of ["isbn", "title", "author", "category"]) {
    if (!partial || input[key] !== undefined) {
      const max = key === "isbn" ? 32 : key === "title" || key === "author" ? 300 : 100;
      data[key] = requireField(input[key], key, max);
    }
  }
  if (!partial || input.publicationYear !== undefined) {
    data.publicationYear = parseNumber(input.publicationYear, NaN, 1, 2100, "publicationYear");
  }
  if (input.publisher !== undefined) {
    data.publisher = input.publisher === null ? null : requireField(input.publisher, "publisher", 160);
  }
  if (partial && input.isActive !== undefined) {
    if (typeof input.isActive !== "boolean") throw new HttpError(400, "VALIDATION_ERROR", "isActive must be boolean");
    data.isActive = input.isActive;
  }
  return data;
}

export async function createBook(input) {
  const book = await prisma.bookTitle.create({ data: bookInput(input), include: withCopies });
  return bookView(book, true);
}

async function ensureTitleCanDeactivate(id) {
  const [copies, holds] = await Promise.all([
    prisma.bookCopy.count({ where: { titleId: id } }),
    prisma.reservation.count({ where: { titleId: id, status: { in: ["Pending", "Ready"] } } }),
  ]);
  if (copies || holds) throw new HttpError(409, "TITLE_IN_USE", "Title has copies or active reservations");
}

export async function updateBook(id, input) {
  requireUuid(id);
  const existing = await prisma.bookTitle.findUnique({ where: { id } });
  if (!existing || !existing.isActive) throw new HttpError(404, "BOOK_NOT_FOUND", "Book title not found");
  const data = bookInput(input, true);
  if (!Object.keys(data).length) throw new HttpError(400, "VALIDATION_ERROR", "No editable fields");
  if (data.isActive === false) await ensureTitleCanDeactivate(id);
  const book = await prisma.bookTitle.update({ where: { id }, data, include: withCopies });
  return bookView(book, true);
}

export async function deactivateBook(id) {
  return updateBook(id, { isActive: false });
}

export async function listCopies(titleId) {
  await getBook(titleId);
  return prisma.bookCopy.findMany({ where: { titleId }, orderBy: { barcode: "asc" }, select: copyFields });
}

export async function createCopy(titleId, input) {
  requireUuid(titleId, "titleId");
  await getBook(titleId);
  return prisma.bookCopy.create({
    data: {
      titleId,
      barcode: requireField(input.barcode, "barcode", 80),
      shelfLocation: requireField(input.shelfLocation, "shelfLocation", 100),
      conditionNotes: input.conditionNotes == null ? null : String(input.conditionNotes),
      status: "Available",
    },
    select: copyFields,
  });
}

export async function updateCopy(id, input) {
  requireUuid(id);
  const copy = await prisma.bookCopy.findUnique({ where: { id } });
  if (!copy) throw new HttpError(404, "COPY_NOT_FOUND", "Book copy not found");
  const data = {};
  if (input.shelfLocation !== undefined) data.shelfLocation = requireField(input.shelfLocation, "shelfLocation", 100);
  if (input.conditionNotes !== undefined) data.conditionNotes = input.conditionNotes === null ? null : String(input.conditionNotes);
  if (input.status !== undefined) {
    if (!["Available", "Damaged", "Lost"].includes(input.status)) {
      throw new HttpError(422, "COPY_STATUS_INVALID", "Only Available, Damaged or Lost may be set directly");
    }
    if (["Borrowed", "Reserved"].includes(copy.status)) {
      throw new HttpError(409, "COPY_IN_USE", "Circulation controls Borrowed and Reserved copies");
    }
    data.status = input.status;
  }
  if (!Object.keys(data).length) throw new HttpError(400, "VALIDATION_ERROR", "No editable fields");
  return prisma.bookCopy.update({ where: { id }, data, select: copyFields });
}

export async function deleteCopy(id) {
  requireUuid(id);
  const copy = await prisma.bookCopy.findUnique({ where: { id } });
  if (!copy) throw new HttpError(404, "COPY_NOT_FOUND", "Book copy not found");
  if (["Borrowed", "Reserved"].includes(copy.status)) {
    throw new HttpError(409, "COPY_IN_USE", "Borrowed or Reserved copies cannot be decommissioned");
  }
  const [loans, holds] = await Promise.all([
    prisma.loan.count({ where: { copyId: id } }),
    prisma.reservation.count({ where: { heldCopyId: id } }),
  ]);
  if (loans || holds) {
    throw new HttpError(409, "COPY_HAS_HISTORY", "Copy has historical circulation records");
  }
  await prisma.bookCopy.delete({ where: { id } });
}