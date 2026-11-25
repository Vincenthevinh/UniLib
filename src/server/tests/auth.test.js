import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
};
jest.unstable_mockModule('../db.js', () => ({ prisma: mockPrisma }));

const { app } = await import('../app.js');
const request = (await import('supertest')).default;

const testSecret = 'unit-test-secret-at-least-32-characters';
const readerId = '11111111-1111-4111-8111-111111111111';
const validPassword = 'Secret@Password123';
let validHash;

beforeEach(async () => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = testSecret;
  if (!validHash) {
    validHash = await bcrypt.hash(validPassword, 10);
  }
});

describe('Feature F01: Authentication & Session Verification', () => {
  /**
   * AC-F01-01: Valid Credential Authentication & Role-Based Session Redirection
   */
  describe('AC-F01-01: Valid Credential Login', () => {
    it('authenticates active user by username, returns JWT with { sub, role } and user info without password', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: readerId,
        username: 'reader_john',
        email: 'reader_john@university.edu',
        fullName: 'John Reader',
        passwordHash: validHash,
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'reader_john',
          password: validPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');

      // Verify JWT claims { sub, role }
      const decoded = jwt.verify(res.body.token, testSecret);
      expect(decoded.sub).toBe(readerId);
      expect(decoded.role).toBe('Reader');

      // Verify user profile returned
      expect(res.body.user).toMatchObject({
        id: readerId,
        username: 'reader_john',
        email: 'reader_john@university.edu',
        role: 'Reader',
        isActive: true,
      });

      // Crucial Security Criterion: Password hash must NEVER be present
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.user.password).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toContain(validHash);
    });

    it('authenticates active user by email as identifier', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: readerId,
        username: 'reader_john',
        email: 'reader_john@university.edu',
        fullName: 'John Reader',
        passwordHash: validHash,
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'reader_john@university.edu',
          password: validPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  /**
   * AC-F01-02: Rejection of Invalid or Mismatched Credentials
   */
  describe('AC-F01-02: Rejection of Invalid Credentials', () => {
    it('rejects wrong password with HTTP 401, generic error message, and no token', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: readerId,
        username: 'reader_john',
        email: 'reader_john@university.edu',
        fullName: 'John Reader',
        passwordHash: validHash,
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'reader_john',
          password: 'IncorrectPassword999',
        });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'UNAUTHENTICATED',
        message: 'Invalid username or password',
        details: null,
      });
    });

    it('rejects unregistered username/email with identical generic HTTP 401 message (no user enumeration)', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'non_existent_user',
          password: 'AnyPassword123',
        });

      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'UNAUTHENTICATED',
        message: 'Invalid username or password',
        details: null,
      });
    });

    it('returns HTTP 400 for empty or missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  /**
   * AC-F01-04: Authentication Rejection for Deactivated / Inactive Accounts
   */
  describe('AC-F01-04: Deactivated Account Rejection', () => {
    it('rejects login for inactive user with HTTP 403 and suspension message, generating no token', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: readerId,
        username: 'deactivated_user',
        email: 'deactivated@university.edu',
        fullName: 'Deactivated User',
        passwordHash: validHash,
        role: 'Reader',
        isActive: false, // Inactive account
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'deactivated_user',
          password: validPassword,
        });

      expect(res.status).toBe(403);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'FORBIDDEN',
        message: 'Your account has been deactivated. Please contact the library administration.',
        details: null,
      });
    });
  });

  /**
   * Protected Profile Endpoint: GET /api/auth/me
   */
  describe('GET /api/auth/me', () => {
    it('returns 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('returns 401 when token is invalid or tampered', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-garbage-token');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('returns 200 with user profile when valid token is supplied', async () => {
      const token = jwt.sign({ sub: readerId, role: 'Reader' }, testSecret, { algorithm: 'HS256' });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: readerId,
        username: 'reader_john',
        email: 'reader_john@university.edu',
        fullName: 'John Reader',
        role: 'Reader',
        isActive: true,
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: readerId,
        username: 'reader_john',
        role: 'Reader',
        isActive: true,
      });
      expect(res.body.passwordHash).toBeUndefined();
      expect(res.body.password).toBeUndefined();
    });
  });

  /**
   * Logout Endpoint: POST /api/auth/logout
   */
  describe('POST /api/auth/logout', () => {
    it('returns 200 with client instructions to invalidate token', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Logged out successfully');
    });
  });
});
