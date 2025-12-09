const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const { eq } = require('drizzle-orm');
const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

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
}
