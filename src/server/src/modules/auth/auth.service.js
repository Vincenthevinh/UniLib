import { AppError } from '../../middlewares/errorHandler.js';

export const authService = {
  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Email/username and password are required', 400, 'VALIDATION_ERROR');
    }
    // Skeleton implementation matching PA2 FR-F01-01 / AC-F01-01
    return {
      token: 'skeleton-mock-jwt-token-for-dev',
      user: {
        id: 'usr_001',
        email,
        name: 'Demo User',
        role: email.includes('admin') ? 'ADMINISTRATOR' : (email.includes('lib') ? 'LIBRARIAN' : 'READER'),
      },
    };
  },

  async logout(userId) { // eslint-disable-line no-unused-vars
    return { success: true, message: 'Logged out successfully' };
  },

  async getMe(userId) {
    return {
      id: userId || 'usr_001',
      name: 'Nguyen Phan The Vinh',
      role: 'ADMINISTRATOR',
      email: 'pm.vinh@unilib.edu.vn',
    };
  },
};

export default authService;
