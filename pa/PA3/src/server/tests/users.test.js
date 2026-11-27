import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};
jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

const testSecret = 'unit-test-secret-at-least-32-characters';
const adminId = '11111111-1111-4111-8111-111111111111';
const librarianId = '22222222-2222-4222-8222-222222222222';
const readerId = '33333333-3333-4333-8333-333333333333';

function createToken(sub, role) {
  return jwt.sign({ sub, role }, testSecret, { algorithm: 'HS256' });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;
});

describe('Feature F01: User Management & RBAC Protection (/api/users)', () => {
  /**
   * AC-F01-03: Role-Based Access Control Denial on Protected Staff / Admin Endpoints
   */
  describe('AC-F01-03: RBAC Endpoint Protection', () => {
    it('denies unauthenticated request with HTTP 401', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('denies Reader with HTTP 403 Forbidden', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: readerId,
        username: 'reader1',
        email: 'reader1@unilib.edu.vn',
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${createToken(readerId, 'Reader')}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('denies Librarian with HTTP 403 Forbidden', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: librarianId,
        username: 'librarian1',
        email: 'librarian1@unilib.edu.vn',
        role: 'Librarian',
        isActive: true,
      });

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${createToken(librarianId, 'Librarian')}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  /**
   * Administrator Operations: List Users (GET /api/users)
   */
  describe('GET /api/users (Administrator Only)', () => {
    it('returns paginated list of users without passwordHash', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: adminId,
        username: 'admin',
        email: 'admin@unilib.edu.vn',
        role: 'Administrator',
        isActive: true,
      });

      const mockUsers = [
        {
          id: adminId,
          username: 'admin',
          email: 'admin@unilib.edu.vn',
          fullName: 'Demo Administrator',
          role: 'Administrator',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: librarianId,
          username: 'librarian1',
          email: 'librarian1@unilib.edu.vn',
          fullName: 'Demo Librarian One',
          role: 'Librarian',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockPrisma.user.count.mockResolvedValue(2);
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const res = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${createToken(adminId, 'Administrator')}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      });

      // Crucial Security Criterion: No password hashes in response
      for (const user of res.body.items) {
        expect(user.passwordHash).toBeUndefined();
        expect(user.password).toBeUndefined();
      }
    });
  });

  /**
   * Administrator Operations: Create User (POST /api/users)
   */
  describe('POST /api/users (Administrator Only)', () => {
    it('creates a new user with bcrypt-hashed password (salt >= 10) and returns 201 without hash', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: adminId,
        username: 'admin',
        role: 'Administrator',
        isActive: true,
      });

      mockPrisma.user.findFirst.mockResolvedValue(null); // No duplicate user

      const newUserId = '44444444-4444-4444-8444-444444444444';
      mockPrisma.user.create.mockResolvedValue({
        id: newUserId,
        username: 'new_reader',
        email: 'new_reader@university.edu',
        fullName: 'New Reader Student',
        role: 'Reader',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createToken(adminId, 'Administrator')}`)
        .send({
          username: 'new_reader',
          email: 'new_reader@university.edu',
          fullName: 'New Reader Student',
          password: 'SecurePassword123!',
          role: 'Reader',
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({
        id: newUserId,
        username: 'new_reader',
        email: 'new_reader@university.edu',
        role: 'Reader',
        isActive: true,
      });
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.user.password).toBeUndefined();

      // Check that prisma.user.create received a bcrypt hash
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'new_reader',
            role: 'Reader',
            passwordHash: expect.stringMatching(/^\$2[aby]\$\d{2}\$/), // Valid bcrypt hash
          }),
        })
      );
    });

    it('rejects duplicate username or email with HTTP 409 Conflict', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: adminId,
        username: 'admin',
        role: 'Administrator',
        isActive: true,
      });

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'existing-id',
        username: 'existing_user',
      });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createToken(adminId, 'Administrator')}`)
        .send({
          username: 'existing_user',
          email: 'existing@university.edu',
          fullName: 'Existing User',
          password: 'Password123!',
          role: 'Reader',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('DUPLICATE_RESOURCE');
    });

    it('denies Reader from creating a user with HTTP 403', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: readerId,
        username: 'reader1',
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createToken(readerId, 'Reader')}`)
        .send({
          username: 'hacked_admin',
          email: 'hacked@university.edu',
          fullName: 'Hacked Account',
          password: 'Password123!',
          role: 'Administrator',
        });

      expect(res.status).toBe(403);
    });
  });

  /**
   * Administrator Operations: Update User (PATCH /api/users/:id)
   */
  describe('PATCH /api/users/:id (Administrator Only)', () => {
    const targetUserId = '55555555-5555-4555-8555-555555555555';

    it('updates role and isActive status, returning HTTP 200 without passwordHash', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: adminId, role: 'Administrator', isActive: true }) // for auth
        .mockResolvedValueOnce({ id: targetUserId, username: 'target_user' }); // for target lookup

      mockPrisma.user.update.mockResolvedValue({
        id: targetUserId,
        username: 'target_user',
        email: 'target@university.edu',
        fullName: 'Target User',
        role: 'Librarian',
        isActive: false, // Deactivated
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .patch(`/api/users/${targetUserId}`)
        .set('Authorization', `Bearer ${createToken(adminId, 'Administrator')}`)
        .send({
          role: 'Librarian',
          isActive: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({
        id: targetUserId,
        role: 'Librarian',
        isActive: false,
      });
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('returns HTTP 404 when target user does not exist', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: adminId, role: 'Administrator', isActive: true })
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .patch(`/api/users/${targetUserId}`)
        .set('Authorization', `Bearer ${createToken(adminId, 'Administrator')}`)
        .send({ role: 'Librarian' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('denies Reader from updating another user with HTTP 403', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: readerId,
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .patch(`/api/users/${targetUserId}`)
        .set('Authorization', `Bearer ${createToken(readerId, 'Reader')}`)
        .send({ role: 'Administrator' });

      expect(res.status).toBe(403);
    });
  });
});
