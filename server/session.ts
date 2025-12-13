import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const MemoryStoreSession = MemoryStore(session);
const PgSession = connectPgSimple(session);

export function getSessionConfig() {
  const isProd = process.env.NODE_ENV === "production";
  const databaseUrl = process.env.DATABASE_URL || '';
  const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');
  
  let store;
  
  if (isProd && isPostgres) {
    // Use PostgreSQL session store in production with PostgreSQL
    console.log('✅ Using PostgreSQL session store');
    
    const pool = new pg.Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    });
    
    store = new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true, // Auto-create for Railway
      pruneSessionInterval: 60 * 15 // Prune expired sessions every 15 minutes
    });
  } else {
    // Use MemoryStore for development or SQLite production
    const storeType = isProd ? 'MemoryStore (SQLite production)' : 'MemoryStore (development)';
    console.log(`⚠️  Using ${storeType}`);
    store = new MemoryStoreSession({
      checkPeriod: 86400000,
      ttl: 7 * 24 * 60 * 60 * 1000,
      stale: false
    });
  }

  const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET || "your-secret-key-dev-only",
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
      secure: isProd ? true : false, // true in production (Railway has HTTPS)
      httpOnly: true,
      sameSite: isProd ? "none" as const : "lax" as const, // "none" for cross-origin in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain: undefined
    },
    rolling: true,
    proxy: true // Trust Railway proxy
  } as session.SessionOptions;

  console.log('🔧 Session config:', {
    name: sessionConfig.name,
    storeType: isPostgres ? 'PostgreSQL' : 'Memory',
    cookie: sessionConfig.cookie,
    proxy: sessionConfig.proxy,
    environment: isProd ? 'production' : 'development'
  });

  return sessionConfig;
}
