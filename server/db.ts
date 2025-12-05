import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';
import { config } from 'dotenv';

// ENV yuklash
config();

let db: any;
let isPostgreSQL = false;

// PostgreSQL bilan ulanishni ishga tushirish
(async () => {
  const connectionString = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!connectionString || !connectionString.includes('postgresql://')) {
    console.error('❌ DATABASE_URL PostgreSQL formatida emas yoki bo‘sh.');
    console.error('   Misol: postgresql://user:password@host:5432/dbname');
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  try {
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Ulanishni test qilish
    await pool.query('SELECT 1');

    db = drizzle(pool, { schema });
    isPostgreSQL = true;

    console.log('✅ PostgreSQL database connection established with pg driver');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database');
    console.error('Error details:', error);

    if (isProduction) {
      // Production’da albatta Postgres bo‘lishi kerak
      throw new Error('Failed to connect to PostgreSQL database in production mode');
    } else {
      throw error;
    }
  }
})();

// Database haqida ma’lumot qaytaruvchi helper
export function getDatabaseInfo() {
  return {
    type: isPostgreSQL ? 'postgresql' : 'unknown',
    isConnected: !!db,
    connectionString: isPostgreSQL ? 'PostgreSQL' : 'Unknown',
  };
}

export { db };