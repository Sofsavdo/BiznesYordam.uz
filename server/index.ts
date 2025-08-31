import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFound } from "./errorHandler";
// Mock database removed - using real database
import { initializeWebSocket } from "./websocket";

const app = express();

// ✅ CORS ni faqat ruxsat berilgan domenlar bilan ishlatamiz
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://biznesyordam.uz',
  'https://www.biznesyordam.uz',
  'https://biznesyordam-backend.onrender.com',
  'https://biznes-yordam.onrender.com'
];

// Environment'dan qo'shimcha originlarni qo'shamiz
const envOrigins = (process.env.CORS_ORIGIN || "").split(",").filter(origin => origin.trim());
allowedOrigins.push(...envOrigins);

console.log("🔧 Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: function(origin, callback) {
      // Development uchun origin bo'lmasligi mumkin
      if (!origin) return callback(null, true);
      
      // Allow all known origins
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
    exposedHeaders: ['Set-Cookie', 'Access-Control-Allow-Credentials'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400 // Cache preflight for 24 hours
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log session information for auth endpoints
  if (path.startsWith('/api/auth')) {
    console.log('🔍 Auth Request:', {
      method: req.method,
      path: path,
      sessionID: req.sessionID,
      hasSession: !!req.session,
      hasUser: !!req.session?.user,
      cookies: req.headers.cookie,
      origin: req.headers.origin
    });
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  log("🚀 Starting BiznesYordam Fulfillment Platform...");

  // ✅ Real database setup
  log("✅ Real database connection initialized");

  const server = await registerRoutes(app);

  // Initialize WebSocket server
  const wsManager = initializeWebSocket(server);
  (global as any).wsManager = wsManager;

  // ✅ Vite faqat developmentda ishlaydi
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 404 handler
  app.use(notFound);

  // Error handler
  app.use(errorHandler);

  // ✅ PORT - Render'dan oladi
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`✅ Server running on port ${port}`);
    }
  );
})();
