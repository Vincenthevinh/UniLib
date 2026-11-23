import { AppError } from '../../middlewares/errorHandler.js';

export const usersService = {
  async listUsers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    return {
      items: [
        { id: 'usr_001', username: 'vinh.pm', email: 'vinh.pm@unilib.edu.vn', role: 'ADMINISTRATOR', status: 'ACTIVE' },
        { id: 'usr_002', username: 'quan.dev', email: 'quan.dev@unilib.edu.vn', role: 'LIBRARIAN', status: 'ACTIVE' },
        { id: 'usr_003', username: 'anh.ui', email: 'anh.ui@unilib.edu.vn', role: 'READER', status: 'ACTIVE' },
        { id: 'usr_004', username: 'nguyen.ba', email: 'nguyen.ba@unilib.edu.vn', role: 'READER', status: 'ACTIVE' },
      ],
      pagination: { page, limit, total: 4, totalPages: 1 },
    };
  },

  async createUser(data) {
    if (!data.username || !data.email || !data.role) {
      throw new AppError('Username, email, and role are required', 400, 'VALIDATION_ERROR');
    }
    return {
      id: `usr_${Date.now()}`,
      username: data.username,
      email: data.email,
      role: data.role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  },

  async getUserById(id) {
    if (id === 'not_found') {
      throw new AppError(`User with id '${id}' not found`, 404, 'NOT_FOUND');
    }
    return {
      id,
      username: 'sample.user',
      email: 'user@unilib.edu.vn',
      role: 'READER',
      status: 'ACTIVE',
    };
  },

  async updateStatus(id, { status }) {
    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      throw new AppError("Status must be either 'ACTIVE' or 'INACTIVE'", 400, 'VALIDATION_ERROR');
    }
    return {
      id,
      status,
      updatedAt: new Date().toISOString(),
    };
  },
};

export default usersService;
