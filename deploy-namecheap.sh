#!/bin/bash

# SellerCloudX - Namecheap Deployment Script
# This script prepares the project for deployment to Namecheap hosting

echo "🚀 SellerCloudX - Namecheap Deployment Preparation"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "${YELLOW}📦 Step 1: Cleaning previous builds...${NC}"
rm -rf dist/
rm -rf deploy/
echo -e "${GREEN}✅ Cleaned${NC}"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
npm install --production=false
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Build the project
echo -e "${YELLOW}🔨 Step 3: Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Step 4: Verify build
echo -e "${YELLOW}🔍 Step 4: Verifying build...${NC}"
npm run build:verify
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build verification failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build verified${NC}"

# Step 5: Create deployment package
echo -e "${YELLOW}📦 Step 5: Creating deployment package...${NC}"
mkdir -p deploy

# Copy necessary files
cp -r dist deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp .env.production deploy/.env
cp .htaccess deploy/

# Create necessary directories
mkdir -p deploy/uploads
mkdir -p deploy/logs
touch deploy/production.db

# Install production dependencies
cd deploy
npm install --production
cd ..

echo -e "${GREEN}✅ Deployment package created${NC}"

# Step 6: Create zip file
echo -e "${YELLOW}📦 Step 6: Creating zip file...${NC}"
cd deploy
zip -r ../sellercloudx-deploy.zip .
cd ..
echo -e "${GREEN}✅ Zip file created: sellercloudx-deploy.zip${NC}"

# Step 7: Display instructions
echo ""
echo -e "${GREEN}=================================================="
echo "✅ Deployment package ready!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo "1. Upload sellercloudx-deploy.zip to Namecheap cPanel"
echo "2. Extract in public_html/sellercloudx/"
echo "3. Set up Node.js application in cPanel"
echo "4. Configure environment variables"
echo "5. Start the application"
echo ""
echo "📖 Full instructions: NAMECHEAP_DEPLOYMENT.md"
echo -e "==================================================${NC}"
