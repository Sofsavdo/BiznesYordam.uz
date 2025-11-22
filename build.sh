#!/bin/bash
set -e

echo "🔨 Starting build process..."

# Check Node version
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --no-audit --no-fund

# Build client
echo "🏗️  Building client..."
npm run build:client

# Check if client build succeeded
if [ ! -d "dist/public" ]; then
  echo "❌ Client build failed - dist/public not found"
  exit 1
fi

echo "✅ Client build successful"
ls -la dist/public

# Build server
echo "🏗️  Building server..."
npm run build:server

# Check if server build succeeded
if [ ! -f "dist/index.js" ]; then
  echo "❌ Server build failed - dist/index.js not found"
  exit 1
fi

echo "✅ Server build successful"
ls -la dist/

echo "✅ Build completed successfully!"
