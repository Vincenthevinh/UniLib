import { jest, describe, beforeEach, test, expect } from "@jest/globals";

const readerId = "11111111-1111-4111-8111-111111111111";
const titleId = "22222222-2222-4222-8222-222222222222";
const copyId = "33333333-3333-4333-8333-333333333333";
const holdId = "44444444-4444-4444-8444-444444444444";
const now = new Date("2026-11-23T10:00:00.000Z");

const tx = {
  $queryRawUnsafe: jest.fn(),
  user: { findUnique: jest.fn() },
  bookTitle: { findUnique: jest.fn() },
  bookCopy: { count: jest.fn(), update: jest.fn() },
  reservation: { count: jest.fn(), create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  loan: { count: jest.fn() },
};
const prisma = {
  $transaction: jest.fn(),
  reservation: { findUnique: jest.fn(), findMany: jest.fn() },
};
jest.unstable_mockModule("../db.js", () => ({ prisma }));
const svc = await import("../services/reservations.js");

beforeEach(() => {
  jest.clearAllMocks();
  tx.$queryRawUnsafe.mockResolvedValue([]);
  prisma.$transaction.mockImplementation(async (fn) => fn(tx));
  tx.user.findUnique.mockResolvedValue({ id: readerId, isActive: true, role: "Reader" });
  tx.bookTitle.findUnique.mockResolvedValue({ id: titleId, isActive: true });
  tx.bookCopy.count.mockResolvedValueOnce(3).mockResolvedValueOnce(0).mockResolvedValueOnce(3);
  tx.reservation.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
  tx.loan.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
  tx.reservation.create.mockResolvedValue({ id: holdId, readerId, titleId, status: "Pending", createdAt: now });
  tx.reservation.findMany.mockResolvedValue([{ id: holdId }]);
  tx.reservation.update.mockImplementation(async ({ where, data }) => ({ id: where.id, titleId, readerId, ...data }));
  tx.bookCopy.update.mockResolvedValue({ id: copyId });
});

describe("F06 reservation and hold rules", () => {
  test("eligible reader queues Pending reservation at position 1", async () => {
    const result = await svc.placeReservation(readerId, titleId, now);
    expect(result.queuePosition).toBe(1);
    expect(result.reservation.status).toBe("Pending");
    expect(tx.$queryRawUnsafe).toHaveBeenCalledTimes(2);
    expect(tx.reservation.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ readerId, titleId, status: "Pending" }) }));
  });

  test("reservation rejected if a copy is Available", async () => {
    tx.bookCopy.count.mockReset().mockResolvedValueOnce(3).mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    await expect(svc.placeReservation(readerId, titleId, now)).rejects.toMatchObject({ status: 422, code: "COPY_AVAILABLE" });
    expect(tx.reservation.create).not.toHaveBeenCalled();
  });

  test("third active reservation is rejected", async () => {
    tx.reservation.count.mockReset().mockResolvedValueOnce(2).mockResolvedValueOnce(0);
    await expect(svc.placeReservation(readerId, titleId, now)).rejects.toMatchObject({ status: 422, code: "RESERVATION_LIMIT" });
  });

  test("overdue loan blocks new reservation", async () => {
    tx.loan.count.mockReset().mockResolvedValueOnce(0).mockResolvedValueOnce(1);
    await expect(svc.placeReservation(readerId, titleId, now)).rejects.toMatchObject({ status: 422, code: "READER_OVERDUE" });
  });

  test("FIFO allocation sets Ready and exact 72-hour expiry", async () => {
    tx.reservation.findFirst.mockResolvedValue({ id: holdId, titleId, status: "Pending" });
    const result = await svc.allocateNextHold(tx, titleId, copyId, now);
    expect(result.status).toBe("Ready");
    expect(result.expiresAt.toISOString()).toBe("2026-11-26T10:00:00.000Z");
    expect(tx.bookCopy.update).toHaveBeenCalledWith({ where: { id: copyId }, data: { status: "Reserved" } });
  });

  test("no pending queue releases copy as Available", async () => {
    tx.reservation.findFirst.mockResolvedValue(null);
    await svc.allocateNextHold(tx, titleId, copyId, now);
    expect(tx.bookCopy.update).toHaveBeenCalledWith({ where: { id: copyId }, data: { status: "Available" } });
  });

  test("expiry rechecks Ready state, marks Expired and releases copy", async () => {
    prisma.reservation.findMany.mockResolvedValue([{ id: holdId, titleId }]);
    tx.reservation.findUnique.mockResolvedValue({ id: holdId, titleId, heldCopyId: copyId, status: "Ready", expiresAt: new Date(now.getTime() - 1000) });
    tx.reservation.findFirst.mockResolvedValue(null);
    const result = await svc.sweepExpiredHolds(now);
    expect(result).toEqual({ inspected: 1, expired: 1 });
    expect(tx.reservation.update).toHaveBeenCalledWith({ where: { id: holdId }, data: { status: "Expired" } });
    expect(tx.bookCopy.update).toHaveBeenCalledWith({ where: { id: copyId }, data: { status: "Available" } });
  });

  test("sweeper is idempotent if hold already fulfilled", async () => {
    prisma.reservation.findMany.mockResolvedValue([{ id: holdId, titleId }]);
    tx.reservation.findUnique.mockResolvedValue({ id: holdId, titleId, heldCopyId: copyId, status: "Fulfilled", expiresAt: now });
    const result = await svc.sweepExpiredHolds(now);
    expect(result.expired).toBe(0);
    expect(tx.reservation.update).not.toHaveBeenCalled();
  });

  test("only owner may cancel a reservation", async () => {
    prisma.reservation.findUnique.mockResolvedValue({ id: holdId, readerId: "99999999-9999-4999-8999-999999999999", titleId });
    await expect(svc.cancelReservation(readerId, holdId, now)).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" });
  });
});