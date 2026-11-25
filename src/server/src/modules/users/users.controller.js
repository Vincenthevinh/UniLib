import { usersService } from './users.service.js';

export const usersController = {
  async list(req, res, next) {
    try {
      const result = await usersService.listUsers(req.query);
      res.status(200).json({
        items: result.items,
        pagination: result.pagination,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const result = await usersService.createUser(req.body);
      res.status(201).json({
        data: result,
        user: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await usersService.getUserById(req.params.id);
      res.status(200).json({
        data: result,
        user: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await usersService.updateUser(req.params.id, req.body);
      res.status(200).json({
        data: result,
        user: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const result = await usersService.updateStatus(req.params.id, req.body);
      res.status(200).json({
        data: result,
        user: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default usersController;
