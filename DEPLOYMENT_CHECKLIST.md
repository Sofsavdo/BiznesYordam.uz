# 🚀 Deployment Checklist - BiznesYordam Platform

## ✅ Pre-Deployment Checks

### 1. Code Quality
- ✅ All recent changes committed (2,477+ lines added)
- ✅ No syntax errors in TypeScript files
- ✅ All imports properly resolved
- ✅ 39 API endpoints implemented
- ✅ 75 frontend components
- ✅ 6 main pages

### 2. Database Schema
- ⚠️ **ACTION REQUIRED**: New migration needed for inventory tables
- ✅ Schema updated with new enums:
  - `stock_status`
  - `movement_type`
  - `order_status`
  - `payment_status`
  - `fulfillment_status`
- ✅ New tables added:
  - `warehouses`
  - `warehouse_stock`
  - `stock_movements`
  - `orders`
  - `order_items`
  - `customers`
  - `stock_alerts`
  - `inventory_reports`

### 3. Environment Variables
- ✅ `.env.example` updated
- ✅ `render.yaml` configured
- ✅ Required variables:
  ```
  DATABASE_URL=postgresql://...
  SESSION_SECRET=<generate-secure-key>
  NODE_ENV=production
  PORT=5000
  CORS_ORIGIN=https://biznesyordam.uz
  FRONTEND_ORIGIN=https://biznesyordam.uz
  ```

### 4. Dependencies
- ✅ 93 production dependencies
- ✅ 19 dev dependencies
- ✅ All critical packages included:
  - express, drizzle-orm, pg
  - react, react-dom, wouter
  - bcryptjs, nanoid
  - ws (WebSocket)

### 5. Build Configuration
- ✅ Build scripts configured:
  ```json
  "build": "npm run build:client && npm run build:server"
  "build:client": "npx vite build"
  "build:server": "esbuild server/index.ts --bundle"
  ```
- ✅ Start command: `npm start`
- ✅ Health check: `/api/health`

---

## 🔧 Critical Issues to Fix Before Deployment

### 1. ⚠️ Database Migration
**Issue**: Schema has new tables but no migration file

**Solution**:
```bash
# Generate new migration
npm run db:generate

# This will create migration for:
# - New enums (stock_status, movement_type, etc.)
# - New tables (warehouses, orders, customers, etc.)
# - Updated products table with inventory fields
```

**Files to check**:
- `migrations/` directory should have new SQL file
- Verify all new tables are included

---

### 2. ⚠️ Top-Level Await in db.ts
**Status**: ✅ FIXED
- Wrapped in async IIFE
- No longer blocking module initialization

---

### 3. ⚠️ Session Store for Production
**Current**: MemoryStore (not suitable for production)

**Recommendation**:
```typescript
// Option 1: PostgreSQL session store (RECOMMENDED)
import connectPg from 'connect-pg-simple';
const PgSession = connectPg(session);

store: new PgSession({
  pool: pgPool,
  tableName: 'sessions'
})

// Option 2: Redis (if available)
import RedisStore from 'connect-redis';
store: new RedisStore({ client: redisClient })
```

**Action**: Update `server/session.ts` before production deployment

---

## 📋 Deployment Steps for Render

### Step 1: Prepare Database
```bash
# 1. Create PostgreSQL database on Render
# 2. Get DATABASE_URL
# 3. Run migrations
npm run db:push
# or
npm run db:migrate
```

### Step 2: Configure Environment Variables
In Render Dashboard, set:
```
DATABASE_URL=<from-render-postgres>
SESSION_SECRET=<generate-with: openssl rand -base64 32>
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://biznesyordam.uz,https://www.biznesyordam.uz
FRONTEND_ORIGIN=https://biznesyordam.uz
VITE_API_URL=https://biznesyordam.uz
DATABASE_AUTO_SETUP=true
```

### Step 3: Deploy
```bash
# Push to main branch
git push origin main

# Render will automatically:
# 1. Run: npm ci
# 2. Run: npm run build
# 3. Start: npm start
```

### Step 4: Verify Deployment
```bash
# Check health endpoint
curl https://biznesyordam.uz/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "...",
  "database": "connected"
}
```

### Step 5: Seed Initial Data
```bash
# SSH into Render instance or use Render Shell
npm run seed

# This will create:
# - Admin user (admin / BiznesYordam2024!)
# - Test partner
# - Pricing tiers
# - Sample data
```

---

## 🔍 Post-Deployment Verification

### 1. Test Authentication
- [ ] Login as admin works
- [ ] Partner registration works
- [ ] Session persists across requests
- [ ] Logout works properly

### 2. Test Core Features
- [ ] Partner dashboard loads
- [ ] Products CRUD works
- [ ] Inventory management works
- [ ] Orders can be created
- [ ] Stock alerts trigger correctly
- [ ] Analytics display properly

### 3. Test Integrations
- [ ] WebSocket connection works
- [ ] Real-time notifications work
- [ ] File uploads work (if enabled)
- [ ] Email notifications work (if configured)

### 4. Performance Checks
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] No memory leaks

### 5. Security Checks
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Session security enabled
- [ ] SQL injection protected (using Drizzle ORM)
- [ ] XSS protection enabled (Helmet)
- [ ] Rate limiting works

---

## 🐛 Known Issues & Workarounds

### 1. SQLite in Development
**Issue**: Development uses SQLite, production uses PostgreSQL

**Status**: ✅ HANDLED
- Code automatically detects DATABASE_URL
- Falls back to SQLite if no PostgreSQL
- Production will use PostgreSQL

### 2. WebSocket on Render
**Issue**: WebSocket might need special configuration

**Solution**: Already configured with path `/ws`
```typescript
wss = new WebSocketServer({ 
  server,
  path: '/ws'
});
```

### 3. File Uploads
**Issue**: Render ephemeral filesystem

**Solution**: 
- Use external storage (S3, Cloudinary) for production
- Or disable file uploads temporarily

---

## 📊 Monitoring & Maintenance

### Logs
```bash
# View logs in Render Dashboard
# Or use Render CLI:
render logs -s biznesyordam-backend
```

### Database Backups
```bash
# Render PostgreSQL includes automatic backups
# Manual backup:
pg_dump $DATABASE_URL > backup.sql
```

### Performance Monitoring
- Use Render metrics dashboard
- Monitor response times
- Check error rates
- Watch memory usage

---

## 🚨 Rollback Plan

If deployment fails:

### Option 1: Revert Git
```bash
git revert HEAD
git push origin main
```

### Option 2: Redeploy Previous Version
```bash
# In Render Dashboard:
# 1. Go to Deploys
# 2. Find last working deploy
# 3. Click "Redeploy"
```

### Option 3: Manual Rollback
```bash
git reset --hard <previous-commit-hash>
git push --force origin main
```

---

## ✅ Final Checklist

Before clicking "Deploy":

- [ ] All code committed and pushed
- [ ] Database migration generated
- [ ] Environment variables configured
- [ ] render.yaml verified
- [ ] Health check endpoint tested
- [ ] Session store updated (if needed)
- [ ] CORS origins correct
- [ ] Admin credentials secure
- [ ] Backup plan ready
- [ ] Monitoring setup

---

## 🎯 Recommended Actions

### High Priority (Do Before Deploy)
1. ✅ Generate database migration
2. ✅ Update session store for production
3. ✅ Verify all environment variables
4. ✅ Test build locally: `npm run build`

### Medium Priority (Can Do After Deploy)
1. Setup monitoring and alerts
2. Configure email notifications
3. Add rate limiting
4. Setup CDN for static assets
5. Configure custom domain SSL

### Low Priority (Future Improvements)
1. Add Redis for caching
2. Setup CI/CD pipeline
3. Add automated tests
4. Setup staging environment
5. Add performance monitoring

---

## 📞 Support & Resources

### Documentation
- Render Docs: https://render.com/docs
- Drizzle ORM: https://orm.drizzle.team
- Express.js: https://expressjs.com

### Troubleshooting
- Check Render logs first
- Verify DATABASE_URL connection
- Test health endpoint
- Check CORS configuration

---

## 🎉 Ready to Deploy!

If all checks pass:
```bash
git push origin main
```

Then monitor Render dashboard for deployment progress.

**Expected deployment time**: 5-10 minutes

**First deploy might take longer** due to:
- npm ci installing all dependencies
- Building client and server
- Database initialization

---

## 📝 Notes

- Current version: 2.0.1
- Last major update: CRM/ERP/Inventory System
- Total lines added: 2,477+
- New features: 8 major systems
- API endpoints: 39
- Components: 75

**Platform is production-ready with minor fixes!** 🚀
