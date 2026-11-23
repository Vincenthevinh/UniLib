import { Router } from "express";
import { asyncHandler } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as reservations from "../services/reservations.js";

export const reservationsRouter = Router();
reservationsRouter.use(requireAuth);

reservationsRouter.get("/me", requireRole("Reader"), asyncHandler(async (req, res) => {
  res.json({ items: await reservations.listMine(req.user.id) });
}));
reservationsRouter.get("/queue", requireRole("Librarian"), asyncHandler(async (req, res) => {
  res.json({ items: await reservations.listQueue(req.query.titleId) });
}));
reservationsRouter.post("/", requireRole("Reader"), asyncHandler(async (req, res) => {
  res.status(201).json(await reservations.placeReservation(req.user.id, req.body?.titleId));
}));
reservationsRouter.delete("/:id", requireRole("Reader"), asyncHandler(async (req, res) => {
  res.json(await reservations.cancelReservation(req.user.id, req.params.id));
}));