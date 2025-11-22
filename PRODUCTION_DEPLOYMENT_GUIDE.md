# 🚀 BiznesYordam - Production Deployment Guide

## 📋 Mundarija

1. [Tizim Talablari](#tizim-talablari)
2. [Environment Sozlamalari](#environment-sozlamalari)
3. [Database Setup](#database-setup)
4. [Build va Deploy](#build-va-deploy)
5. [Monitoring va Logging](#monitoring-va-logging)
6. [Security Checklist](#security-checklist)
7. [Troubleshooting](#troubleshooting)

---

## 🖥️ Tizim Talablari

### Minimal Talablar
- **Node.js**: 18.x yoki yuqori
- **npm**: 9.x yoki yuqori
- **PostgreSQL**: 14.x yoki yuqori
- **RAM**: 2GB minimum (4GB tavsiya etiladi)
- **Disk**: 10GB bo'sh joy

### Tavsiya Etiladigan
- **Node.js**: 20.x LTS
- **PostgreSQL**: 15.x
- **RAM**: 8GB
- **Disk**: 50GB SSD
- **CPU**: 2+ cores

---

## ⚙️ Environment Sozlamalari

### 1. Environment Variables

`.env` faylini yarating va quyidagi o'zgaruvchilarni sozlang:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require

# Session Security (32+ characters)
SESSION_SECRET=your-ultra-secure-session-key-min-32-chars-long-change-this

# Environment
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_ORIGIN=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# API Configuration
VITE_API_URL=https://yourdomain.com

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database Auto Setup
DATABASE_AUTO_SETUP=true

# Security Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# WebSocket Settings
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_EMAIL=admin@yourdomain.com

# Logging
LOG_LEVEL=info
```

### 2. SESSION_SECRET Generatsiya

```bash
# Node.js bilan
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL bilan
openssl rand -hex 32
```

---

## 🗄️ Database Setup

### 1. PostgreSQL O'rnatish

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 2. Database Yaratish

```bash
# PostgreSQL ga kirish
sudo -u postgres psql

# Database yaratish
CREATE DATABASE biznesyordam;

# User yaratish
CREATE USER biznesyordam_user WITH PASSWORD 'your_secure_password';

# Ruxsatlar berish
GRANT ALL PRIVILEGES ON DATABASE biznesyordam TO biznesyordam_user;

# Chiqish
\q
```

### 3. Database URL

```
postgresql://biznesyordam_user:your_secure_password@localhost:5432/biznesyordam?sslmode=require
```

### 4. Schema Push

```bash
npm run db:push
```

### 5. Seed Data (Development)

```bash
npm run seed
```

---

## 🏗️ Build va Deploy

### 1. Dependencies O'rnatish

```bash
npm install
```

### 2. Build

```bash
npm run build
```

Bu quyidagi fayllarni yaratadi:
- `dist/public/` - Frontend build
- `dist/index.js` - Backend build

### 3. Production Start

```bash
npm start
```

### 4. PM2 bilan Deploy (Tavsiya etiladi)

#### PM2 O'rnatish
```bash
npm install -g pm2
```

#### Ishga Tushirish
```bash
pm2 start dist/index.js --name biznesyordam
pm2 save
pm2 startup
```

#### PM2 Commands
```bash
# Status ko'rish
pm2 status

# Loglarni ko'rish
pm2 logs biznesyordam

# Restart
pm2 restart biznesyordam

# Stop
pm2 stop biznesyordam

# Delete
pm2 delete biznesyordam
```

### 5. Nginx Reverse Proxy

#### Nginx O'rnatish
```bash
sudo apt install nginx
```

#### Nginx Konfiguratsiya

`/etc/nginx/sites-available/biznesyordam`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Proxy to Node.js
    location / {
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

    # WebSocket Support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Files Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Nginx Faollashtirish

```bash
sudo ln -s /etc/nginx/sites-available/biznesyordam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Certbot o'rnatish
sudo apt install certbot python3-certbot-nginx

# Certificate olish
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 📊 Monitoring va Logging

### 1. Loglar

Loglar `logs/` papkasida saqlanadi:
- `logs/error.log` - Xatolar
- `logs/combined.log` - Barcha loglar

### 2. PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web dashboard
pm2 web
```

### 3. Health Check Endpoints

```bash
# Health check
curl https://yourdomain.com/api/health

# Readiness check
curl https://yourdomain.com/api/ready

# Liveness check
curl https://yourdomain.com/api/alive
```

### 4. Log Rotation

PM2 log rotation:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## 🔒 Security Checklist

### Pre-Deployment

- [ ] `SESSION_SECRET` o'zgartirilgan (32+ characters)
- [ ] `ADMIN_PASSWORD` kuchli parol bilan o'zgartirilgan
- [ ] `DATABASE_URL` xavfsiz parol bilan
- [ ] `.env` fayli `.gitignore` da
- [ ] CORS origins to'g'ri sozlangan
- [ ] Rate limiting yoqilgan
- [ ] HTTPS sozlangan (SSL certificate)
- [ ] Firewall sozlangan
- [ ] Database backup strategiyasi
- [ ] Monitoring sozlangan

### Post-Deployment

- [ ] Health check ishlayapti
- [ ] Loglar yozilayapti
- [ ] WebSocket ulanishi ishlayapti
- [ ] Email notifications ishlayapti (agar sozlangan bo'lsa)
- [ ] Admin panel kirish mumkin
- [ ] Partner dashboard kirish mumkin
- [ ] Database backup ishlayapti
- [ ] SSL certificate auto-renewal sozlangan

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# PostgreSQL ishlab turganini tekshirish
sudo systemctl status postgresql

# PostgreSQL loglarini ko'rish
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Connection test
psql -h localhost -U biznesyordam_user -d biznesyordam
```

### Port Already in Use

```bash
# Port ishlatilayotganini topish
sudo lsof -i :5000

# Process o'chirish
sudo kill -9 <PID>
```

### Build Errors

```bash
# node_modules tozalash
rm -rf node_modules package-lock.json
npm install

# Cache tozalash
npm cache clean --force

# Rebuild
npm run build
```

### PM2 Issues

```bash
# PM2 restart
pm2 restart all

# PM2 logs
pm2 logs --lines 100

# PM2 flush logs
pm2 flush

# PM2 reset
pm2 delete all
pm2 start dist/index.js --name biznesyordam
```

### Nginx Issues

```bash
# Nginx test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Memory Issues

```bash
# Memory usage ko'rish
free -h

# Process memory usage
ps aux --sort=-%mem | head

# PM2 memory limit
pm2 start dist/index.js --name biznesyordam --max-memory-restart 1G
```

---

## 📈 Performance Optimization

### 1. Database Indexlar

```sql
-- Tez-tez ishlatiladigan query'lar uchun indexlar
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_products_partner_id ON products(partner_id);
CREATE INDEX idx_analytics_partner_id ON analytics(partner_id);
CREATE INDEX idx_messages_users ON messages(from_user_id, to_user_id);
```

### 2. Node.js Optimization

```bash
# Production mode
NODE_ENV=production

# Increase memory limit
node --max-old-space-size=4096 dist/index.js
```

### 3. Nginx Caching

```nginx
# Nginx cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
}
```

---

## 🔄 Backup Strategy

### 1. Database Backup

```bash
# Manual backup
pg_dump -U biznesyordam_user biznesyordam > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup (cron)
0 2 * * * pg_dump -U biznesyordam_user biznesyordam > /backups/biznesyordam_$(date +\%Y\%m\%d).sql
```

### 2. File Backup

```bash
# Backup uploads folder
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Backup logs
tar -czf logs_backup_$(date +%Y%m%d).tar.gz logs/
```

### 3. Restore

```bash
# Database restore
psql -U biznesyordam_user biznesyordam < backup_20250106.sql

# Files restore
tar -xzf uploads_backup_20250106.tar.gz
```

---

## 📞 Support

Muammo yuzaga kelsa:

1. **Loglarni tekshiring**: `pm2 logs biznesyordam`
2. **Health check**: `curl https://yourdomain.com/api/health`
3. **GitHub Issues**: [Repository Issues](https://github.com/Medik3636/Biznesyordam/issues)
4. **Email**: support@biznesyordam.uz

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code review
- [ ] Tests passed
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Build successful
- [ ] Security audit

### Deployment
- [ ] Backup current version
- [ ] Deploy new version
- [ ] Run migrations
- [ ] Restart services
- [ ] Verify health checks

### Post-Deployment
- [ ] Monitor logs
- [ ] Check error rates
- [ ] Verify functionality
- [ ] Monitor performance
- [ ] Update documentation

---

**Muvaffaqiyatli deployment!** 🎉
