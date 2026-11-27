import { copiesService } from './copies.service.js';

export const copiesController = {
  async list(req, res, next) {
    try {
      const result = await copiesService.listCopies(req.query);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const result = await copiesService.createCopy(req.body);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await copiesService.getCopyById(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await copiesService.updateCopy(req.params.id, req.body);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await copiesService.deleteCopy(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default copiesController;
