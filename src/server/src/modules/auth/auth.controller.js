import { authService } from './auth.service.js';

export const authController = {
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user?.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const result = await authService.getMe(req.user?.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
