import net from 'node:net';
import { describe, beforeAll, beforeEach, afterAll, it, expect } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEFAULT_TEST_DB_URL =
  'postgresql://unilib:unilib_dev_only@localhost:55432/unilib_test?schema=public';
const testDbUrl = process.env.TEST_DATABASE_URL || DEFAULT_TEST_DB_URL;
const requireDb = process.env.REQUIRE_TEST_DB === 'true';

async function canConnectToPostgres(connectionUrl) {
  try {
    const parsed = new URL(connectionUrl);
    const host = parsed.hostname || 'localhost';
    const port = Number(parsed.port || 5432);
    return await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('error', () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(port, host);
    });
  } catch {
    return false;
  }
}

const dbAvailable = await canConnectToPostgres(testDbUrl);
if (requireDb && !dbAvailable) {
  throw new Error(`TEST_DATABASE_URL is required but unreachable: ${testDbUrl}`);
}

let app;
let prisma;
let request;
const testSecret = 'integration-test-secret-at-least-32-chars';

if (dbAvailable) {
  process.env.DATABASE_URL = testDbUrl;
  process.env.JWT_SECRET = testSecret;
  ({ prisma } = await import('../db.js'));
  ({ app } = await import('../app.js'));
  request = (await import('supertest')).default;
}

const describeDb = dbAvailable ? describe : describe.skip;

const DAY_MS = 24 * 60 * 60 * 1000;

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, testSecret, { algorithm: 'HS256' });
}

async function resetTestDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "reservations", "loans", "book_copies", "book_titles", "users" RESTART IDENTITY CASCADE'
  );
}

describeDb('PostgreSQL 16 Dedicated Test DB (unilib_test): F07 & NFR-05 Concurrency', () => {
  let adminUser;
  let librarianUser;
  let reader1;
  let reader2;
  let reader3;
  let title1;
  let title2;
  let copy1;
  let copy2;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    const hash = await bcrypt.hash('UniLibTest!2026', 10);

    [adminUser, librarianUser, reader1, reader2, reader3] = await Promise.all([
      prisma.user.create({
        data: { username: 'test_admin', email: 'admin@test.local', fullName: 'Test Admin', passwordHash: hash, role: 'Administrator', isActive: true },
      }),
      prisma.user.create({
        data: { username: 'test_librarian', email: 'lib@test.local', fullName: 'Test Librarian', passwordHash: hash, role: 'Librarian', isActive: true },
      }),
      prisma.user.create({
        data: { username: 'test_reader1', email: 'r1@test.local', fullName: 'Reader One', passwordHash: hash, role: 'Reader', isActive: true },
      }),
      prisma.user.create({
        data: { username: 'test_reader2', email: 'r2@test.local', fullName: 'Reader Two', passwordHash: hash, role: 'Reader', isActive: true },
      }),
      prisma.user.create({
        data: { username: 'test_reader3', email: 'r3@test.local', fullName: 'Reader Three', passwordHash: hash, role: 'Reader', isActive: true },
      }),
    ]);

    title1 = await prisma.bookTitle.create({
      data: { isbn: '9781000099001', title: 'Concurrency Patterns', author: 'Test Author', category: 'CS', publicationYear: 2024 },
    });
    title2 = await prisma.bookTitle.create({
      data: { isbn: '9781000099002', title: 'Database Internals', author: 'Alex Petrov', category: 'DB', publicationYear: 2019 },
    });
    copy1 = await prisma.bookCopy.create({
      data: { titleId: title1.id, barcode: 'TEST-001-01', shelfLocation: 'T-01', status: 'Available' },
    });
    copy2 = await prisma.bookCopy.create({
      data: { titleId: title2.id, barcode: 'TEST-002-01', shelfLocation: 'T-02', status: 'Available' },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await resetTestDatabase();
      await prisma.$disconnect();
    }
  });

  it('GET /api/me/dashboard & GET /api/librarian/overdue return real PostgreSQL F07 data and enforce RBAC', async () => {
    const now = Date.now();
    await prisma.bookCopy.update({ where: { id: copy1.id }, data: { status: 'Borrowed' } });
    await prisma.bookCopy.update({ where: { id: copy2.id }, data: { status: 'Borrowed' } });

    const overdueLoan = await prisma.loan.create({
      data: {
        readerId: reader1.id,
        copyId: copy1.id,
        checkedOutAt: new Date(now - 20 * DAY_MS),
        dueAt: new Date(now - 5 * DAY_MS),
      },
    });
    const activeLoan = await prisma.loan.create({
      data: {
        readerId: reader1.id,
        copyId: copy2.id,
        checkedOutAt: new Date(now - 2 * DAY_MS),
        dueAt: new Date(now + 12 * DAY_MS),
      },
    });
    await prisma.reservation.create({
      data: { readerId: reader2.id, titleId: title1.id, status: 'Pending', createdAt: new Date(now - 7200000) },
    });
    await prisma.reservation.create({
      data: { readerId: reader1.id, titleId: title1.id, status: 'Pending', createdAt: new Date(now - 3600000) },
    });

    // RBAC checks
    await request(app).get('/api/me/dashboard').expect(401);
    await request(app).get('/api/me/dashboard').set('Authorization', `Bearer ${signToken(librarianUser)}`).expect(403);
    await request(app).get('/api/librarian/overdue').set('Authorization', `Bearer ${signToken(reader1)}`).expect(403);
    await request(app).get('/api/librarian/overdue').set('Authorization', `Bearer ${signToken(adminUser)}`).expect(403);

    // Reader dashboard
    const dashRes = await request(app)
      .get('/api/me/dashboard')
      .set('Authorization', `Bearer ${signToken(reader1)}`)
      .expect(200);

    expect(dashRes.body.loans).toHaveLength(2);
    const l1 = dashRes.body.loans.find((l) => l.id === overdueLoan.id);
    const l2 = dashRes.body.loans.find((l) => l.id === activeLoan.id);
    expect(l1).toMatchObject({ isOverdue: true, canRenew: false });
    expect(l1.lateDays).toBeGreaterThanOrEqual(5);
    expect(l2).toMatchObject({ isOverdue: false, canRenew: true });
    expect(dashRes.body.reservations).toHaveLength(1);
    expect(dashRes.body.reservations[0].queuePosition).toBe(2);
    expect(dashRes.body.overdueFlags).toMatchObject({ hasOverdue: true, overdueCount: 1 });
    expect(dashRes.body.restrictions).toMatchObject({ borrowingBlocked: true, reservingBlocked: true });

    // Librarian overdue desk
    const overdueRes = await request(app)
      .get('/api/librarian/overdue')
      .set('Authorization', `Bearer ${signToken(librarianUser)}`)
      .expect(200);

    expect(overdueRes.body.total).toBe(1);
    expect(overdueRes.body.items[0]).toMatchObject({
      loanId: overdueLoan.id,
      reader: { id: reader1.id, email: 'r1@test.local', fullName: 'Reader One' },
      copy: { id: copy1.id, barcode: 'TEST-001-01' },
      title: { id: title1.id, title: 'Concurrency Patterns' },
    });
    expect(overdueRes.body.items[0].lateDays).toBeGreaterThanOrEqual(5);
  });

  it('PostgreSQL row locks serialize 2 concurrent checkouts on the same copy -> [201, 409]', async () => {
    const librarianJwt = signToken(librarianUser);
    const [r1, r2] = await Promise.all([
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader1.id, barcode: 'TEST-001-01' }),
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader2.id, barcode: 'TEST-001-01' }),
    ]);

    expect([r1.status, r2.status].sort((a, b) => a - b)).toEqual([201, 409]);
    const activeLoans = await prisma.loan.count({ where: { copyId: copy1.id, returnedAt: null } });
    expect(activeLoans).toBe(1);
  });

  it('PostgreSQL transaction serializes return + allocateNextHold in parallel with competing checkout', async () => {
    await prisma.bookCopy.update({ where: { id: copy1.id }, data: { status: 'Borrowed' } });
    await prisma.loan.create({
      data: {
        readerId: reader1.id,
        copyId: copy1.id,
        checkedOutAt: new Date(Date.now() - 4 * DAY_MS),
        dueAt: new Date(Date.now() + 10 * DAY_MS),
      },
    });
    const hold = await prisma.reservation.create({
      data: {
        readerId: reader2.id,
        titleId: title1.id,
        status: 'Pending',
        createdAt: new Date(Date.now() - 3600000),
      },
    });

    const librarianJwt = signToken(librarianUser);
    const [returnRes, checkoutRes] = await Promise.all([
      request(app)
        .post('/api/loans/return')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ barcode: 'TEST-001-01' }),
      request(app)
        .post('/api/loans/checkout')
        .set('Authorization', `Bearer ${librarianJwt}`)
        .send({ readerId: reader3.id, barcode: 'TEST-001-01' }),
    ]);

    expect(returnRes.status).toBe(200);
    expect(returnRes.body.copy.status).toBe('Reserved');
    expect(returnRes.body.hold).toMatchObject({ id: hold.id, status: 'Ready', readerId: reader2.id });
    expect(checkoutRes.status).toBe(409);

    const refreshedCopy = await prisma.bookCopy.findUnique({ where: { id: copy1.id } });
    const refreshedHold = await prisma.reservation.findUnique({ where: { id: hold.id } });
    expect(refreshedCopy.status).toBe('Reserved');
    expect(refreshedHold.status).toBe('Ready');
    expect(refreshedHold.heldCopyId).toBe(copy1.id);
  });
});
