import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  async getReader(req, res, next) {
    try {
      const result = await dashboardService.getReaderDashboard(req.user?.id);
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getOverdue(req, res, next) {
    try {
      const result = await dashboardService.getLibrarianOverdue();
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getLibrarian(req, res, next) {
    try {
      const result = await dashboardService.getLibrarianDashboard();
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default dashboardController;
