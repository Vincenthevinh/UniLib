import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  async getReader(req, res, next) {
    try {
      const readerId = req.query.readerId || req.user?.id;
      const result = await dashboardService.getReaderDashboard(readerId);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async getLibrarian(req, res, next) {
    try {
      const result = await dashboardService.getLibrarianDashboard();
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default dashboardController;
