#!/bin/bash

# BiznesYordam.uz Hosting Deployment Script
# Bu script loyihani cPanel hostingga joylash uchun tayyorlaydi

echo "🚀 BiznesYordam.uz Hosting Deployment Script"
echo "=============================================="

# 1. Production build
echo "📦 Building production version..."
npm run build

# 2. Production package.json ni asosiy package.json ga nusxalash
echo "📋 Updating package.json for production..."
cp package.json.production package.json

# 3. Production .env faylini nusxalash
echo "⚙️ Setting up production environment..."
cp .env.production .env

# 4. Kerakli papkalarni yaratish
echo "📁 Creating necessary directories..."
mkdir -p data
mkdir -p uploads
mkdir -p logs

# 5. Database setup
echo "🗄️ Setting up database..."
npm run db:push
npm run seed

# 6. Permissions o'rnatish
echo "🔐 Setting permissions..."
chmod 755 dist/
chmod 755 data/
chmod 755 uploads/
chmod 644 .htaccess

# 7. Node.js server uchun start script
echo "📝 Creating start script..."
cat > start.sh << 'EOF'
#!/bin/bash
cd /home/yourusername/public_html
NODE_ENV=production node dist/index.js
EOF

chmod +x start.sh

# 8. PM2 uchun ecosystem file (agar PM2 ishlatilsa)
echo "⚡ Creating PM2 ecosystem file..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'biznesyordam',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

echo "✅ Deployment preparation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files to your cPanel public_html directory"
echo "2. Make sure Node.js is enabled in your hosting"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Configure domain to point to your hosting"
echo "5. Start the application using: node dist/index.js"
echo ""
echo "🌐 Your site will be available at: https://biznesyordam.uz"