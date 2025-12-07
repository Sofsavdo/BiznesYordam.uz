import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

// NOTE:
// Lokal rivojlanish va demo uchun biz SQLite (better-sqlite3) dan foydalanamiz.
// Drizzle ORM asosiy jadval va typelarga ishlaydi, lekin ayrim controllerlar
// xom SQL bilan `db.query`, `db.all`, `db.get` funksiyalarini ham chaqiradi.
// Shu sababli bu yerda ikkala uslubni ham qo'llab-quvvatlaydigan bitta db obyektini
// hosil qilamiz.

// Asosiy SQLite connection
const sqlite = new Database('dev.db');

// Drizzle ORM instansiyasi (typed schema bilan)
const drizzleDb = drizzle(sqlite, { schema });

// Drizzle obyektini kengaytirib, xom SQL helperlarini qo'shamiz
const db: any = drizzleDb;

// Simple helper: SELECT/INSERT/UPDATE uchun .query (hamma natijalar)
db.query = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.all(...params) : stmt.all();
};

// .all alias (SQLite style)
db.all = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.all(...params) : stmt.all();
};

// .get helper – bitta qator qaytarish uchun
db.get = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.get(...params) : stmt.get();
};

// .run helper – INSERT/UPDATE/DELETE uchun (better-sqlite3 style)
db.run = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  const info = params && params.length > 0 ? stmt.run(...params) : stmt.run();
  return info;
};

// Database haqida ma’lumot qaytaruvchi helper
export function getDatabaseInfo() {
  return {
    type: 'sqlite',
    isConnected: !!db,
    connectionString: 'SQLite',
  };
}

export { db, sqlite };