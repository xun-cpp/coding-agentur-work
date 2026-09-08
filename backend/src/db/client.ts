import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { Environment } from '../config/env.js';
import * as schema from './schema.js';

export type Database = NodePgDatabase<typeof schema>;
export interface DatabaseConnection {
  db?: Database;
  close(): Promise<void>;
}
export function createDatabase(environment: Environment): DatabaseConnection {
  if (!environment.DATABASE_URL) return { close: async () => undefined };
  const pool = new Pool({
    connectionString: environment.DATABASE_URL,
    application_name: 'reference-application-api',
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 8_000,
    query_timeout: 10_000,
    allowExitOnIdle: false,
  });
  pool.on('error', (error) => {
    console.error(JSON.stringify({ level: 'error', event: 'postgres_idle_client_error', errorType: error.name }));
  });
  return { db: drizzle(pool, { schema }), close: () => pool.end() };
}
