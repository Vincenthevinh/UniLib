/**
 * 404 Not Found Middleware for unhandled route paths.
 * Returns standard UniLib error format.
 */
export function notFound(req, res, next) { // eslint-disable-line no-unused-vars
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
      details: null,
    },
  });
}

export default notFound;
