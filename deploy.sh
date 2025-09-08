#!/bin/bash

# BiznesYordam Deployment Script
echo "🚀 Starting BiznesYordam deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version check passed: $(node -v)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before running the application."
    else
        print_error ".env.example file not found. Please create .env file manually."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Rebuild better-sqlite3 to ensure native bindings are available
print_status "Rebuilding better-sqlite3..."
npm rebuild better-sqlite3

# Install client dependencies
print_status "Installing client dependencies..."
cd client && npm install && cd ..

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=postgresql://username:password" .env; then
    print_warning "Please configure your DATABASE_URL in .env file"
    print_warning "Current DATABASE_URL appears to be a placeholder"
fi

# Build the application
print_status "Building application..."
npm run build

# Run database migrations if needed
if [ "$1" = "--with-db" ]; then
    print_status "Setting up database..."
    npm run db:push
    
    print_status "Seeding database..."
    npm run seed
fi

print_status "Deployment completed successfully!"
print_status "You can now start the application with: npm start"

echo ""
echo "🔑 Default login credentials:"
echo "Admin: admin / BiznesYordam2024!"
echo "Partner: testpartner / Partner2024!"
echo ""
echo "📖 For more information, see README.md"