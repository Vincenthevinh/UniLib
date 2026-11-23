/**
 * Custom application error class to carry HTTP status, error codes, and details.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized Express Error Handling Middleware.
 * Enforces UniLib standardized error response format:
 * {
 *   "error": {
 *     "code": "STRING_CODE",
 *     "message": "Human readable error message",
 *     "details": null | object | array
 *   }
 * }
 * Never leaks stack traces to client responses.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = typeof err.statusCode === 'number'
    ? err.statusCode
    : (typeof err.status === 'number' ? err.status : 500);

  const code = typeof err.code === 'string'
    ? err.code
    : (statusCode === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');

  // Prevent stack or raw internal error leakage
  let message = err.message || 'An unexpected error occurred';
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  const details = err.details !== undefined ? err.details : null;

  // Server-side logging for unhandled/internal server errors (suppressed during unit tests)
  if (statusCode >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(`[Error] requestId=${req.id || 'N/A'} statusCode=${statusCode} code=${code} message="${message}"`, err.stack || err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
    },
  });
}

export default errorHandler;
