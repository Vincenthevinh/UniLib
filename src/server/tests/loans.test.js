import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const librarianId = '11111111-1111-4111-8111-111111111111';
const readerId = '22222222-2222-4222-8222-222222222222';
const otherReaderId = '33333333-3333-4333-8333-333333333333';
const titleId = '44444444-4444-4444-8444-444444444444';
const copyId = '55555555-5555-4555-8555-555555555555';
const loanId = '66666666-6666-4666-8666-666666666666';
const holdId = '77777777-7777-4777-8777-777777777777';

const testSecret = 'unit-test-secret-at-least-32-characters';

function tokenFor(sub, role) {
  return jwt.sign({ sub, role }, testSecret, { algorithm: 'HS256' });
}

const tx = {
  $queryRawUnsafe: jest.fn(),
  user: { findUnique: jest.fn() },
  bookCopy: { findUnique: jest.fn(), update: jest.fn() },
  loan: {
    count: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  reservation: {
    count: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockPrisma = {
  $transaction: jest.fn(),
  user: { findUnique: jest.fn() },
  bookCopy: { findUnique: jest.fn() },
  loan: { findUnique: jest.fn(), findMany: jest.fn() },
};

jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;

  mockPrisma.$transaction.mockImplementation(async (fn) => fn(tx));
  tx.$queryRawUnsafe.mockResolvedValue([]);

  // Auth middleware lookup
  mockPrisma.user.findUnique.mockImplementation(async ({ where }) => {
    if (where?.id === librarianId) {
      return {
        id: librarianId,
        username: 'librarian1',
        email: 'librarian1@unilib.edu.vn',
        fullName: 'Librarian One',
        role: 'Librarian',
        isActive: true,
      };
    }
    if (where?.id === readerId) {
      return {
        id: readerId,
        username: 'reader1',
        email: 'reader1@unilib.edu.vn',
        fullName: 'Reader One',
        role: 'Reader',
        isActive: true,
      };
    }
    if (where?.id === otherReaderId) {
      return {
        id: otherReaderId,
        username: 'reader2',
        email: 'reader2@unilib.edu.vn',
        fullName: 'Reader Two',
        role: 'Reader',
        isActive: true,
      };
    }
    return null;
  });

  // Default copy lookup
  mockPrisma.bookCopy.findUnique.mockResolvedValue({
    id: copyId,
    titleId,
    barcode: 'UNI-001-01',
  });

  tx.user.findUnique.mockResolvedValue({
    id: readerId,
    username: 'reader1',
    fullName: 'Reader One',
    role: 'Reader',
    isActive: true,
  });

  tx.bookCopy.findUnique.mockResolvedValue({
    id: copyId,
    titleId,
    barcode: 'UNI-001-01',
    status: 'Available',
    conditionNotes: null,
    title: { id: titleId, title: 'Database Systems', isbn: '9781000000017', isActive: true },
  });

  tx.loan.count.mockResolvedValue(0);
  tx.loan.findFirst.mockResolvedValue(null);
  tx.loan.create.mockImplementation(async ({ data }) => ({
    id: loanId,
    ...data,
  }));
  tx.bookCopy.update.mockImplementation(async ({ where, data }) => ({
    id: where.id,
    titleId,
    barcode: 'UNI-001-01',
    ...data,
  }));
});

describe('Feature F05: Circulation API (Loans Checkout, Return, Renew)', () => {
  describe('AC-F05-01 & FR-F06-06: Standard Checkout & Reserved Hold Fulfillment', () => {
    it('AC-F05-01: checks out Available copy with +14 days dueAt, transitions copy to Borrowed, and acquires FOR UPDATE locks', async () => {
      const before = Date.now();
      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        id: loanId,
        readerId,
        copyId,
        status: 'ACTIVE',
        renewalsCount: 0,
      });
      expect(res.body.data.copy.status).toBe('Borrowed');

      const checkedOutMs = new Date(res.body.data.checkedOutAt).getTime();
      const dueMs = new Date(res.body.data.dueAt).getTime();
      expect(checkedOutMs).toBeGreaterThanOrEqual(before - 1000);
      expect(dueMs - checkedOutMs).toBe(14 * 24 * 60 * 60 * 1000);

      // Verify canonical lock order: User -> BookTitle -> BookCopy
      expect(tx.$queryRawUnsafe).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM "users" WHERE id = $1::uuid FOR UPDATE',
        readerId
      );
      expect(tx.$queryRawUnsafe).toHaveBeenNthCalledWith(
        2,
        'SELECT id FROM "book_titles" WHERE id = $1::uuid FOR UPDATE',
        titleId
      );
      expect(tx.$queryRawUnsafe).toHaveBeenNthCalledWith(
        3,
        'SELECT id FROM "book_copies" WHERE id = $1::uuid FOR UPDATE',
        copyId
      );
    });

    it('FR-F06-06: fulfills Ready reservation when matching Reader checks out Reserved copy', async () => {
      const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      tx.bookCopy.findUnique.mockResolvedValue({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: 'Reserved',
        title: { id: titleId, title: 'Database Systems', isbn: '9781000000017', isActive: true },
      });
      tx.reservation.findFirst.mockResolvedValue({
        id: holdId,
        titleId,
        readerId,
        heldCopyId: copyId,
        status: 'Ready',
        expiresAt: futureExpiry,
      });
      tx.reservation.findUnique.mockResolvedValue({
        id: holdId,
        titleId,
        readerId,
        heldCopyId: copyId,
        status: 'Ready',
        expiresAt: futureExpiry,
      });
      tx.reservation.update.mockImplementation(async ({ where, data }) => ({
        id: where.id,
        titleId,
        readerId,
        heldCopyId: copyId,
        ...data,
      }));

      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(201);
      expect(res.body.data.copy.status).toBe('Borrowed');
      expect(res.body.data.fulfilledReservation).toMatchObject({
        id: holdId,
        status: 'Fulfilled',
      });
      expect(tx.reservation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: holdId },
          data: expect.objectContaining({ status: 'Fulfilled' }),
        })
      );
    });

    it('FR-F06-06 negative: rejects checkout when Reserved copy belongs to a different Reader', async () => {
      const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      tx.bookCopy.findUnique.mockResolvedValue({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: 'Reserved',
        title: { id: titleId, title: 'Database Systems', isbn: '9781000000017', isActive: true },
      });
      tx.reservation.findFirst.mockResolvedValue({
        id: holdId,
        titleId,
        readerId: otherReaderId,
        heldCopyId: copyId,
        status: 'Ready',
        expiresAt: futureExpiry,
      });
      tx.reservation.findUnique.mockResolvedValue({
        id: holdId,
        titleId,
        readerId: otherReaderId,
        heldCopyId: copyId,
        status: 'Ready',
        expiresAt: futureExpiry,
      });

      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('HOLD_NOT_ELIGIBLE');
      expect(tx.loan.create).not.toHaveBeenCalled();
      expect(tx.bookCopy.update).not.toHaveBeenCalled();
    });
  });

  describe('AC-F05-02: Maximum Loan Limit Boundary (BR-01)', () => {
    it('AC-F05-02: rejects 4th loan when Reader already has 3 active loans without modifying DB', async () => {
      tx.loan.count
        .mockResolvedValueOnce(3) // activeLoansCount === 3
        .mockResolvedValueOnce(0); // overdueLoansCount === 0

      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('LOAN_LIMIT_EXCEEDED');
      expect(tx.loan.create).not.toHaveBeenCalled();
      expect(tx.bookCopy.update).not.toHaveBeenCalled();
    });
  });

  describe('AC-F05-03: Overdue Borrowing Suspension & Inactive Reader (BR-04)', () => {
    it('AC-F05-03: rejects checkout when Reader has at least 1 overdue loan without modifying DB', async () => {
      tx.loan.count
        .mockResolvedValueOnce(1) // activeLoansCount
        .mockResolvedValueOnce(1); // overdueLoansCount >= 1

      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('READER_OVERDUE');
      expect(tx.loan.create).not.toHaveBeenCalled();
      expect(tx.bookCopy.update).not.toHaveBeenCalled();
    });

    it('rejects checkout for inactive Reader account without modifying DB', async () => {
      tx.user.findUnique.mockResolvedValue({
        id: readerId,
        username: 'reader1',
        fullName: 'Reader One',
        role: 'Reader',
        isActive: false,
      });

      const res = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ readerId, barcode: 'UNI-001-01' });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('READER_INACTIVE');
      expect(tx.loan.create).not.toHaveBeenCalled();
    });
  });

  describe('AC-F05-04 & AC-F05-05: Return Check-in & Hold Routing (BR-07, BR-08)', () => {
    it('AC-F05-04: closes active loan and restores copy to Available when no pending reservations exist', async () => {
      tx.bookCopy.findUnique.mockResolvedValue({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: 'Borrowed',
        conditionNotes: null,
        title: { id: titleId, title: 'Database Systems', isbn: '9781000000017' },
      });
      tx.loan.findFirst.mockResolvedValue({
        id: loanId,
        readerId,
        copyId,
        returnedAt: null,
      });
      tx.loan.update.mockImplementation(async ({ where, data }) => ({
        id: where.id,
        readerId,
        copyId,
        ...data,
      }));
      tx.reservation.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ barcode: 'UNI-001-01' });

      expect(res.status).toBe(200);
      expect(res.body.data.loanStatus).toBe('RETURNED');
      expect(res.body.data.copy.status).toBe('Available');
      expect(res.body.data.hold).toBeNull();
      expect(tx.bookCopy.update).toHaveBeenCalledWith({
        where: { id: copyId },
        data: { status: 'Available' },
      });
    });

    it('AC-F05-05: closes active loan, allocates top FIFO pending hold for 72h, and sets copy to Reserved', async () => {
      tx.bookCopy.findUnique.mockResolvedValue({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: 'Borrowed',
        conditionNotes: null,
        title: { id: titleId, title: 'Database Systems', isbn: '9781000000017' },
      });
      tx.loan.findFirst.mockResolvedValue({
        id: loanId,
        readerId,
        copyId,
        returnedAt: null,
      });
      tx.loan.update.mockImplementation(async ({ where, data }) => ({
        id: where.id,
        readerId,
        copyId,
        ...data,
      }));
      tx.reservation.findFirst.mockResolvedValue({
        id: holdId,
        readerId: otherReaderId,
        titleId,
        status: 'Pending',
      });
      tx.reservation.update.mockImplementation(async ({ where, data }) => ({
        id: where.id,
        readerId: otherReaderId,
        titleId,
        ...data,
      }));

      const res = await request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ barcode: 'UNI-001-01' });

      expect(res.status).toBe(200);
      expect(res.body.data.loanStatus).toBe('RETURNED');
      expect(res.body.data.copy.status).toBe('Reserved');
      expect(res.body.data.hold).toMatchObject({
        id: holdId,
        readerId: otherReaderId,
        heldCopyId: copyId,
        status: 'Ready',
      });

      const readyMs = new Date(res.body.data.hold.readyAt).getTime();
      const expiresMs = new Date(res.body.data.hold.expiresAt).getTime();
      expect(expiresMs - readyMs).toBe(72 * 60 * 60 * 1000);
      expect(tx.bookCopy.update).toHaveBeenCalledWith({
        where: { id: copyId },
        data: { status: 'Reserved' },
      });
    });

    it('rejects duplicate return when copy is not Borrowed', async () => {
      tx.bookCopy.findUnique.mockResolvedValue({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: 'Available',
        title: { id: titleId, title: 'Database Systems' },
      });
      tx.loan.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .send({ barcode: 'UNI-001-01' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('COPY_NOT_BORROWED');
    });
  });

  describe('AC-F05-06: Loan Renewal Policy (BR-03)', () => {
    const baseDue = new Date('2026-12-09T10:00:00.000Z');

    it('AC-F05-06 (1st renewal): extends dueAt by +14 days when active, not overdue, not renewed, and no pending holds', async () => {
      const loanRecord = {
        id: loanId,
        readerId,
        copyId,
        dueAt: baseDue,
        returnedAt: null,
        renewedAt: null,
        copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
      };
      mockPrisma.loan.findUnique.mockResolvedValue(loanRecord);
      tx.loan.findUnique.mockResolvedValue(loanRecord);
      tx.reservation.count.mockResolvedValue(0);
      tx.loan.update.mockImplementation(async ({ where, data }) => ({
        id: where.id,
        readerId,
        copyId,
        ...data,
      }));

      const res = await request(app)
        .post(`/api/loans/${loanId}/renew`)
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`);

      expect(res.status).toBe(200);
      expect(res.body.data.renewalsCount).toBe(1);
      expect(new Date(res.body.data.dueAt).getTime()).toBe(
        baseDue.getTime() + 14 * 24 * 60 * 60 * 1000
      );
    });

    it('AC-F05-06 (2nd renewal): rejects second renewal with HTTP 422 without changing dueAt', async () => {
      const alreadyRenewedLoan = {
        id: loanId,
        readerId,
        copyId,
        dueAt: baseDue,
        returnedAt: null,
        renewedAt: new Date('2026-11-24T10:00:00.000Z'),
        copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
      };
      mockPrisma.loan.findUnique.mockResolvedValue(alreadyRenewedLoan);
      tx.loan.findUnique.mockResolvedValue(alreadyRenewedLoan);

      const res = await request(app)
        .post(`/api/loans/${loanId}/renew`)
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`);

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('RENEWAL_LIMIT_EXCEEDED');
      expect(tx.loan.update).not.toHaveBeenCalled();
    });

    it('rejects renewal for an overdue loan with HTTP 422', async () => {
      const overdueLoan = {
        id: loanId,
        readerId,
        copyId,
        dueAt: new Date('2026-11-01T10:00:00.000Z'),
        returnedAt: null,
        renewedAt: null,
        copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
      };
      mockPrisma.loan.findUnique.mockResolvedValue(overdueLoan);
      tx.loan.findUnique.mockResolvedValue(overdueLoan);

      const res = await request(app)
        .post(`/api/loans/${loanId}/renew`)
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`);

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('OVERDUE_RENEWAL_DENIED');
      expect(tx.loan.update).not.toHaveBeenCalled();
    });

    it('rejects renewal when a pending reservation exists for the book title', async () => {
      const loanRecord = {
        id: loanId,
        readerId,
        copyId,
        dueAt: baseDue,
        returnedAt: null,
        renewedAt: null,
        copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
      };
      mockPrisma.loan.findUnique.mockResolvedValue(loanRecord);
      tx.loan.findUnique.mockResolvedValue(loanRecord);
      tx.reservation.count.mockResolvedValue(1);

      const res = await request(app)
        .post(`/api/loans/${loanId}/renew`)
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`);

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('PENDING_RESERVATION_EXISTS');
      expect(tx.loan.update).not.toHaveBeenCalled();
    });

    it('forbids Reader from renewing another Reader loan (HTTP 403)', async () => {
      mockPrisma.loan.findUnique.mockResolvedValue({
        id: loanId,
        readerId: otherReaderId,
        copyId,
        dueAt: baseDue,
        returnedAt: null,
        renewedAt: null,
        copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
      });

      const res = await request(app)
        .post(`/api/loans/${loanId}/renew`)
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('AC-F05-07: RBAC Authorization on Circulation Endpoints (BR-10, NFR-04)', () => {
    it('AC-F05-07: blocks Reader from checkout and return with HTTP 403 and unauthenticated with 401', async () => {
      await request(app)
        .post('/api/loans/checkout')
        .send({ readerId, barcode: 'UNI-001-01' })
        .expect(401);

      const readerCheckout = await request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .send({ readerId, barcode: 'UNI-001-01' });
      expect(readerCheckout.status).toBe(403);
      expect(readerCheckout.body.error.code).toBe('FORBIDDEN');

      const readerReturn = await request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .send({ barcode: 'UNI-001-01' });
      expect(readerReturn.status).toBe(403);
      expect(readerReturn.body.error.code).toBe('FORBIDDEN');
      expect(tx.loan.create).not.toHaveBeenCalled();
    });
  });

  describe('NFR-05: Parallel Checkout Race Serialization on Same Copy', () => {
    it('allows only 1 of 2 simultaneous checkout requests for the same copy barcode to succeed', async () => {
      let copyState = 'Available';
      let lockQueue = Promise.resolve();

      mockPrisma.$transaction.mockImplementation(async (fn) => {
        const previous = lockQueue;
        let release;
        lockQueue = new Promise((resolve) => {
          release = resolve;
        });
        await previous;
        try {
          return await fn(tx);
        } finally {
          release();
        }
      });

      tx.bookCopy.findUnique.mockImplementation(async () => ({
        id: copyId,
        titleId,
        barcode: 'UNI-001-01',
        status: copyState,
        title: { id: titleId, title: 'Database Systems', isbn: '9781000000017', isActive: true },
      }));

      tx.bookCopy.update.mockImplementation(async ({ where, data }) => {
        copyState = data.status;
        return { id: where.id, titleId, barcode: 'UNI-001-01', status: copyState };
      });

      const librarianJwt = tokenFor(librarianId, 'Librarian');
      const [res1, res2] = await Promise.all([
        request(app)
          .post('/api/loans/checkout')
          .set('Authorization', `Bearer ${librarianJwt}`)
          .send({ readerId, barcode: 'UNI-001-01' }),
        request(app)
          .post('/api/loans/checkout')
          .set('Authorization', `Bearer ${librarianJwt}`)
          .send({ readerId: otherReaderId, barcode: 'UNI-001-01' }),
      ]);

      const statuses = [res1.status, res2.status].sort((a, b) => a - b);
      expect(statuses).toEqual([201, 409]);
      expect(tx.loan.create).toHaveBeenCalledTimes(1);
    });
  });
});
