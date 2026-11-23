import { jest, test, expect } from "@jest/globals";

jest.unstable_mockModule("../db.js", () => ({
  prisma: { $queryRawUnsafe: jest.fn().mockResolvedValue([{ "?column?": 1 }]) },
}));
const { app } = await import("../app.js");
const request = (await import("supertest")).default;

test("Vite client preflight permits JSON and Bearer authorization headers", async () => {
  const response = await request(app).options("/api/books")
    .set("Origin", "http://localhost:5173")
    .set("Access-Control-Request-Method", "POST")
    .set("Access-Control-Request-Headers", "Content-Type,Authorization")
    .expect(204);
  expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  expect(response.headers["access-control-allow-headers"]).toMatch(/Authorization/i);
});