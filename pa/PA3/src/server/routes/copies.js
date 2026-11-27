import { Router } from "express";
import { asyncHandler } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as books from "../services/books.js";

export const copiesRouter = Router();
const staff = [requireAuth, requireRole("Librarian")];

copiesRouter.patch("/:id", ...staff, asyncHandler(async (req, res) => res.json(await books.updateCopy(req.params.id, req.body ?? {}))));
copiesRouter.delete("/:id", ...staff, asyncHandler(async (req, res) => {
  await books.deleteCopy(req.params.id);
  res.status(204).end();
}));