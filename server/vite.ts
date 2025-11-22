import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: false, // Disabled to avoid WebSocket issues in Replit
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    log(`❌ Build directory not found: ${distPath}`);
    log(`⚠️  Please run 'npm run build' first`);
    log(`📂 Current directory: ${process.cwd()}`);
    log(`📂 Directory contents:`);
    try {
      const files = fs.readdirSync(process.cwd());
      log(`   ${files.join(', ')}`);
      if (fs.existsSync(path.resolve(process.cwd(), "dist"))) {
        const distFiles = fs.readdirSync(path.resolve(process.cwd(), "dist"));
        log(`📂 dist/ contents: ${distFiles.join(', ')}`);
      }
    } catch (e) {
      log(`   Error reading directory: ${e}`);
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  log(`📁 Serving static files from: ${distPath}`);

  // Middleware to set proper MIME types and headers BEFORE express.static
  app.use((req, res, next) => {
    const filePath = req.path;
    
    // Only process static file requests
    if (!filePath.startsWith('/api') && !filePath.startsWith('/ws')) {
      // Set proper MIME types based on file extension
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } else if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.woff')) {
        res.setHeader('Content-Type', 'font/woff');
      } else if (filePath.endsWith('.woff2')) {
        res.setHeader('Content-Type', 'font/woff2');
      } else if (filePath.endsWith('.ttf')) {
        res.setHeader('Content-Type', 'font/ttf');
      } else if (filePath.endsWith('.eot')) {
        res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
      
      // Cache control for production
      if (process.env.NODE_ENV === 'production') {
        // Cache static assets for 1 year
        if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          // Don't cache HTML
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      } else {
        // Development: no cache
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      
      // CORS headers for all static files
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    }
    
    next();
  });

  // Serve static files with proper configuration
  app.use(express.static(distPath, {
    index: 'index.html',
    extensions: ['html'],
    fallthrough: true
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    
    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      log(`❌ index.html not found at: ${indexPath}`);
      return res.status(500).send('Application not built correctly. index.html missing.');
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(indexPath, (err) => {
      if (err) {
        log(`❌ Error sending index.html: ${err.message}`);
        res.status(500).send('Error loading application');
      }
    });
  });
}
