import { Router } from "express";
import { asyncHandler } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as books from "../services/books.js";

export const booksRouter = Router();
const staff = [requireAuth, requireRole("Librarian")];

booksRouter.get("/", asyncHandler(async (req, res) => res.json(await books.listBooks(req.query))));
booksRouter.get("/:id", asyncHandler(async (req, res) => res.json(await books.getBook(req.params.id))));
booksRouter.get("/:id/copies", asyncHandler(async (req, res) => res.json({ items: await books.listCopies(req.params.id) })));
booksRouter.post("/", ...staff, asyncHandler(async (req, res) => res.status(201).json(await books.createBook(req.body ?? {}))));
booksRouter.patch("/:id", ...staff, asyncHandler(async (req, res) => res.json(await books.updateBook(req.params.id, req.body ?? {}))));
booksRouter.delete("/:id", ...staff, asyncHandler(async (req, res) => res.json(await books.deactivateBook(req.params.id))));
booksRouter.post("/:id/copies", ...staff, asyncHandler(async (req, res) => res.status(201).json(await books.createCopy(req.params.id, req.body ?? {}))));