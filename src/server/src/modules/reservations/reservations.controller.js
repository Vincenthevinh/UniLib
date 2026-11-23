import { reservationsService } from './reservations.service.js';

export const reservationsController = {
  async create(req, res, next) {
    try {
      const result = await reservationsService.placeReservation(req.body);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const result = await reservationsService.listReservations(req.query);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const result = await reservationsService.cancelReservation(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async pickup(req, res, next) {
    try {
      const result = await reservationsService.pickupReservation(req.params.id);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default reservationsController;
