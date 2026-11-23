import crypto from 'node:crypto';

/**
 * Middleware assigning a unique Request ID to each incoming HTTP request.
 * Reads existing 'x-request-id' header or generates a fresh UUIDv4.
 */
export function requestId(req, res, next) {
  const id = req.header('x-request-id') || crypto.randomUUID();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}

export default requestId;
