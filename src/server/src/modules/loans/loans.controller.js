import { loansService } from './loans.service.js';

export const loansController = {
  async checkout(req, res, next) {
    try {
      const result = await loansService.checkout(req.body);
      res.status(201).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async returnBook(req, res, next) {
    try {
      const result = await loansService.returnBook(req.body);
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async renew(req, res, next) {
    try {
      const actor = req.user ? { id: req.user.id, role: req.user.role } : null;
      const result = await loansService.renewLoan(req.params.id, actor);
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async listOverdue(req, res, next) {
    try {
      const result = await loansService.listOverdue();
      res.status(200).json({
        ...result,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default loansController;
