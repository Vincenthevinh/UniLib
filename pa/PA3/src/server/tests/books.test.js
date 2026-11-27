import { jest, describe, beforeEach, test, expect } from "@jest/globals";

const mockPrisma = {
  bookTitle: { count: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
  bookCopy: { count: jest.fn(), findMany: jest.fn() },
  reservation: { count: jest.fn() },
  user: { findUnique: jest.fn() },
  $queryRawUnsafe: jest.fn(),
};
jest.unstable_mockModule("../db.js", () => ({ prisma: mockPrisma }));
const { app } = await import("../app.js");
const request = (await import("supertest")).default;
const jwt = (await import("jsonwebtoken")).default;

const userId = "11111111-1111-4111-8111-111111111111";
const bookId = "22222222-2222-4222-8222-222222222222";
const book = {
  id: bookId, isbn: "978-0132350884", title: "Clean Code", author: "Robert Martin",
  category: "Software", publicationYear: 2008, isActive: true,
  copies: [{ id: "33333333-3333-4333-8333-333333333333", barcode: "BC-001", status: "Available", shelfLocation: "A-01" }],
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "unit-test-secret-at-least-32-characters";
  mockPrisma.user.findUnique.mockResolvedValue({ id: userId, role: "Reader", isActive: true });
  mockPrisma.bookTitle.count.mockResolvedValue(1);
  mockPrisma.bookTitle.findMany.mockResolvedValue([book]);
});

function token(role = "Reader") {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, { algorithm: "HS256" });
}

describe("F02-F04 catalog contracts", () => {
  test("defaults to page size 10 and returns live copy counters", async () => {
    const res = await request(app).get("/api/books").expect(200);
    expect(res.body.pagination).toEqual({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
    expect(res.body.items[0]).toMatchObject({ title: "Clean Code", totalCopies: 1, availableCopies: 1, shelfLocations: ["A-01"] });
    expect(mockPrisma.bookTitle.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10, skip: 0 }));
  });

  test("page 2 uses skip=10 and availability filter", async () => {
    mockPrisma.bookTitle.count.mockResolvedValue(25);
    const res = await request(app).get("/api/books?page=2&available=true&sort=year").expect(200);
    expect(res.body.pagination.totalPages).toBe(3);
    expect(mockPrisma.bookTitle.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 10, take: 10, where: expect.objectContaining({ copies: { some: { status: "Available" } } }),
    }));
  });

  test("no result is an empty 200 response", async () => {
    mockPrisma.bookTitle.count.mockResolvedValue(0);
    mockPrisma.bookTitle.findMany.mockResolvedValue([]);
    const res = await request(app).get("/api/books?q=notfound").expect(200);
    expect(res.body.items).toEqual([]);
  });

  test("invalid pagination is rejected with stable envelope", async () => {
    const res = await request(app).get("/api/books?page=0").expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("unauthenticated write is 401, Reader write is 403", async () => {
    await request(app).post("/api/books").send(book).expect(401);
    await request(app).post("/api/books").set("Authorization", "Bearer " + token()).send(book).expect(403);
  });

  test("duplicate ISBN maps to 409", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: userId, role: "Librarian", isActive: true });
    mockPrisma.bookTitle.create.mockRejectedValue({ code: "P2002" });
    const res = await request(app).post("/api/books").set("Authorization", "Bearer " + token("Librarian"))
      .send({ isbn: "978-0132350884", title: "Clean Code", author: "Robert Martin", category: "Software", publicationYear: 2008 })
      .expect(409);
    expect(res.body.error.code).toBe("DUPLICATE_RESOURCE");
  });
});