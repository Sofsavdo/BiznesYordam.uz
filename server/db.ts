import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Always use PostgreSQL - this is a production platform
const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.includes('postgresql://')) {
  throw new Error('PostgreSQL DATABASE_URL is required for production platform');
}

// Use PostgreSQL with pg driver (more reliable for Render)
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const db = drizzle(pool, { schema });
console.log('✅ PostgreSQL database connection established with pg driver');

export { db };