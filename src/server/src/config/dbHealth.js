import net from 'node:net';
import env from '../../config/env.js';

/**
 * Checks PostgreSQL database connectivity.
 * Resolves to 'up' if reachable, or 'down' if unconfigured / unreachable.
 * Never throws so that /api/health remains resilient (HTTP 200).
 */
export async function checkDatabaseHealth() {
  if (!env.DATABASE_URL) {
    return 'down';
  }

  try {
    const url = new URL(env.DATABASE_URL);
    const host = url.hostname;
    const port = parseInt(url.port, 10) || 5432;

    return await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(800);

      socket.once('connect', () => {
        socket.destroy();
        resolve('up');
      });

      socket.once('timeout', () => {
        socket.destroy();
        resolve('down');
      });

      socket.once('error', () => {
        socket.destroy();
        resolve('down');
      });

      socket.connect(port, host);
    });
  } catch {
    return 'down';
  }
}

export default checkDatabaseHealth;
