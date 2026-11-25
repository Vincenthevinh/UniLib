import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  loan: {
    findMany: jest.fn(),
  },
};
jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

const adminId = '11111111-1111-4111-8111-111111111111';
const librarianId = '22222222-2222-4222-8222-222222222222';
const adminToken = jwt.sign(
  { sub: adminId, role: 'Administrator' },
  process.env.JWT_SECRET || env.JWT_SECRET,
  { algorithm: 'HS256' }
);
const librarianToken = jwt.sign(
  { sub: librarianId, role: 'Librarian' },
  process.env.JWT_SECRET || env.JWT_SECRET,
  { algorithm: 'HS256' }
);

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.user.findUnique.mockImplementation(async ({ where }) => {
    if (where?.id === librarianId) {
      return {
        id: librarianId,
        username: 'librarian1',
        email: 'librarian1@unilib.edu.vn',
        fullName: 'Demo Librarian One',
        role: 'Librarian',
        isActive: true,
      };
    }
    return {
      id: adminId,
      username: 'admin',
      email: 'admin@unilib.edu.vn',
      fullName: 'Demo Administrator',
      role: 'Administrator',
      isActive: true,
    };
  });
  mockPrisma.user.count.mockResolvedValue(4);
  mockPrisma.user.findMany.mockResolvedValue([
    { id: adminId, username: 'admin', email: 'admin@unilib.edu.vn', fullName: 'Demo Administrator', role: 'Administrator', isActive: true },
    { id: librarianId, username: 'librarian1', email: 'librarian1@unilib.edu.vn', fullName: 'Demo Librarian One', role: 'Librarian', isActive: true },
  ]);
  mockPrisma.loan.findMany.mockResolvedValue([
    {
      id: '33333333-3333-4333-8333-333333333333',
      readerId: '44444444-4444-4444-8444-444444444444',
      copyId: '55555555-5555-4555-8555-555555555555',
      dueAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      returnedAt: null,
      reader: { id: '44444444-4444-4444-8444-444444444444', username: 'reader1', fullName: 'Demo Reader 1', email: 'reader1@unilib.demo.invalid' },
      copy: { id: '55555555-5555-4555-8555-555555555555', barcode: 'UNI-003-01', title: { id: '66666666-6666-4666-8666-666666666666', title: 'Operating Systems', isbn: '9781000000031' } },
    },
  ]);
});

describe('UniLib API Modules Skeletons', () => {
  it('GET /api/v1/auth/me returns current user profile', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('role', 'Administrator');
  });

  it('GET /api/v1/users returns paginated user list', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('GET /api/v1/books returns catalog search list', async () => {
    const res = await request(app).get('/api/v1/books?q=Clean');
    expect(res.status).toBe(200);
    expect(res.body.data.items[0]).toHaveProperty('isbn');
    expect(res.body.data.items[0]).toHaveProperty('totalCopies');
  });

  it('GET /api/v1/copies returns copies inventory', async () => {
    const res = await request(app).get('/api/v1/copies');
    expect(res.status).toBe(200);
    expect(res.body.data.items[0]).toHaveProperty('barcode');
    expect(res.body.data.items[0]).toHaveProperty('shelfLocation');
  });

  it('GET /api/v1/loans/overdue returns overdue loan list', async () => {
    const res = await request(app)
      .get('/api/v1/loans/overdue')
      .set('Authorization', `Bearer ${librarianToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0]).toHaveProperty('daysOverdue');
  });

  it('GET /api/v1/reservations returns hold queue', async () => {
    const res = await request(app).get('/api/v1/reservations');
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0]).toHaveProperty('queuePosition');
  });

  it('GET /api/v1/dashboard/reader returns reader loan and reservation overview', async () => {
    const res = await request(app).get('/api/v1/dashboard/reader');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('activeLoans');
    expect(res.body.data).toHaveProperty('activeReservations');
  });
});
