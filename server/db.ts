import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { config } from 'dotenv';

// Load environment variables
config();

let db: any;

// Check if we have a real PostgreSQL DATABASE_URL
const connectionString = process.env.DATABASE_URL;

// Force SQLite usage in development environment (Replit)
if (process.env.NODE_ENV === 'development' && process.env.REPL_ID) {
  console.log('🔧 Using SQLite for Replit development environment');
  const sqlite = new Database(':memory:');
  db = drizzleSQLite(sqlite, { schema });
  initializeSQLiteTables(sqlite);
} else if (connectionString && connectionString.includes('postgresql://') && !connectionString.includes('memory:memory')) {
  try {
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

    db = drizzle(pool, { schema });
    console.log('✅ PostgreSQL database connection established with pg driver');
  } catch (error) {
    console.error('PostgreSQL connection failed, falling back to SQLite:', error);
    // Fallback to SQLite
    const sqlite = new Database(':memory:');
    db = drizzleSQLite(sqlite, { schema });
    initializeSQLiteTables(sqlite);
  }
} else {
  // Use SQLite as fallback for development
  console.log('Using SQLite fallback for development');
  const sqlite = new Database(':memory:');
  db = drizzleSQLite(sqlite, { schema });
  initializeSQLiteTables(sqlite);
}

function initializeSQLiteTables(sqlite: Database.Database) {
  // Initialize SQLite tables for development
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'partner',
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      business_name TEXT,
      business_category TEXT NOT NULL,
      monthly_revenue TEXT,
      pricing_tier TEXT NOT NULL DEFAULT 'starter_pro',
      commission_rate TEXT NOT NULL DEFAULT '0.30',
      is_approved BOOLEAN NOT NULL DEFAULT false,
      approved_by TEXT,
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (approved_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      category TEXT,
      marketplace TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    );

    CREATE TABLE IF NOT EXISTS fulfillment_requests (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      estimated_cost TEXT,
      actual_cost TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    );
  `);
  
  console.log('✅ SQLite database connection established (development mode)');
}

export { db };