import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const testSecret = 'unit-test-secret-at-least-32-characters';
const readerId = '11111111-1111-4111-8111-111111111111';
const otherReaderId = '22222222-2222-4222-8222-222222222222';
const librarianId = '33333333-3333-4333-8333-333333333333';
const adminId = '44444444-4444-4444-8444-444444444444';

const titleA = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const titleB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const titleC = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const copyA = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const copyB = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const loan1Id = '10000000-0000-4000-8000-000000000001';
const loan2Id = '10000000-0000-4000-8000-000000000002';
const res1Id = '20000000-0000-4000-8000-000000000001';
const res2Id = '20000000-0000-4000-8000-000000000002';
const resOtherId = '20000000-0000-4000-8000-000000000003';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  loan: { findMany: jest.fn(), count: jest.fn() },
  reservation: { findMany: jest.fn(), count: jest.fn() },
  bookTitle: { count: jest.fn() },
  bookCopy: { count: jest.fn() },
};

jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

function tokenFor(sub, role) {
  return jwt.sign({ sub, role }, testSecret, { algorithm: 'HS256' });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;

  mockPrisma.user.findUnique.mockImplementation(async ({ where }) => {
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
    if (where?.id === adminId) {
      return {
        id: adminId,
        username: 'admin',
        email: 'admin@unilib.edu.vn',
        fullName: 'Admin One',
        role: 'Administrator',
        isActive: true,
      };
    }
    return null;
  });
});

describe('Feature F07: Reader Dashboard & Librarian Overdue API', () => {
  describe('GET /api/me/dashboard (FR-F07-01, FR-F07-02, AC-F07-01)', () => {
    it('enforces RBAC: 401 without token, 403 for Librarian and Administrator', async () => {
      await request(app).get('/api/me/dashboard').expect(401);
      await request(app)
        .get('/api/me/dashboard')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .expect(403);
      await request(app)
        .get('/api/me/dashboard')
        .set('Authorization', `Bearer ${tokenFor(adminId, 'Administrator')}`)
        .expect(403);
    });

    it('returns active loans with dueDate, canRenew, reservations + queuePosition, overdue flags, and restrictions', async () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      // Loan 1: on-time, not renewed, no pending holds -> canRenew: true
      // Loan 2: 4 days overdue -> isOverdue: true, canRenew: false (OVERDUE_RENEWAL_DENIED)
      mockPrisma.loan.findMany.mockResolvedValue([
        {
          id: loan2Id,
          readerId,
          copyId: copyB,
          checkedOutAt: new Date(now - 18 * dayMs),
          dueAt: new Date(now - 4 * dayMs),
          returnedAt: null,
          renewedAt: null,
          copy: {
            id: copyB,
            titleId: titleB,
            barcode: 'UNI-002-01',
            shelfLocation: 'S-02',
            status: 'Borrowed',
            title: { id: titleB, isbn: '9781000000020', title: 'Clean Code', author: 'Robert Martin', category: 'Software' },
          },
        },
        {
          id: loan1Id,
          readerId,
          copyId: copyA,
          checkedOutAt: new Date(now - 3 * dayMs),
          dueAt: new Date(now + 11 * dayMs),
          returnedAt: null,
          renewedAt: null,
          copy: {
            id: copyA,
            titleId: titleA,
            barcode: 'UNI-001-01',
            shelfLocation: 'S-01',
            status: 'Borrowed',
            title: { id: titleA, isbn: '9781000000017', title: 'Database Systems', author: 'Silberschatz', category: 'Databases' },
          },
        },
      ]);

      // 1st reservation query: reader's active reservations
      // 2nd reservation query: pending holds on borrowed titles (none)
      // 3rd reservation query: all pending holds on titleC to compute FIFO queuePosition
      mockPrisma.reservation.findMany
        .mockResolvedValueOnce([
          {
            id: res1Id,
            readerId,
            titleId: titleC,
            heldCopyId: null,
            status: 'Pending',
            createdAt: new Date(now - 60 * 60 * 1000),
            readyAt: null,
            expiresAt: null,
            title: { id: titleC, isbn: '9781000000031', title: 'Operating Systems', author: 'Tanenbaum', category: 'Systems' },
            heldCopy: null,
          },
          {
            id: res2Id,
            readerId,
            titleId: titleB,
            heldCopyId: copyB,
            status: 'Ready',
            createdAt: new Date(now - 5 * 60 * 60 * 1000),
            readyAt: new Date(now - 2 * 60 * 60 * 1000),
            expiresAt: new Date(now + 70 * 60 * 60 * 1000),
            title: { id: titleB, isbn: '9781000000020', title: 'Clean Code', author: 'Robert Martin', category: 'Software' },
            heldCopy: { id: copyB, barcode: 'UNI-002-01', shelfLocation: 'S-02', status: 'Reserved' },
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { id: resOtherId, titleId: titleC },
          { id: res1Id, titleId: titleC },
        ]);

      const res = await request(app)
        .get('/api/me/dashboard')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .expect(200);

      expect(res.body.readerId).toBe(readerId);
      expect(res.body.loans).toHaveLength(2);

      const overdueLoan = res.body.loans.find((l) => l.id === loan2Id);
      const validLoan = res.body.loans.find((l) => l.id === loan1Id);

      expect(overdueLoan).toMatchObject({
        isOverdue: true,
        canRenew: false,
        renewBlockReason: 'OVERDUE_RENEWAL_DENIED',
      });
      expect(overdueLoan.lateDays).toBeGreaterThanOrEqual(4);
      expect(overdueLoan.dueDate).toBeDefined();

      expect(validLoan).toMatchObject({
        isOverdue: false,
        canRenew: true,
        renewBlockReason: null,
        bookTitle: 'Database Systems',
      });

      expect(res.body.reservations).toHaveLength(2);
      const pendingRes = res.body.reservations.find((r) => r.id === res1Id);
      const readyRes = res.body.reservations.find((r) => r.id === res2Id);
      expect(pendingRes.queuePosition).toBe(2);
      expect(readyRes.queuePosition).toBe(0);
      expect(readyRes.pickupDeadline).toBeDefined();

      expect(res.body.overdueFlags).toMatchObject({
        hasOverdue: true,
        overdueCount: 1,
        overdueLoanIds: [loan2Id],
      });
      expect(res.body.restrictions).toMatchObject({
        borrowingBlocked: true,
        reservingBlocked: true,
        canBorrow: false,
        canReserve: false,
        activeLoansCount: 2,
        maxActiveLoans: 3,
        activeReservationsCount: 2,
        maxActiveReservations: 2,
      });
      expect(res.body.restrictions.reasons.some((r) => r.code === 'READER_OVERDUE')).toBe(true);
      expect(res.body.restrictions.reasons.some((r) => r.code === 'RESERVATION_LIMIT')).toBe(true);
      expect(res.body.alerts.length).toBeGreaterThanOrEqual(2);
    });

    it('marks canRenew false when a Pending reservation exists on the borrowed title or already renewed (BR-03)', async () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      mockPrisma.loan.findMany.mockResolvedValue([
        {
          id: loan1Id,
          readerId,
          copyId: copyA,
          checkedOutAt: new Date(now - 2 * dayMs),
          dueAt: new Date(now + 12 * dayMs),
          returnedAt: null,
          renewedAt: null,
          copy: {
            id: copyA,
            titleId: titleA,
            barcode: 'UNI-001-01',
            shelfLocation: 'S-01',
            status: 'Borrowed',
            title: { id: titleA, isbn: '9781000000017', title: 'Database Systems', author: 'Silberschatz', category: 'Databases' },
          },
        },
        {
          id: loan2Id,
          readerId,
          copyId: copyB,
          checkedOutAt: new Date(now - 10 * dayMs),
          dueAt: new Date(now + 18 * dayMs),
          returnedAt: null,
          renewedAt: new Date(now - 1 * dayMs),
          copy: {
            id: copyB,
            titleId: titleB,
            barcode: 'UNI-002-01',
            shelfLocation: 'S-02',
            status: 'Borrowed',
            title: { id: titleB, isbn: '9781000000020', title: 'Clean Code', author: 'Robert Martin', category: 'Software' },
          },
        },
      ]);

      mockPrisma.reservation.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ titleId: titleA }]);

      const res = await request(app)
        .get('/api/me/dashboard')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .expect(200);

      const heldLoan = res.body.loans.find((l) => l.id === loan1Id);
      const alreadyRenewedLoan = res.body.loans.find((l) => l.id === loan2Id);
      expect(heldLoan.canRenew).toBe(false);
      expect(heldLoan.renewBlockReason).toBe('PENDING_RESERVATION_EXISTS');
      expect(alreadyRenewedLoan.canRenew).toBe(false);
      expect(alreadyRenewedLoan.renewBlockReason).toBe('RENEWAL_LIMIT_EXCEEDED');
    });

    it('blocks borrowing when Reader reaches 3 active loans even with 0 overdue (BR-01)', async () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      mockPrisma.loan.findMany.mockResolvedValue(
        [1, 2, 3].map((idx) => ({
          id: `10000000-0000-4000-8000-00000000000${idx}`,
          readerId,
          copyId: copyA,
          checkedOutAt: new Date(now - dayMs),
          dueAt: new Date(now + 13 * dayMs),
          returnedAt: null,
          renewedAt: null,
          copy: {
            id: copyA,
            titleId: titleA,
            barcode: `UNI-001-0${idx}`,
            shelfLocation: 'S-01',
            status: 'Borrowed',
            title: { id: titleA, isbn: '9781000000017', title: 'Database Systems', author: 'Silberschatz', category: 'Databases' },
          },
        }))
      );
      mockPrisma.reservation.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/me/dashboard')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .expect(200);

      expect(res.body.hasOverdue).toBe(false);
      expect(res.body.restrictions.borrowingBlocked).toBe(true);
      expect(res.body.restrictions.reservingBlocked).toBe(false);
      expect(res.body.restrictions.reasons[0].code).toBe('LOAN_LIMIT_EXCEEDED');
    });
  });

  describe('GET /api/librarian/overdue (FR-F07-03, AC-F07-02)', () => {
    it('enforces RBAC: 401 without token, 403 for Reader and Administrator', async () => {
      await request(app).get('/api/librarian/overdue').expect(401);
      await request(app)
        .get('/api/librarian/overdue')
        .set('Authorization', `Bearer ${tokenFor(readerId, 'Reader')}`)
        .expect(403);
      await request(app)
        .get('/api/librarian/overdue')
        .set('Authorization', `Bearer ${tokenFor(adminId, 'Administrator')}`)
        .expect(403);
    });

    it('returns overdue loans sorted by lateDays descending with reader contact and copy/title info', async () => {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      mockPrisma.loan.findMany.mockResolvedValue([
        {
          id: loan1Id,
          readerId,
          copyId: copyA,
          checkedOutAt: new Date(now - 24 * dayMs),
          dueAt: new Date(now - 10 * dayMs),
          returnedAt: null,
          renewedAt: null,
          reader: { id: readerId, username: 'reader1', fullName: 'Reader One', email: 'reader1@unilib.edu.vn' },
          copy: {
            id: copyA,
            barcode: 'UNI-001-01',
            shelfLocation: 'S-01',
            status: 'Borrowed',
            title: { id: titleA, isbn: '9781000000017', title: 'Database Systems', author: 'Silberschatz', category: 'Databases' },
          },
        },
        {
          id: loan2Id,
          readerId: otherReaderId,
          copyId: copyB,
          checkedOutAt: new Date(now - 16 * dayMs),
          dueAt: new Date(now - 2 * dayMs),
          returnedAt: null,
          renewedAt: null,
          reader: { id: otherReaderId, username: 'reader2', fullName: 'Reader Two', email: 'reader2@unilib.edu.vn' },
          copy: {
            id: copyB,
            barcode: 'UNI-002-01',
            shelfLocation: 'S-02',
            status: 'Borrowed',
            title: { id: titleB, isbn: '9781000000020', title: 'Clean Code', author: 'Robert Martin', category: 'Software' },
          },
        },
      ]);

      const res = await request(app)
        .get('/api/librarian/overdue')
        .set('Authorization', `Bearer ${tokenFor(librarianId, 'Librarian')}`)
        .expect(200);

      expect(res.body.total).toBe(2);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.items[0].lateDays).toBeGreaterThanOrEqual(res.body.items[1].lateDays);
      expect(res.body.items[0]).toMatchObject({
        loanId: loan1Id,
        readerName: 'Reader One',
        readerEmail: 'reader1@unilib.edu.vn',
        barcode: 'UNI-001-01',
        bookTitle: 'Database Systems',
        reader: {
          id: readerId,
          username: 'reader1',
          fullName: 'Reader One',
          email: 'reader1@unilib.edu.vn',
        },
        copy: {
          id: copyA,
          barcode: 'UNI-001-01',
          shelfLocation: 'S-01',
        },
        title: {
          id: titleA,
          isbn: '9781000000017',
          title: 'Database Systems',
        },
      });

      expect(mockPrisma.loan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ returnedAt: null }),
          orderBy: [{ dueAt: 'asc' }, { id: 'asc' }],
        })
      );
    });
  });
});
