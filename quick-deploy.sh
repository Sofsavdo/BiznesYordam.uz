#!/bin/bash

# Tezkor Deployment Script - BiznesYordam.uz
# Bu script loyihani hostingga joylash uchun minimal qadamlar

echo "🚀 BiznesYordam.uz - Tezkor Deployment"
echo "====================================="

# 1. Production build
echo "📦 Building for production..."
npm run build

# 2. Production files
echo "📋 Preparing production files..."
cp package.json.production package.json
cp .env.production .env

# 3. Create directories
mkdir -p data uploads logs

# 4. Database setup
echo "🗄️ Setting up database..."
npm run db:push
npm run seed

echo "✅ Ready for upload!"
echo ""
echo "📁 Upload these files to your cPanel public_html:"
echo "   - dist/ (entire folder)"
echo "   - package.json"
echo "   - .env"
echo "   - .htaccess"
echo "   - data/ (entire folder)"
echo ""
echo "🔧 Then run on server:"
echo "   npm install --production"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "🌐 Your site: https://biznesyordam.uz"