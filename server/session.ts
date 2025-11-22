import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const MemoryStoreSession = MemoryStore(session);
const PgSession = connectPgSimple(session);

export function getSessionConfig() {
  const isProd = process.env.NODE_ENV === "production";
  
  let store;
  
  if (isProd && process.env.DATABASE_URL) {
    // Use PostgreSQL session store in production
    console.log('✅ Using PostgreSQL session store');
    
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    });
    
    store = new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: false, // Don't auto-create, use migration instead
      pruneSessionInterval: 60 * 15 // Prune expired sessions every 15 minutes
    });
  } else {
    // Use MemoryStore for development
    console.log('⚠️  Using MemoryStore (development only)');
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
      secure: false, // Must be false for Render (proxy handles HTTPS)
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain: undefined
    },
    rolling: true,
    proxy: true
  } as session.SessionOptions;

  console.log('🔧 Session config:', {
    name: sessionConfig.name,
    storeType: isProd && process.env.DATABASE_URL ? 'PostgreSQL' : 'Memory',
    cookie: sessionConfig.cookie,
    proxy: sessionConfig.proxy
  });

  return sessionConfig;
}
