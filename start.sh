#!/bin/bash

# BiznesYordam Platform Startup Script
# This script ensures the application starts properly with all dependencies

set -e

echo "🚀 Starting BiznesYordam Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm --version) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install
    
    print_status "Installing client dependencies..."
    cd client && npm install && cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_success ".env file created from template"
    fi
    
    # Create uploads directory
    mkdir -p uploads
    print_success "Uploads directory created"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set. Using SQLite fallback..."
        export DATABASE_URL="sqlite:./dev.db"
    fi
    
    # Push database schema
    print_status "Pushing database schema..."
    npm run db:push
    
    # Seed initial data
    print_status "Seeding initial data..."
    npm run seed
    
    print_success "Database setup completed"
}

# Build application
build_application() {
    print_status "Building application..."
    
    # Build client
    print_status "Building client..."
    npm run build:client
    
    # Build server
    print_status "Building server..."
    npm run build:server
    
    print_success "Application built successfully"
}

# Start application
start_application() {
    print_status "Starting application..."
    
    # Check if we should run in development or production mode
    if [ "$NODE_ENV" = "production" ]; then
        print_status "Starting in production mode..."
        npm start
    else
        print_status "Starting in development mode..."
        npm run dev
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for server to start
    sleep 5
    
    # Check if server is responding
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Application is running and healthy"
        print_success "Access the application at: http://localhost:5000"
        print_success "Admin Panel: http://localhost:5000/admin-panel"
        print_success "Partner Dashboard: http://localhost:5000/partner-dashboard"
    else
        print_warning "Health check failed. Application may still be starting..."
    fi
}

# Main execution
main() {
    echo "=========================================="
    echo "   BiznesYordam Platform Startup Script"
    echo "=========================================="
    echo ""
    
    # Run all setup steps
    check_node
    check_npm
    install_dependencies
    setup_environment
    setup_database
    build_application
    
    echo ""
    echo "=========================================="
    echo "   Starting Application..."
    echo "=========================================="
    echo ""
    
    # Start the application
    start_application &
    
    # Perform health check
    health_check
    
    echo ""
    echo "=========================================="
    echo "   Application Started Successfully!"
    echo "=========================================="
    echo ""
    echo "Default Credentials:"
    echo "  Admin: admin / BiznesYordam2024!"
    echo "  Partner: testpartner / Partner2024!"
    echo ""
    echo "Press Ctrl+C to stop the application"
    
    # Wait for the background process
    wait
}

# Handle script interruption
trap 'print_warning "Shutting down..."; exit 0' INT TERM

# Run main function
main "$@"