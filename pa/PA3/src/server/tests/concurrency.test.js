import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const testSecret = 'unit-test-secret-at-least-32-characters';
const librarianId = '11111111-1111-4111-8111-111111111111';
const reader1Id = '22222222-2222-4222-8222-222222222222';
const reader2Id = '33333333-3333-4333-8333-333333333333';
const reader3Id = '44444444-4444-4444-8444-444444444444';
const titleId = '55555555-5555-4555-8555-555555555555';
const copyId = '66666666-6666-4666-8666-666666666666';
const loanId = '77777777-7777-4777-8777-777777777777';
const holdId = '88888888-8888-4888-8888-888888888888';

function tokenFor(sub, role) {
  return jwt.sign({ sub, role }, testSecret, { algorithm: 'HS256' });
}

let state;
let lockQueue = Promise.resolve();

function createTx() {
  return {
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    user: {
      findUnique: jest.fn(async ({ where }) => state.users[where.id] || null),
    },
    bookTitle: {
      findUnique: jest.fn(async ({ where }) => (where.id === titleId ? state.title : null)),
    },
    bookCopy: {
      findUnique: jest.fn(async ({ where }) => {
        if (where.id === copyId || where.barcode === state.copy.barcode) {
          return { ...state.copy, title: state.title };
        }
        return null;
      }),
      count: jest.fn(async ({ where }) => {
        if (where.status === 'Available') return state.copy.status === 'Available' ? 1 : 0;
        if (where.status?.in) return where.status.in.includes(state.copy.status) ? 1 : 0;
        return 1;
      }),
      update: jest.fn(async ({ data }) => {
        state.copy.status = data.status;
        return { ...state.copy };
      }),
    },
    loan: {
      count: jest.fn(async ({ where }) => {
        if (where.dueAt) return 0;
        return state.loans.filter((l) => l.readerId === where.readerId && l.returnedAt === null).length;
      }),
      findFirst: jest.fn(async ({ where }) => {
        return state.loans.find((l) => l.copyId === where.copyId && l.returnedAt === null) || null;
      }),
      create: jest.fn(async ({ data }) => {
        const created = { id: `loan-${state.loans.length + 1}`, ...data };
        state.loans.push(created);
        return created;
      }),
      update: jest.fn(async ({ where, data }) => {
        const target = state.loans.find((l) => l.id === where.id);
        Object.assign(target, data);
        return target;
      }),
    },
    reservation: {
      count: jest.fn(async () => 0),
      findFirst: jest.fn(async ({ where }) => {
        if (where.status === 'Pending') {
          return state.reservations.find((r) => r.titleId === where.titleId && r.status === 'Pending') || null;
        }
        if (where.status === 'Ready') {
          return state.reservations.find((r) => r.heldCopyId === where.heldCopyId && r.status === 'Ready') || null;
        }
        return null;
      }),
      findUnique: jest.fn(async ({ where }) => state.reservations.find((r) => r.id === where.id) || null),
      findMany: jest.fn(async () => state.reservations.filter((r) => r.status === 'Pending')),
      create: jest.fn(async ({ data }) => {
        const created = { id: `res-${state.reservations.length + 1}`, ...data };
        state.reservations.push(created);
        return created;
      }),
      update: jest.fn(async ({ where, data }) => {
        const target = state.reservations.find((r) => r.id === where.id);
        Object.assign(target, data);
        return target;
      }),
    },
  };
}

const mockPrisma = {
  $transaction: jest.fn(async (fn) => {
    const previous = lockQueue;
    let release;
    lockQueue = new Promise((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await fn(createTx());
    } finally {
      release();
    }
  }),
  user: {
    findUnique: jest.fn(async ({ where }) => state.users[where.id] || null),
  },
  bookCopy: {
    findUnique: jest.fn(async ({ where }) =>
      where.id === copyId || where.barcode === state.copy.barcode ? state.copy : null
    ),
  },
};

jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;
  lockQueue = Promise.resolve();
  state = {
    users: {
      [librarianId]: { id: librarianId, username: 'librarian1', role: 'Librarian', isActive: true },
      [reader1Id]: { id: reader1Id, username: 'reader1', role: 'Reader', isActive: true },
      [reader2Id]: { id: reader2Id, username: 'reader2', role: 'Reader', isActive: true },
      [reader3Id]: { id: reader3Id, username: 'reader3', role: 'Reader', isActive: true },
    },
    title: { id: titleId, title: 'Distributed Systems', isbn: '9781000000086', isActive: true },
    copy: { id: copyId, titleId, barcode: 'UNI-008-01', shelfLocation: 'S-08', status: 'Available', conditionNotes: null },
    loans: [],
    reservations: [],
  };
});

describe('NFR-05: Concurrency Serialization (Double Checkout & Parallel Return + Allocate)', () => {
  it('allows only 1 of 2 concurrent checkouts on the same copy to succeed (201 vs 409)', async () => {
    const librarianJwt = tokenFor(librarianId, 'Librarian');

    const [res1, res2] = await Promise.all([
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader1Id, barcode: 'UNI-008-01' }),
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader2Id, barcode: 'UNI-008-01' }),
    ]);

    expect([res1.status, res2.status].sort((a, b) => a - b)).toEqual([201, 409]);
    expect(state.copy.status).toBe('Borrowed');
    expect(state.loans.filter((l) => l.returnedAt === null)).toHaveLength(1);
  });

  it('serializes return + allocateNextHold in parallel with a competing checkout for another reader', async () => {
    // Setup: Copy is Borrowed by reader1, while reader2 is Pending #1 in FIFO queue
    state.copy.status = 'Borrowed';
    state.loans.push({
      id: loanId,
      readerId: reader1Id,
      copyId,
      checkedOutAt: new Date(Date.now() - 5 * 86400000),
      dueAt: new Date(Date.now() + 9 * 86400000),
      returnedAt: null,
      renewedAt: null,
    });
    state.reservations.push({
      id: holdId,
      readerId: reader2Id,
      titleId,
      heldCopyId: null,
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000),
    });

    const librarianJwt = tokenFor(librarianId, 'Librarian');
    const [returnRes, competingCheckoutRes] = await Promise.all([
      request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ barcode: 'UNI-008-01' }),
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader3Id, barcode: 'UNI-008-01' }),
    ]);

    expect(returnRes.status).toBe(200);
    expect(returnRes.body.copy.status).toBe('Reserved');
    expect(returnRes.body.hold).toMatchObject({
      id: holdId,
      readerId: reader2Id,
      status: 'Ready',
    });

    // Competing checkout for reader3 must fail whether it ran before (COPY_NOT_AVAILABLE) or after (HOLD_NOT_ELIGIBLE)
    expect(competingCheckoutRes.status).toBe(409);
    expect(['COPY_NOT_AVAILABLE', 'HOLD_NOT_ELIGIBLE']).toContain(
      competingCheckoutRes.body.error.code
    );
    expect(state.copy.status).toBe('Reserved');
    expect(state.loans.filter((l) => l.returnedAt === null)).toHaveLength(0);
  });

  it('serializes parallel return + duplicate return so allocateNextHold runs exactly once', async () => {
    state.copy.status = 'Borrowed';
    state.loans.push({
      id: loanId,
      readerId: reader1Id,
      copyId,
      checkedOutAt: new Date(Date.now() - 5 * 86400000),
      dueAt: new Date(Date.now() + 9 * 86400000),
      returnedAt: null,
      renewedAt: null,
    });
    state.reservations.push({
      id: holdId,
      readerId: reader2Id,
      titleId,
      heldCopyId: null,
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000),
    });

    const librarianJwt = tokenFor(librarianId, 'Librarian');
    const [ret1, ret2] = await Promise.all([
      request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ barcode: 'UNI-008-01' }),
      request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ barcode: 'UNI-008-01' }),
    ]);

    expect([ret1.status, ret2.status].sort((a, b) => a - b)).toEqual([200, 409]);
    expect(state.copy.status).toBe('Reserved');
    expect(state.reservations[0].status).toBe('Ready');
  });
});
