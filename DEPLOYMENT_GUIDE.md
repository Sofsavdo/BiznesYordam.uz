# 🚀 DEPLOYMENT GUIDE - BiznesYordam.uz

## 🎉 LATEST UPDATES (Fixed Build Issues)

### ✅ Build Errors Fixed (Apostrophes in Uzbek Text)

**Issue**: Build was failing with `Expected "}" but found...` errors due to unescaped apostrophes in Uzbek strings.

**Fixed Files**:
- `/app/client/src/pages/RemoteAccessDashboard.tsx`
- `/app/client/src/pages/OnboardingWizard.tsx`
- `/app/client/src/pages/PartnerActivation.tsx`
- `/app/client/src/pages/PartnerRegistration.tsx`
- `/app/client/src/components/FulfillmentRequestForm.tsx`
- `/app/client/src/components/EnhancedTierUpgradeModal.tsx`
- `/app/client/src/components/AIRecommendations.tsx`
- `/app/client/src/context/FullTranslations.tsx`

**Solution**: Replaced single quotes with double quotes in all strings containing apostrophes (So'rov, Ko'rish, O'rtacha, etc.)

**Status**: ✅ Ready to push and deploy!

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Code Quality
- [x] All TypeScript errors resolved
- [x] Build successful (`npm run build`)
- [x] No console errors in production build
- [x] Code splitting optimized
- [x] Assets minified and compressed

### ✅ Environment Configuration
- [ ] Production `.env` file created
- [ ] All API keys configured
- [ ] Database connection string set
- [ ] Redis URL configured
- [ ] Session secret generated
- [ ] Encryption key generated

### ✅ Database
- [ ] Production database created
- [ ] Migrations run (`npm run db:push`)
- [ ] Seed data loaded (if needed)
- [ ] Backup strategy configured
- [ ] Connection pool optimized

### ✅ Security
- [ ] HTTPS/SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] API keys rotated
- [ ] Sensitive data encrypted

---

## 🌐 DEPLOYMENT OPTIONS

### Option 1: VPS Deployment (Recommended)

**Providers:** DigitalOcean, Linode, Vultr, AWS EC2

#### Step 1: Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server

# Install Nginx
apt install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2
```

#### Step 2: Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE biznessyordam;
CREATE USER biznesuser WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE biznessyordam TO biznesuser;
\q
```

#### Step 3: Redis Configuration
```bash
# Edit Redis config
nano /etc/redis/redis.conf

# Set password
requirepass your-redis-password

# Restart Redis
systemctl restart redis
```

#### Step 4: Application Deployment
```bash
# Create app directory
mkdir -p /var/www/biznessyordam
cd /var/www/biznessyordam

# Clone repository (or upload files)
git clone https://github.com/yourusername/biznessyordam.git .

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Production .env:**
```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://biznesuser:your-secure-password@localhost:5432/biznessyordam

# Redis
REDIS_URL=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Session
SESSION_SECRET=generate-random-64-char-string

# Encryption
ENCRYPTION_MASTER_KEY=generate-random-32-byte-key

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Marketplace APIs
UZUM_API_KEY=your-key
WILDBERRIES_API_KEY=your-key
YANDEX_API_KEY=your-key
OZON_API_KEY=your-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Sentry (Error Tracking)
SENTRY_DSN=https://...

# Domain
FRONTEND_URL=https://biznessyordam.uz
BACKEND_URL=https://api.biznessyordam.uz
```

#### Step 5: Build and Run
```bash
# Build the application
npm run build

# Run database migrations
npm run db:push

# Start with PM2
pm2 start npm --name "biznessyordam" -- start
pm2 save
pm2 startup
```

#### Step 6: Nginx Configuration
```bash
# Create Nginx config
nano /etc/nginx/sites-available/biznessyordam
```

```nginx
server {
    listen 80;
    server_name biznessyordam.uz www.biznessyordam.uz;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name biznessyordam.uz www.biznessyordam.uz;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/biznessyordam.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/biznessyordam.uz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Static files
    location / {
        root /var/www/biznessyordam/dist/public;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }

    # File upload limit
    client_max_body_size 50M;
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/biznessyordam /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### Step 7: SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d biznessyordam.uz -d www.biznessyordam.uz

# Auto-renewal
certbot renew --dry-run
```

---

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/biznessyordam
      - REDIS_URL=redis
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=biznessyordam
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass your-redis-password
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

```bash
# Deploy with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Platform as a Service (PaaS)

#### Vercel (Frontend Only)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway.app (Full Stack)
1. Connect GitHub repository
2. Add PostgreSQL and Redis services
3. Set environment variables
4. Deploy automatically

#### Render.com (Full Stack)
1. Create new Web Service
2. Connect repository
3. Add PostgreSQL and Redis
4. Configure build command: `npm run build`
5. Configure start command: `npm start`
6. Deploy

---

## 📊 POST-DEPLOYMENT

### Monitoring Setup

#### PM2 Monitoring
```bash
# View logs
pm2 logs biznessyordam

# Monitor resources
pm2 monit

# View status
pm2 status
```

#### Sentry Error Tracking
Already configured in code. Check dashboard at sentry.io

#### Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- StatusCake

### Performance Optimization

#### Enable Caching
```bash
# Redis caching already implemented
# Configure CDN for static assets (Cloudflare)
```

#### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_products_partner ON products(partner_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_orders_created ON orders(created_at);
```

### Backup Strategy

#### Database Backup
```bash
# Daily backup cron job
0 2 * * * pg_dump -U biznesuser biznessyordam > /backups/db_$(date +\%Y\%m\%d).sql

# Backup to cloud storage
# Use AWS S3, Google Cloud Storage, or Backblaze B2
```

#### Application Backup
```bash
# Backup application files
tar -czf /backups/app_$(date +%Y%m%d).tar.gz /var/www/biznessyordam
```

---

## 🔧 MAINTENANCE

### Regular Tasks

#### Weekly
- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Check disk space
- [ ] Review security alerts

#### Monthly
- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Database optimization
- [ ] Backup verification

#### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Cost optimization
- [ ] Feature planning

### Scaling Strategy

#### Horizontal Scaling
```bash
# Add more PM2 instances
pm2 scale biznessyordam +2

# Load balancer (Nginx)
upstream backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}
```

#### Database Scaling
- Read replicas for analytics
- Connection pooling (PgBouncer)
- Partitioning large tables

---

## 🆘 TROUBLESHOOTING

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs biznessyordam --lines 100

# Check environment
pm2 env 0

# Restart
pm2 restart biznessyordam
```

#### Database Connection Error
```bash
# Check PostgreSQL status
systemctl status postgresql

# Test connection
psql -U biznesuser -d biznessyordam -h localhost
```

#### High Memory Usage
```bash
# Check process
pm2 monit

# Restart with memory limit
pm2 restart biznessyordam --max-memory-restart 1G
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Server provisioned and configured
- [ ] Database created and migrated
- [ ] Redis installed and configured
- [ ] Environment variables set
- [ ] Application built successfully
- [ ] PM2 process running
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] Monitoring setup complete
- [ ] Backup strategy implemented
- [ ] Security hardening complete
- [ ] Performance optimized
- [ ] Documentation updated

---

## 🎉 GO LIVE!

Once all checks pass:
1. Point domain DNS to server IP
2. Wait for DNS propagation (up to 48 hours)
3. Test all functionality
4. Monitor for 24 hours
5. Announce launch! 🚀

**Your million-dollar startup is now LIVE!** 💰
