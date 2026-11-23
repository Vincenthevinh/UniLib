import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';
import {
  requestId,
  errorHandler,
  notFound,
} from './src/middlewares/index.js';

import { checkDatabaseHealth } from './src/config/dbHealth.js';

// Module routes (PA2 V1 Skeleton modules)
import authRoutes from './src/modules/auth/auth.routes.js';
import usersRoutes from './src/modules/users/users.routes.js';
import booksRoutes from './src/modules/books/books.routes.js';
import copiesRoutes from './src/modules/copies/copies.routes.js';
import loansRoutes from './src/modules/loans/loans.routes.js';
import reservationsRoutes from './src/modules/reservations/reservations.routes.js';
import dashboardRoutes from './src/modules/dashboard/dashboard.routes.js';

// Integrated service routers (F02/F03/F06 feature contracts)
import { booksRouter } from './routes/books.js';
import { copiesRouter } from './routes/copies.js';
import { reservationsRouter } from './routes/reservations.js';

export const app = express();

// Security middlewares
app.disable('x-powered-by');
app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Request parsing
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

// Request tracking
app.use(requestId);

// HTTP Logging (suppressed in test environment)
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms [req-id: :req[x-request-id]]'
    )
  );
}

// Health check endpoint
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

// Primary feature API routes
app.use('/api/books', booksRouter);
app.use('/api/copies', copiesRouter);
app.use('/api/reservations', reservationsRouter);

// Versioned modular API routes (Skeleton & Extended)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/copies', copiesRoutes);
app.use('/api/v1/loans', loansRoutes);
app.use('/api/v1/reservations', reservationsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Handle unknown endpoints
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

export default app;
