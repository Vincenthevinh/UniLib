// Integration seam: Vinh may replace this with the authoritative F01 JWT/RBAC module.
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { HttpError } from "../lib/errors.js";

export async function requireAuth(req, _res, next) {
  try {
    const raw = req.headers.authorization || "";
    if (!raw.startsWith("Bearer ")) throw new HttpError(401, "UNAUTHENTICATED", "Bearer token required");
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be configured with 32+ characters");
    }
    const payload = jwt.verify(raw.slice(7), process.env.JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") {
      throw new HttpError(401, "UNAUTHENTICATED", "Invalid token claims");
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive || user.role !== payload.role) {
      throw new HttpError(401, "UNAUTHENTICATED", "Account inactive or token outdated");
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new HttpError(401, "UNAUTHENTICATED", "Invalid or expired token"));
    }
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, "UNAUTHENTICATED", "Authentication required"));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, "FORBIDDEN", "Insufficient role"));
    next();
  };
}