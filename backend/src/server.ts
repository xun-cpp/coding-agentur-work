import { createApp } from './app/create-app.js';
import { readEnvironment } from './config/env.js';
import { createDatabase } from './db/client.js';

const environment = readEnvironment();
const database = createDatabase(environment);
const app = createApp(environment, { database });
let shuttingDown = false;
const shutdown = async (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;
  app.log.info({ signal }, 'shutdown_started');
  const forceExit = setTimeout(() => process.exit(1), 12_000).unref();
  try {
    await app.close();
    await database.close();
    clearTimeout(forceExit);
    process.exit(0);
  } catch (error) {
    app.log.error({ errorType: error instanceof Error ? error.name : 'unknown' }, 'shutdown_failed');
    process.exit(1);
  }
};
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
await app.listen({ port: environment.PORT, host: '127.0.0.1' });
