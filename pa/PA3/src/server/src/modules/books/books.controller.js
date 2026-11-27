import { booksService } from './books.service.js';

export const booksController = {
  async list(req, res, next) {
    try {
      const result = await booksService.searchAndBrowse(req.query);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const result = await booksService.createBook(req.body);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await booksService.getBookById(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await booksService.updateBook(req.params.id, req.body);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await booksService.deleteBook(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default booksController;
