import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export function getSessionConfig() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    store: new MemoryStoreSession({
      checkPeriod: 86400000
    }),
    secret: process.env.SESSION_SECRET || "your-secret-key-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  } as session.SessionOptions;
}
