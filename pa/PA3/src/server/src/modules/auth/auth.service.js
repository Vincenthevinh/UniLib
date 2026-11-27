import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../db.js';
import env from '../../../config/env.js';
import { AppError } from '../../middlewares/errorHandler.js';

export const authService = {
  /**
   * Authenticate user credentials and issue signed JWT with { sub, role }.
   * Strictly enforces AC-F01-01, AC-F01-02, and AC-F01-04:
   * - Salt >= 10 for password comparison
   * - Generic error message on invalid credentials (prevent username enumeration)
   * - Inactive accounts rejected with HTTP 403
   * - Password hashes are NEVER returned in response or logged
   */
  async login({ username, email, identifier, password }) {
    const loginIdentifier = (username || email || identifier || '').trim();
    if (!loginIdentifier || !password) {
      throw new AppError('Email/username and password are required', 400, 'VALIDATION_ERROR');
    }

    // Look up user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: loginIdentifier },
          { email: loginIdentifier },
        ],
      },
    });

    if (!user) {
      // AC-F01-02: Generic error message, never disclose whether username or password was wrong
      throw new AppError('Invalid username or password', 401, 'UNAUTHENTICATED');
    }

    // Secure comparison using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // AC-F01-02: Generic error message, no token generated
      throw new AppError('Invalid username or password', 401, 'UNAUTHENTICATED');
    }

    // AC-F01-04: Reject inactive / deactivated user accounts
    if (!user.isActive) {
      throw new AppError(
        'Your account has been deactivated. Please contact the library administration.',
        403,
        'FORBIDDEN'
      );
    }

    // Generate signed JWT token containing { sub, role }
    const secret = process.env.JWT_SECRET || env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be configured with 32+ characters');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      secret,
      {
        algorithm: 'HS256',
        expiresIn: env.JWT_EXPIRES_IN || '7d',
      }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  },

  /**
   * Handle user logout.
   * With stateless JWT, server-side session state is omitted.
   * Client-side must purge the stored token from storage.
   */
  async logout(userId) { // eslint-disable-line no-unused-vars
    return {
      success: true,
      message: 'Logged out successfully. Please clear the client-side session token.',
    };
  },

  /**
   * Retrieve current authenticated user profile by ID.
   * Strips all sensitive credentials.
   */
  async getMe(userId) {
    if (!userId) {
      throw new AppError('Authentication required', 401, 'UNAUTHENTICATED');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    return user;
  },
};

export default authService;
