import app from './app.js';
import env from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`[UniLib Backend] Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
  console.log(`[UniLib Backend] Health check available at http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown handling
function handleGracefulShutdown(signal) {
  console.log(`\n[UniLib Backend] Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('[UniLib Backend] HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown if cleanup takes too long
  setTimeout(() => {
    console.error('[UniLib Backend] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000).unref();
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
