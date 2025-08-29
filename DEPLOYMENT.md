# BiznesYordam Fulfillment Platform - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- PM2 (for process management)
- Nginx (for reverse proxy)

### 1. Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/biznesyordam_db

# Session
SESSION_SECRET=your-super-secret-session-key-here

# Environment
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_ORIGIN=https://yourdomain.com

# API URL
VITE_API_URL=https://yourdomain.com

# Production settings
PORT=5000
HOST=0.0.0.0

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File upload settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# WebSocket settings
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Push migrations to database
npm run db:push

# Seed initial data
npm run seed
```

### 3. Build Application

```bash
# Build client and server
npm run build:full

# Or build separately
npm run build:client
npm run build:server
```

### 4. PM2 Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'biznesyordam',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
EOF

# Create logs directory
mkdir logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 5. Nginx Configuration

```nginx
# /etc/nginx/sites-available/biznesyordam
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Client files
    location / {
        root /path/to/your/app/dist/client;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes
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

    # WebSocket support
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

    # File uploads
    location /uploads {
        alias /path/to/your/app/uploads;
        expires 1d;
        add_header Cache-Control "public";
    }
}
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Monitoring & Logs

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs biznesyordam

# Application status
pm2 status

# Restart application
pm2 restart biznesyordam

# Update application
pm2 reload biznesyordam
```

### 8. Backup Strategy

```bash
# Database backup script
cat > backup.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="biznesyordam_db"

# Create backup directory
mkdir -p \$BACKUP_DIR

# Database backup
pg_dump \$DATABASE_URL > \$BACKUP_DIR/db_backup_\$DATE.sql

# Application files backup
tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz dist/ uploads/

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: \$DATE"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 9. Performance Optimization

```bash
# Enable gzip compression in Nginx
# Add to nginx.conf:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Database optimization
# Add indexes for frequently queried columns
CREATE INDEX idx_partners_approved ON partners(is_approved);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_messages_users ON messages(from_user_id, to_user_id);
```

### 10. Security Checklist

- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Database password strong
- [ ] Firewall configured
- [ ] Regular backups scheduled
- [ ] Monitoring enabled
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Session secret changed
- [ ] File upload limits set

### 11. Troubleshooting

**Common Issues:**

1. **Database Connection Error**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Test connection
   psql $DATABASE_URL
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   pm2 monit
   
   # Restart with more memory
   pm2 restart biznesyordam --max-memory-restart 2G
   ```

4. **WebSocket Connection Issues**
   ```bash
   # Check WebSocket logs
   pm2 logs biznesyordam | grep WebSocket
   
   # Verify nginx WebSocket config
   nginx -t
   ```

### 12. Update Process

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run database migrations
npm run db:generate
npm run db:push

# Build application
npm run build:full

# Reload application
pm2 reload biznesyordam

# Check status
pm2 status
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] Application built successfully
- [ ] PM2 process running
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Error handling configured
- [ ] Logs being collected
- [ ] Rate limiting active
- [ ] CORS properly configured

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs biznesyordam`
2. Verify environment variables
3. Test database connection
4. Check nginx configuration
5. Monitor system resources

**Emergency Commands:**
```bash
# Restart everything
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql

# View real-time logs
pm2 logs biznesyordam --lines 100

# Check system resources
htop
df -h
free -h
```
