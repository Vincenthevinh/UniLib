import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const testSecret = 'unit-test-secret-at-least-32-characters';
const readerId = '11111111-1111-4111-8111-111111111111';
const librarianId = '22222222-2222-4222-8222-222222222222';
const adminId = '33333333-3333-4333-8333-333333333333';
const titleId = '44444444-4444-4444-8444-444444444444';
const copyId = '55555555-5555-4555-8555-555555555555';
const loanId = '66666666-6666-4666-8666-666666666666';
const holdId = '77777777-7777-4777-8777-777777777777';

const tx = {
  $queryRawUnsafe: jest.fn().mockResolvedValue([]),
  user: { findUnique: jest.fn() },
  bookTitle: { findUnique: jest.fn() },
  bookCopy: {
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
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
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockPrisma = {
  $transaction: jest.fn(async (fn) => fn(tx)),
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  bookTitle: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  bookCopy: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  loan: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  reservation: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

function tokenFor(sub, role) {
  return jwt.sign({ sub, role }, testSecret, { algorithm: 'HS256' });
}

function normalizeExpressPath(raw) {
  return raw.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function extractAppRoutes(expressApp) {
  const routes = [];
  function walk(stack, prefix = '') {
    for (const layer of stack || []) {
      if (layer.route) {
        const path = normalizeExpressPath(prefix + layer.route.path);
        for (const method of Object.keys(layer.route.methods)) {
          if (layer.route.methods[method]) {
            routes.push({ method: method.toUpperCase(), path });
          }
        }
      } else if (layer.name === 'router' && layer.handle?.stack) {
        const match = layer.regexp
          .toString()
          .replace('/^', '')
          .replace('\\/?(?=\\/|$)/i', '')
          .replace(/\\\//g, '/');
        walk(layer.handle.stack, prefix + match);
      }
    }
  }
  walk(expressApp._router?.stack || []);
  return routes;
}

const PUBLIC_WRITE_ROUTES = new Set([
  'POST /api/auth/login',
  'POST /api/auth/logout',
  'POST /api/v1/auth/login',
  'POST /api/v1/auth/logout',
]);

// Complete RBAC Matrix across Reader, Librarian, Administrator, and Unauthenticated
const RBAC_MATRIX = [
  // Auth
  { method: 'GET', path: '/api/auth/me', unauth: 401, Reader: 200, Librarian: 200, Administrator: 200 },
  // F01 Users (Administrator only)
  { method: 'GET', path: '/api/users', unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  {
    method: 'POST',
    path: '/api/users',
    body: { username: 'newuser1', email: 'newuser1@unilib.edu.vn', fullName: 'New User', password: 'Password123!', role: 'Reader' },
    unauth: 401,
    Reader: 403,
    Librarian: 403,
    Administrator: 201,
  },
  { method: 'GET', path: `/api/users/${readerId}`, unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  { method: 'PATCH', path: `/api/users/${readerId}`, body: { isActive: true }, unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  { method: 'PATCH', path: `/api/users/${readerId}/status`, body: { isActive: true }, unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  // F02/F03 Books & Copies (Librarian only for writes)
  {
    method: 'POST',
    path: '/api/books',
    body: { isbn: '9781000009991', title: 'Design Patterns', author: 'GoF', category: 'Software', publicationYear: 1994 },
    unauth: 401,
    Reader: 403,
    Librarian: 201,
    Administrator: 403,
  },
  { method: 'PATCH', path: `/api/books/${titleId}`, body: { title: 'Updated Title' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'DELETE', path: `/api/books/${titleId}`, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: `/api/books/${titleId}/copies`, body: { barcode: 'UNI-999-01', shelfLocation: 'S-99' }, unauth: 401, Reader: 403, Librarian: 201, Administrator: 403 },
  { method: 'PATCH', path: `/api/copies/${copyId}`, body: { shelfLocation: 'S-12' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'DELETE', path: `/api/copies/${copyId}`, unauth: 401, Reader: 403, Librarian: 204, Administrator: 403 },
  // F05 Circulation Loans
  { method: 'POST', path: '/api/loans/checkout', body: { readerId, barcode: 'UNI-001-01' }, unauth: 401, Reader: 403, Librarian: 201, Administrator: 403 },
  { method: 'POST', path: '/api/loans/return', body: { barcode: 'UNI-001-01' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: `/api/loans/${loanId}/renew`, unauth: 401, Reader: 200, Librarian: 200, Administrator: 403 },
  { method: 'GET', path: '/api/loans/overdue', unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  // F06 Reservations
  { method: 'GET', path: '/api/reservations/me', unauth: 401, Reader: 200, Librarian: 403, Administrator: 403 },
  { method: 'GET', path: '/api/reservations/queue', unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: '/api/reservations', body: { titleId }, unauth: 401, Reader: 201, Librarian: 403, Administrator: 403 },
  { method: 'DELETE', path: `/api/reservations/${holdId}`, unauth: 401, Reader: 200, Librarian: 403, Administrator: 403 },
  // F07 Dashboard & Overdue
  { method: 'GET', path: '/api/me/dashboard', unauth: 401, Reader: 200, Librarian: 403, Administrator: 403 },
  { method: 'GET', path: '/api/librarian/overdue', unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'GET', path: '/api/dashboard/reader', unauth: 401, Reader: 200, Librarian: 403, Administrator: 403 },
  { method: 'GET', path: '/api/dashboard/librarian', unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'GET', path: '/api/dashboard/overdue', unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  // Versioned /api/v1/* routes (ensure every v1 write route is also protected)
  { method: 'POST', path: '/api/v1/users', body: { username: 'newuser2', email: 'newuser2@unilib.edu.vn', fullName: 'New User 2', password: 'Password123!', role: 'Reader' }, unauth: 401, Reader: 403, Librarian: 403, Administrator: 201 },
  { method: 'PATCH', path: `/api/v1/users/${readerId}`, body: { isActive: true }, unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  { method: 'PATCH', path: `/api/v1/users/${readerId}/status`, body: { isActive: true }, unauth: 401, Reader: 403, Librarian: 403, Administrator: 200 },
  { method: 'POST', path: '/api/v1/books', body: { isbn: '9781000009991', title: 'Design Patterns', author: 'GoF' }, unauth: 401, Reader: 403, Librarian: 201, Administrator: 403 },
  { method: 'PUT', path: `/api/v1/books/${titleId}`, body: { title: 'Updated' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'DELETE', path: `/api/v1/books/${titleId}`, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: '/api/v1/copies', body: { bookId: titleId, barcode: 'BC-101', shelfLocation: 'S-01' }, unauth: 401, Reader: 403, Librarian: 201, Administrator: 403 },
  { method: 'PATCH', path: `/api/v1/copies/${copyId}`, body: { shelfLocation: 'S-02' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'DELETE', path: `/api/v1/copies/${copyId}`, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: '/api/v1/loans/checkout', body: { readerId, barcode: 'UNI-001-01' }, unauth: 401, Reader: 403, Librarian: 201, Administrator: 403 },
  { method: 'POST', path: '/api/v1/loans/return', body: { barcode: 'UNI-001-01' }, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: `/api/v1/loans/${loanId}/renew`, unauth: 401, Reader: 200, Librarian: 200, Administrator: 403 },
  { method: 'POST', path: '/api/v1/reservations', body: { readerId, bookId: titleId }, unauth: 401, Reader: 201, Librarian: 403, Administrator: 403 },
  { method: 'DELETE', path: `/api/v1/reservations/${holdId}`, unauth: 401, Reader: 200, Librarian: 403, Administrator: 403 },
  { method: 'POST', path: `/api/v1/reservations/${holdId}/pickup`, unauth: 401, Reader: 403, Librarian: 200, Administrator: 403 },
];

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;

  const usersById = {
    [readerId]: { id: readerId, username: 'reader1', email: 'reader1@unilib.edu.vn', fullName: 'Reader One', role: 'Reader', isActive: true },
    [librarianId]: { id: librarianId, username: 'librarian1', email: 'librarian1@unilib.edu.vn', fullName: 'Librarian One', role: 'Librarian', isActive: true },
    [adminId]: { id: adminId, username: 'admin', email: 'admin@unilib.edu.vn', fullName: 'Admin One', role: 'Administrator', isActive: true },
  };

  mockPrisma.user.findUnique.mockImplementation(async ({ where }) => usersById[where?.id] || null);
  mockPrisma.user.findFirst.mockResolvedValue(null);
  mockPrisma.user.count.mockResolvedValue(3);
  mockPrisma.user.findMany.mockResolvedValue(Object.values(usersById));
  mockPrisma.user.create.mockImplementation(async ({ data }) => ({ id: '88888888-8888-4888-8888-888888888888', ...data }));
  mockPrisma.user.update.mockImplementation(async ({ where, data }) => ({ ...usersById[where.id], ...data }));

  const bookObj = {
    id: titleId,
    isbn: '9781000009991',
    title: 'Design Patterns',
    author: 'GoF',
    category: 'Software',
    publisher: null,
    publicationYear: 1994,
    isActive: true,
    copies: [],
  };
  mockPrisma.bookTitle.count.mockResolvedValue(1);
  mockPrisma.bookTitle.findMany.mockResolvedValue([bookObj]);
  mockPrisma.bookTitle.findFirst.mockResolvedValue(bookObj);
  mockPrisma.bookTitle.findUnique.mockResolvedValue(bookObj);
  mockPrisma.bookTitle.create.mockResolvedValue({ ...bookObj, copies: [] });
  mockPrisma.bookTitle.update.mockResolvedValue({ ...bookObj, title: 'Updated Title', copies: [] });

  mockPrisma.bookCopy.count.mockResolvedValue(0);
  mockPrisma.bookCopy.findUnique.mockImplementation(async ({ where }) => {
    if (where?.id === copyId || where?.barcode === 'UNI-001-01') {
      return { id: copyId, titleId, barcode: 'UNI-001-01', shelfLocation: 'S-01', status: 'Available', conditionNotes: null };
    }
    return null;
  });
  mockPrisma.bookCopy.create.mockResolvedValue({ id: copyId, titleId, barcode: 'UNI-999-01', shelfLocation: 'S-99', status: 'Available' });
  mockPrisma.bookCopy.update.mockResolvedValue({ id: copyId, titleId, barcode: 'UNI-001-01', shelfLocation: 'S-12', status: 'Available' });
  mockPrisma.bookCopy.delete.mockResolvedValue({ id: copyId });

  mockPrisma.loan.count.mockResolvedValue(0);
  mockPrisma.loan.findMany.mockResolvedValue([]);
  mockPrisma.loan.findUnique.mockResolvedValue({
    id: loanId,
    readerId,
    copyId,
    checkedOutAt: new Date(),
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    returnedAt: null,
    renewedAt: null,
    copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
  });

  mockPrisma.reservation.count.mockResolvedValue(0);
  mockPrisma.reservation.findMany.mockResolvedValue([]);
  mockPrisma.reservation.findUnique.mockResolvedValue({
    id: holdId,
    readerId,
    titleId,
    heldCopyId: null,
    status: 'Pending',
  });

  tx.user.findUnique.mockResolvedValue(usersById[readerId]);
  tx.bookTitle.findUnique.mockResolvedValue(bookObj);
  tx.bookCopy.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0).mockResolvedValueOnce(1);
  tx.bookCopy.update.mockImplementation(async ({ where, data }) => ({ id: where.id, titleId, barcode: 'UNI-001-01', ...data }));
  tx.loan.count.mockResolvedValue(0);
  tx.loan.create.mockImplementation(async ({ data }) => ({ id: loanId, ...data }));
  tx.loan.update.mockImplementation(async ({ where, data }) => ({ id: where.id, readerId, copyId, dueAt: new Date(Date.now() + 14 * 86400000), ...data }));
  tx.loan.findUnique.mockResolvedValue({
    id: loanId,
    readerId,
    copyId,
    dueAt: new Date(Date.now() + 14 * 86400000),
    returnedAt: null,
    renewedAt: null,
    copy: { id: copyId, titleId, barcode: 'UNI-001-01' },
  });
  tx.reservation.count.mockResolvedValue(0);
  tx.reservation.findFirst.mockResolvedValue(null);
  tx.reservation.findUnique.mockResolvedValue({ id: holdId, readerId, titleId, heldCopyId: null, status: 'Pending' });
  tx.reservation.findMany.mockResolvedValue([{ id: holdId }]);
  tx.reservation.create.mockResolvedValue({ id: holdId, readerId, titleId, status: 'Pending', createdAt: new Date() });
  tx.reservation.update.mockImplementation(async ({ where, data }) => ({ id: where.id, readerId, titleId, ...data }));
});

describe('NFR-04 / BR-10: Exhaustive RBAC Matrix & Write Route Coverage', () => {
  it('verifies every non-auth write route in Express is covered by the RBAC matrix', () => {
    const discoveredRoutes = extractAppRoutes(app);
    const writeRoutes = discoveredRoutes.filter(
      (r) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method) && !PUBLIC_WRITE_ROUTES.has(`${r.method} ${r.path}`)
    );

    const matrixTemplates = new Set(
      RBAC_MATRIX.map((entry) => `${entry.method} ${entry.path.replace(readerId, ':id').replace(titleId, ':id').replace(copyId, ':id').replace(loanId, ':id').replace(holdId, ':id')}`)
    );

    const uncovered = writeRoutes.filter((r) => {
      const normalized = `${r.method} ${r.path.replace(/:[^/]+/g, ':id')}`;
      return !matrixTemplates.has(normalized);
    });

    expect(uncovered).toEqual([]);
    expect(writeRoutes.length).toBeGreaterThanOrEqual(24);
  });

  describe.each(RBAC_MATRIX)('$method $path', (entry) => {
    const actors = [
      ['unauthenticated', null, entry.unauth],
      ['Reader', tokenFor(readerId, 'Reader'), entry.Reader],
      ['Librarian', tokenFor(librarianId, 'Librarian'), entry.Librarian],
      ['Administrator', tokenFor(adminId, 'Administrator'), entry.Administrator],
    ];

    it.each(actors)('%s receives HTTP %i', async (_label, token, expectedStatus) => {
      // Adjust mock state specifically for return vs checkout/reserve where needed
      if (entry.path.endsWith('/loans/return')) {
        tx.bookCopy.findUnique.mockResolvedValue({
          id: copyId,
          titleId,
          barcode: 'UNI-001-01',
          status: 'Borrowed',
          conditionNotes: null,
          title: { id: titleId, title: 'Design Patterns', isbn: '9781000009991' },
        });
        tx.loan.findFirst.mockResolvedValue({ id: loanId, readerId, copyId, returnedAt: null });
      } else {
        tx.bookCopy.findUnique.mockResolvedValue({
          id: copyId,
          titleId,
          barcode: 'UNI-001-01',
          status: 'Available',
          conditionNotes: null,
          title: { id: titleId, title: 'Design Patterns', isbn: '9781000009991', isActive: true },
        });
        tx.loan.findFirst.mockResolvedValue(null);
      }

      const req = request(app)[entry.method.toLowerCase()](entry.path);
      if (token) req.set('Authorization', `Bearer ${token}`);
      if (entry.body) req.send(entry.body);

      const res = await req;
      expect(res.status).toBe(expectedStatus);
      if (expectedStatus === 401) {
        expect(res.body.error.code).toBe('UNAUTHENTICATED');
      } else if (expectedStatus === 403) {
        expect(res.body.error.code).toBe('FORBIDDEN');
      }
    });
  });
});
