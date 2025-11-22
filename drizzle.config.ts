import type { Config } from "drizzle-kit";
import { config } from 'dotenv';

// Load environment variables
config();

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: process.env.DATABASE_URL?.startsWith('postgresql') ? "postgresql" : "sqlite",
  dbCredentials: process.env.DATABASE_URL?.startsWith('postgresql') 
    ? {
        url: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        url: process.env.DATABASE_URL || "file:./dev.db",
      },
  verbose: true,
  strict: true,
} satisfies Config;
