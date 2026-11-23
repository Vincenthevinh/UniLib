import app from './app.js';
import env from './config/env.js';
import { prisma } from './db.js';
import { sweepExpiredHolds } from './services/reservations.js';

const server = app.listen(env.PORT, () => {
  console.log(
    `[UniLib Backend] Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`
  );
  console.log(
    `[UniLib Backend] Health check available at http://localhost:${env.PORT}/api/health`
  );
});

// Automatically release expired reservation holds
const sweepMs = Number(process.env.RESERVATION_SWEEP_MS || 60000);

if (Number.isFinite(sweepMs) && sweepMs > 0) {
  let sweeping = false;

  const timer = setInterval(async () => {
    if (sweeping) return;

    sweeping = true;

    try {
      const result = await sweepExpiredHolds();

      if (result.expired) {
        console.log('[UniLib Backend] Expired holds:', result.expired);
      }
    } catch (error) {
      console.error(
        '[UniLib Backend] Reservation sweep failed:',
        error?.message || error
      );
    } finally {
      sweeping = false;
    }
  }, sweepMs);

  timer.unref();
}

// Graceful shutdown handling
let shuttingDown = false;

async function handleGracefulShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(
    `\n[UniLib Backend] Received ${signal}. Starting graceful shutdown...`
  );

  const forceShutdown = setTimeout(() => {
    console.error(
      '[UniLib Backend] Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 5000);

  forceShutdown.unref();

  server.close(async () => {
    console.log('[UniLib Backend] HTTP server closed.');

    try {
      await prisma.$disconnect();
      console.log('[UniLib Backend] Prisma disconnected.');
      clearTimeout(forceShutdown);
      process.exit(0);
    } catch (error) {
      console.error('[UniLib Backend] Prisma disconnect failed:', error);
      clearTimeout(forceShutdown);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
