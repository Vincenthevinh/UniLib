import jwt from 'jsonwebtoken';
import { prisma } from '../../db.js';
import env from '../../config/env.js';
import { AppError } from './errorHandler.js';
import { HttpError } from '../../lib/errors.js';

/**
 * Authentication Middleware:
 * Validates incoming Bearer JWT token, ensures account is active, and populates req.user.
 * Returns HTTP 401 UNAUTHENTICATED on missing/invalid/expired token or inactive account.
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Bearer token required');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Bearer token required');
    }

    const secret = process.env.JWT_SECRET || env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be configured with 32+ characters');
    }

    let payload;
    try {
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpError(401, 'UNAUTHENTICATED', 'Token has expired');
      }
      throw new HttpError(401, 'UNAUTHENTICATED', 'Invalid or expired token');
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Invalid token claims');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Account inactive or token outdated');
    }

    // Role in token must match database role (case-insensitive check)
    if (payload.role && user.role.toLowerCase() !== payload.role.toLowerCase()) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Account inactive or token outdated');
    }

    req.user = {
      id: user.id,
      sub: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError || error instanceof AppError) {
      return next(error);
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'UNAUTHENTICATED', 'Invalid or expired token'));
    }
    next(error);
  }
}

/**
 * Role-Based Access Control (RBAC) Authorization Middleware Factory:
 * Restricts access to one or more allowed roles.
 * Returns HTTP 403 FORBIDDEN if the user role is not authorized.
 *
 * @param  {...string} roles Allowed roles (e.g. 'Administrator', 'Librarian', 'Reader')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'UNAUTHENTICATED', 'Authentication required'));
    }

    if (roles.length === 0) {
      return next();
    }

    const normalizedUserRole = req.user.role.toLowerCase();
    const isAllowed = roles.some((r) => r.toLowerCase() === normalizedUserRole);

    if (!isAllowed) {
      return next(new HttpError(403, 'FORBIDDEN', 'Insufficient permissions for this resource'));
    }

    next();
  };
}

// Aliases for compatibility with existing integration seam
export const requireAuth = authenticate;
export const requireRole = authorize;

export default {
  authenticate,
  authorize,
  requireAuth,
  requireRole,
};
