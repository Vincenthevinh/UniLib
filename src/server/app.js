import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';
import { requestId, errorHandler, notFound } from './src/middlewares/index.js';
import { checkDatabaseHealth } from './src/config/dbHealth.js';

// Module routes
import authRoutes from './src/modules/auth/auth.routes.js';
import usersRoutes from './src/modules/users/users.routes.js';
import booksRoutes from './src/modules/books/books.routes.js';
import copiesRoutes from './src/modules/copies/copies.routes.js';
import loansRoutes from './src/modules/loans/loans.routes.js';
import reservationsRoutes from './src/modules/reservations/reservations.routes.js';
import dashboardRoutes from './src/modules/dashboard/dashboard.routes.js';

const app = express();

// Security and standard middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestId);

// HTTP Logging (suppressed in test environment)
if (env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms [req-id: :req[x-request-id]]'));
}

// Health check endpoint (FR-NFR baseline requirement)
app.get('/api/health', async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseHealth();
    res.status(200).json({
      status: 'ok',
      db: dbStatus,
    });
  } catch (err) {
    next(err);
  }
});

// Mount modules under /api/v1 prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/copies', copiesRoutes);
app.use('/api/v1/loans', loansRoutes);
app.use('/api/v1/reservations', reservationsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Catch-all 404 for unknown endpoints
app.use(notFound);

// Centralized error handling middleware (always returns { error: { code, message, details } })
app.use(errorHandler);

export default app;
