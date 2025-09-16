# BiznesYordam - cPanel (Eskiz.uz) Deployment Guide

This guide helps you deploy the app on Eskiz.uz cPanel with your domain biznesyordam.uz.

## What you'll set up
- Single Node.js app serving both API and static frontend
- Persistent SQLite database file (no PostgreSQL required)
- Proper CORS for your domain
- HTTPS via AutoSSL (or your SSL)

## 1) Prepare local build (optional but recommended)

```bash
# On your computer or server
npm ci
npm run build
```

This creates dist/ containing the server bundle and dist/public/ containing built frontend.

## 2) Create environment file

Create a .env file for production. Prefer absolute SQLite path on cPanel:

```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=change-this-strong-secret

# Use persistent SQLite path. Replace USERNAME with your cPanel username.
SQLITE_PATH=/home/USERNAME/biznesyordam/data/app.db

# Same-origin config
FRONTEND_ORIGIN=https://biznesyordam.uz
CORS_ORIGIN=https://biznesyordam.uz,https://www.biznesyordam.uz
VITE_API_URL=

# WebSocket
ENABLE_WEBSOCKETS=true
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000
```

Upload .env to the app root on cPanel (not public_html).

## 3) Upload files to cPanel

Two options:
- Upload the entire repository and build on the server, or
- Build locally and upload only necessary files.

Required on the server:
- dist/ (from npm run build)
- package.json, package-lock.json
- .env
- node_modules/ (optional to upload; cPanel can run npm ci)

Optional but useful:
- start.sh, CPANEL_DEPLOYMENT.md

Create a data/ directory for SQLite and keep it outside public_html:

```bash
mkdir -p /home/USERNAME/biznesyordam/data
```

## 4) cPanel Node.js App setup

1. Login to cPanel -> Setup Node.js App
2. Create Application:
   - Application mode: Production
   - Node.js version: 18+
   - Application root: /home/USERNAME/biznesyordam
   - Application URL: leave blank (we’ll proxy via domain)
   - Application startup file: dist/index.js
3. Create the app. cPanel will assign an internal port (e.g., 3000-5000).
4. Open the app shell (cPanel provides a terminal for the app) and run:

```bash
npm ci
# Optional: if better-sqlite3 fails, skip rebuild (our postinstall already skips)
# REBUILD_SQLITE=0 npm ci
npm run build
```

Notes:
- We set postinstall to skip better-sqlite3 rebuild unless REBUILD_SQLITE=1.
- The server falls back to SQLite and uses SQLITE_PATH.

Click “Restart” in cPanel Node.js App UI after install/build.

## 5) Point your domain (biznesyordam.uz)

Use cPanel Domains -> Domains:
- Ensure biznesyordam.uz is added
- Set document root for biznesyordam.uz to public_html

We will reverse-proxy to the Node app using .htaccess with Passenger or via “Application URL mapping” depending on host. If Passenger isn’t available, use .htaccess to proxy to the Node port.

Create /home/USERNAME/public_html/.htaccess:

```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy all requests to the Node.js app internal port
# Replace 127.0.0.1:PORT with your app's internal address from cPanel
ProxyPreserveHost On
ProxyRequests Off

<Proxy *>
  Require all granted
</Proxy>

RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/
RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
```

Notes:
- Some cPanel environments require enabling mod_proxy support. If not available, ask hosting support to map your domain to the Node app or use the “Application URL” bind feature if provided.
- Alternative: If “Application URL” is supported, set it to the root domain and skip .htaccess proxy.

## 6) Build assets on the server (if not uploaded)

If you didn’t upload dist/, build on the server app root:

```bash
npm run build
```

The Vite build outputs to dist/public, which Express serves in production.

## 7) Verify

- Visit https://biznesyordam.uz
- Check health endpoint: https://biznesyordam.uz/api/health
- Login with default credentials if you seeded SQLite fallback.

## 8) Common issues

- 502/503 after deploy: Restart app in cPanel; verify .env and dist/ exist.
- CORS blocked: Ensure CORS_ORIGIN contains your domain(s). Our server also allows subdomains of biznesyordam.uz.
- WebSocket not connecting: Ensure HTTPS and that proxy passes Upgrade headers. On some hosts .htaccess proxy may need extra headers; contact support to enable WebSocket proxying.
- SQLite file not created: Ensure directory exists and SQLITE_PATH points to a writable path.

## 9) Zero-downtime updates

```bash
# Pull/Upload changes
npm ci
npm run build
# Restart the Node.js app from cPanel UI
```

## 10) Security
- Use a strong SESSION_SECRET
- Keep .env outside public_html
- Use AutoSSL for HTTPS
- Restrict SSH access and rotate credentials

---

If you need PostgreSQL later, set DATABASE_URL in .env. The app will automatically use Postgres if reachable; otherwise it uses SQLite.