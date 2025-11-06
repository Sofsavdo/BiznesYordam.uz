import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFound } from "./errorHandler";
// Mock database removed - using real database
import { initializeWebSocket } from "./websocket";
import helmet from "helmet";
import * as Sentry from "@sentry/node";
import winston from "winston";

const app = express();

// Basic Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`)
      )
    })
  ]
});

// Sentry init (optional DSN)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.2
  });
  app.use(Sentry.Handlers.requestHandler());
}

// Helmet security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// ✅ CORS ni faqat ruxsat berilgan domenlar bilan ishlatamiz
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://0.0.0.0:5000',
  'http://localhost:3000',
  'http://localhost:8080',
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
      
      // Allow Replit development domains (dynamic proxy URLs)
      if (origin && origin.includes('.replit.dev')) {
        callback(null, true);
        return;
      }
      
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

// Trust proxy for Render deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ✅ Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log session information for auth endpoints
  if (path.startsWith('/api/auth')) {
    logger.info(`Auth request ${req.method} ${path}`);
  }

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.call(res, bodyJson);
  } as any;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try { logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`; } catch {}
      }
      if (logLine.length > 200) {
        logLine = logLine.slice(0, 199) + "…";
      }
      logger.info(logLine);
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
  try {
    const wsManager = initializeWebSocket(server);
    (global as any).wsManager = wsManager;
  } catch (error) {
    console.error('WebSocket initialization failed:', error);
    console.log('⚠️  Continuing without WebSocket support');
  }

  // ✅ Vite faqat developmentda ishlaydi
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 404 handler
  app.use(notFound);

  // Error handler
  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
  }
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
