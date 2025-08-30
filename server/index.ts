import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFound } from "./errorHandler";
import { initMockDatabase, seedMockData } from "./mockDb";
import { initializeWebSocket } from "./websocket";

const app = express();

// ✅ CORS ni faqat ruxsat berilgan domenlar bilan ishlatamiz
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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

  // ✅ Mock DB faqat developmentda ishlasin
  if (app.get("env") === "development") {
    const dbInitialized = initMockDatabase();
    if (dbInitialized) {
      await seedMockData();
    }
    log("✅ Mock database ready with test data");
  }

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
