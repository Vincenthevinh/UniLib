import bcrypt from 'bcryptjs';
import { prisma } from '../../../db.js';
import { AppError } from '../../middlewares/errorHandler.js';

const ALLOWED_ROLES = ['Reader', 'Librarian', 'Administrator'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeRole(role) {
  if (!role || typeof role !== 'string') return null;
  const match = ALLOWED_ROLES.find((r) => r.toLowerCase() === role.trim().toLowerCase());
  return match || null;
}

export const usersService = {
  /**
   * List users with pagination and search filtering.
   * Access restricted to Administrator role.
   */
  async listUsers(query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || query.pageSize, 10) || 10));
    const skip = (page - 1) * limit;

    const where = {};

    if (query.role) {
      const normalized = normalizeRole(query.role);
      if (normalized) {
        where.role = normalized;
      }
    }

    if (query.isActive !== undefined && query.isActive !== '') {
      where.isActive = String(query.isActive) === 'true';
    }

    if (query.q && typeof query.q === 'string' && query.q.trim()) {
      const search = query.q.trim();
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: users,
      pagination: {
        page,
        limit,
        pageSize: limit,
        total,
        totalPages,
      },
    };
  },

  /**
   * Create a new user account.
   * Hashes password using bcrypt with salt >= 10.
   * Access restricted to Administrator role.
   */
  async createUser(data) {
    const { username, email, fullName, password, role, isActive } = data;

    if (!username || typeof username !== 'string' || !username.trim()) {
      throw new AppError('Username is required', 400, 'VALIDATION_ERROR');
    }
    if (username.trim().length < 3 || username.trim().length > 80) {
      throw new AppError('Username must be between 3 and 80 characters', 400, 'VALIDATION_ERROR');
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.trim().length > 255) {
      throw new AppError('A valid email address is required', 400, 'VALIDATION_ERROR');
    }

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      throw new AppError('Full name is required', 400, 'VALIDATION_ERROR');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400, 'VALIDATION_ERROR');
    }

    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      throw new AppError(
        `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`,
        400,
        'VALIDATION_ERROR'
      );
    }

    // Check unique constraints (username and email)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: email.trim().toLowerCase() },
        ],
      },
    });

    if (existing) {
      throw new AppError(
        'A user with this username or email already exists',
        409,
        'DUPLICATE_RESOURCE'
      );
    }

    // NFR-03: bcrypt hashing with salt rounds >= 10
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        passwordHash,
        role: normalizedRole,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
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

    return newUser;
  },

  /**
   * Retrieve a user by UUID.
   * Access restricted to Administrator role.
   */
  async getUserById(id) {
    if (!id || !UUID_REGEX.test(id)) {
      throw new AppError('Valid UUID is required', 400, 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
      throw new AppError(`User with id '${id}' not found`, 404, 'NOT_FOUND');
    }

    return user;
  },

  /**
   * Update user details (specifically role and isActive as required by F01-04).
   * Access restricted to Administrator role.
   */
  async updateUser(id, data) {
    if (!id || !UUID_REGEX.test(id)) {
      throw new AppError('Valid UUID is required', 400, 'VALIDATION_ERROR');
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(`User with id '${id}' not found`, 404, 'NOT_FOUND');
    }

    const updateData = {};

    if (data.role !== undefined) {
      const normalizedRole = normalizeRole(data.role);
      if (!normalizedRole) {
        throw new AppError(
          `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`,
          400,
          'VALIDATION_ERROR'
        );
      }
      updateData.role = normalizedRole;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = Boolean(data.isActive);
    } else if (data.status !== undefined) {
      if (!['ACTIVE', 'INACTIVE'].includes(String(data.status).toUpperCase())) {
        throw new AppError("Status must be either 'ACTIVE' or 'INACTIVE'", 400, 'VALIDATION_ERROR');
      }
      updateData.isActive = String(data.status).toUpperCase() === 'ACTIVE';
    }

    if (data.fullName && typeof data.fullName === 'string' && data.fullName.trim()) {
      updateData.fullName = data.fullName.trim();
    }

    if (data.password && typeof data.password === 'string') {
      if (data.password.length < 6) {
        throw new AppError('Password must be at least 6 characters long', 400, 'VALIDATION_ERROR');
      }
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('At least one valid field to update is required', 400, 'VALIDATION_ERROR');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return updatedUser;
  },

  /**
   * Update active status endpoint helper
   */
  async updateStatus(id, { status, isActive }) {
    return this.updateUser(id, { status, isActive });
  },
};

export default usersService;
