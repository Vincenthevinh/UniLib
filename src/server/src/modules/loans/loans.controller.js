import { loansService } from './loans.service.js';

export const loansController = {
  async checkout(req, res, next) {
    try {
      const result = await loansService.checkout(req.body);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async returnBook(req, res, next) {
    try {
      const result = await loansService.returnBook(req.body);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async renew(req, res, next) {
    try {
      const result = await loansService.renewLoan(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async listOverdue(req, res, next) {
    try {
      const result = await loansService.listOverdue();
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default loansController;
