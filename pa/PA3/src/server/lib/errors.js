export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function requireField(value, name, maxLength = 300) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new HttpError(400, "VALIDATION_ERROR", name + " is required (max " + maxLength + " characters)");
  }
  return value.trim();
}

export function requireUuid(value, name = "id") {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new HttpError(400, "VALIDATION_ERROR", name + " must be a UUID");
  }
  return value;
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: { code: error.code, message: error.message } });
  }
  if (error?.code === "P2002") {
    return res.status(409).json({ error: { code: "DUPLICATE_RESOURCE", message: "A unique value already exists" } });
  }
  if (error?.code === "P2003") {
    return res.status(409).json({ error: { code: "REFERENTIAL_CONFLICT", message: "Record is still referenced" } });
  }
  if (error?.code === "P2034") {
    return res.status(409).json({ error: { code: "CONCURRENT_MODIFICATION", message: "Please retry after refreshing current state" } });
  }
  if (error?.code === "P2025") {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Record not found" } });
  }
  console.error("Unhandled API error:", error?.message ?? error);
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } });
}