import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define partners table schema
const partners = sqliteTable('partners', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  businessName: text('business_name').notNull(),
  phone: text('phone').notNull(),
});

const sqlite = new Database('dev.db');
const db = drizzle(sqlite, { schema: { partners } });

// Test query
try {
  const result = db.select().from(partners).where(eq(partners.userId, 'user-1765251670281')).all();
  console.log('Query result:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Query error:', error.message);
  console.error('Full error:', error);
}
