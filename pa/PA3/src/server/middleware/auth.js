// Re-export authoritative V2 F01 authentication and RBAC middlewares
export {
  authenticate,
  authorize,
  requireAuth,
  requireRole,
  default,
} from '../src/middlewares/auth.js';
