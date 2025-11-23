# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## ✅ PRE-DEPLOYMENT CHECKS

### 1. Environment Variables
```bash
# Create .env file from .env.example
cp .env.example .env

# CRITICAL: Update these values:
- [ ] DATABASE_URL (PostgreSQL connection string)
- [ ] SESSION_SECRET (generate with: openssl rand -base64 32)
- [ ] ADMIN_PASSWORD (strong password)
- [ ] SMTP credentials (if using email)
- [ ] FRONTEND_ORIGIN (your domain)
```

### 2. Database Setup
```bash
# Run migration
npm run db:push

# Or manually:
psql -d your_database -f migrations/001_add_profit_share_model.sql
psql -d your_database -f migrations/002_add_ai_fields.sql

# Verify tables created
psql -d your_database -c "\dt"
```

### 3. Build Verification
```bash
# Build the project
npm run build

# Verify build output
ls -la dist/
ls -la dist/public/

# Should see:
# - dist/index.js (server bundle)
# - dist/public/index.html
# - dist/public/assets/*.js
# - dist/public/assets/*.css
```

### 4. Security Audit
- [ ] All console.log removed from production code
- [ ] SESSION_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] CORS_ORIGIN is set correctly
- [ ] Rate limiting is configured
- [ ] Helmet security headers enabled

### 5. Performance Optimization
- [ ] Gzip compression enabled
- [ ] Static assets cached
- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Bundle size acceptable (<2MB)

## 🔧 DEPLOYMENT STEPS

### Option A: Manual Deployment

```bash
# 1. Clone repository
git clone https://github.com/Sofsavdo/BiznesYordam.uz.git
cd BiznesYordam.uz

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Setup database
npm run db:push

# 5. Build
npm run build

# 6. Start
npm start
```

### Option B: PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name biznesyordam

# Setup auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Option C: Docker Deployment

```bash
# Build image
docker build -t biznesyordam .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name biznesyordam \
  biznesyordam
```

## 🔍 POST-DEPLOYMENT VERIFICATION

### 1. Health Check
```bash
curl http://your-domain.com/api/health
# Expected: {"status":"ok"}
```

### 2. API Endpoints
```bash
# Test login
curl -X POST http://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'

# Test partners endpoint (with session cookie)
curl http://your-domain.com/api/admin/partners \
  -H "Cookie: connect.sid=..."
```

### 3. Database Connection
```bash
# Check if tables exist
psql -d your_database -c "SELECT COUNT(*) FROM partners;"
psql -d your_database -c "SELECT COUNT(*) FROM users;"
```

### 4. Performance Metrics
- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Database query time < 100ms
- [ ] Memory usage stable
- [ ] CPU usage < 70%

## ⚠️ CRITICAL WARNINGS

### DO NOT:
- ❌ Use default SESSION_SECRET in production
- ❌ Expose database credentials
- ❌ Leave console.log in production code
- ❌ Use HTTP (must be HTTPS)
- ❌ Disable CORS without proper configuration

### DO:
- ✅ Use HTTPS/SSL certificates
- ✅ Enable rate limiting
- ✅ Setup monitoring (Sentry/Datadog)
- ✅ Configure backups
- ✅ Setup logging
- ✅ Enable error tracking

## 📊 MONITORING

### Logs
```bash
# PM2 logs
pm2 logs biznesyordam

# Docker logs
docker logs biznesyordam

# System logs
tail -f /var/log/biznesyordam.log
```

### Metrics to Monitor
- [ ] Request rate
- [ ] Error rate
- [ ] Response time
- [ ] Database connections
- [ ] Memory usage
- [ ] CPU usage
- [ ] Disk space

## 🔄 UPDATES & MAINTENANCE

### Update Process
```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Run migrations
npm run db:push

# 4. Build
npm run build

# 5. Restart
pm2 restart biznesyordam
# or
docker restart biznesyordam
```

### Backup Strategy
```bash
# Database backup (daily)
pg_dump your_database > backup_$(date +%Y%m%d).sql

# Automated backup script
0 2 * * * /usr/bin/pg_dump your_database > /backups/db_$(date +\%Y\%m\%d).sql
```

## 🆘 TROUBLESHOOTING

### Common Issues

**1. Port already in use**
```bash
# Find process
lsof -i :5000
# Kill process
kill -9 <PID>
```

**2. Database connection failed**
```bash
# Check PostgreSQL status
systemctl status postgresql
# Restart PostgreSQL
systemctl restart postgresql
```

**3. Build fails**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

**4. Session issues**
```bash
# Clear sessions table
psql -d your_database -c "DELETE FROM sessions;"
```

## 📞 SUPPORT

- GitHub Issues: https://github.com/Sofsavdo/BiznesYordam.uz/issues
- Email: support@biznesyordam.uz
- Documentation: https://docs.biznesyordam.uz

## ✅ FINAL CHECKLIST

Before going live:
- [ ] All environment variables configured
- [ ] Database migrated successfully
- [ ] Build completed without errors
- [ ] Health check returns OK
- [ ] Admin login works
- [ ] Partner registration works
- [ ] API endpoints respond correctly
- [ ] HTTPS/SSL configured
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Error tracking enabled
- [ ] Performance tested
- [ ] Security audited
- [ ] Documentation updated

## 🎉 GO LIVE!

Once all checks pass:
```bash
# Final verification
npm run build
npm start

# Monitor for first 24 hours
pm2 monit
```

**LOYIHA PRODUCTION'DA! 🚀💎**
