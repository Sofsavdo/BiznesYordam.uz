# SellerCloudX - Namecheap Deployment Script (PowerShell)
# This script prepares the project for deployment to Namecheap hosting

Write-Host "🚀 SellerCloudX - Namecheap Deployment Preparation" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "📦 Step 1: Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "deploy") { Remove-Item -Recurse -Force "deploy" }
if (Test-Path "sellercloudx-deploy.zip") { Remove-Item -Force "sellercloudx-deploy.zip" }
Write-Host "✅ Cleaned" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies
Write-Host "📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependencies installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Build the project
Write-Host "🔨 Step 3: Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Verify build
Write-Host "🔍 Step 4: Verifying build..." -ForegroundColor Yellow
npm run build:verify
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build verification failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build verified" -ForegroundColor Green
Write-Host ""

# Step 5: Create deployment package
Write-Host "📦 Step 5: Creating deployment package..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "deploy" | Out-Null

# Copy necessary files
Copy-Item -Recurse -Force "dist" "deploy\"
Copy-Item -Force "package.json" "deploy\"
Copy-Item -Force "package-lock.json" "deploy\"
Copy-Item -Force ".env.production" "deploy\.env"
Copy-Item -Force ".htaccess" "deploy\"

# Create necessary directories
New-Item -ItemType Directory -Force -Path "deploy\uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "deploy\logs" | Out-Null
New-Item -ItemType File -Force -Path "deploy\production.db" | Out-Null

Write-Host "✅ Files copied" -ForegroundColor Green

# Install production dependencies
Write-Host "📦 Installing production dependencies..." -ForegroundColor Yellow
Push-Location "deploy"
npm install --production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production dependencies installation failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✅ Production dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 6: Create zip file
Write-Host "📦 Step 6: Creating zip file..." -ForegroundColor Yellow
Compress-Archive -Path "deploy\*" -DestinationPath "sellercloudx-deploy.zip" -Force
Write-Host "✅ Zip file created: sellercloudx-deploy.zip" -ForegroundColor Green
Write-Host ""

# Step 7: Display file size
$zipSize = (Get-Item "sellercloudx-deploy.zip").Length / 1MB
Write-Host "📊 Zip file size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# Step 8: Display instructions
Write-Host "==================================================" -ForegroundColor Green
Write-Host "✅ Deployment package ready!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload sellercloudx-deploy.zip to Namecheap cPanel" -ForegroundColor White
Write-Host "2. Extract in public_html/sellercloudx/" -ForegroundColor White
Write-Host "3. Set up Node.js application in cPanel" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host "5. Start the application" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full instructions: NAMECHEAP_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

# Optional: Open deployment guide
$openGuide = Read-Host "Open deployment guide? (Y/N)"
if ($openGuide -eq "Y" -or $openGuide -eq "y") {
    Start-Process "NAMECHEAP_DEPLOYMENT.md"
}
