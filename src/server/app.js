import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { errorHandler, asyncHandler } from "./lib/errors.js";
import { booksRouter } from "./routes/books.js";
import { copiesRouter } from "./routes/copies.js";
import { reservationsRouter } from "./routes/reservations.js";

export const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", asyncHandler(async (_req, res) => {
  await prisma.$queryRawUnsafe("SELECT 1");
  res.json({ status: "ok" });
}));
app.use("/api/books", booksRouter);
app.use("/api/copies", copiesRouter);
app.use("/api/reservations", reservationsRouter);
app.use(errorHandler);