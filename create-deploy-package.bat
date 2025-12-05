@echo off
echo ========================================
echo SellerCloudX - Deployment Package
echo ========================================
echo.

REM Check if dist exists
if not exist "dist" (
    echo ERROR: Build not found! Run 'npm run build' first.
    pause
    exit /b 1
)

REM Clean previous
echo Cleaning previous deployment...
if exist "deploy" rmdir /s /q "deploy"
if exist "sellercloudx-deploy.zip" del /f "sellercloudx-deploy.zip"
echo Done.
echo.

REM Create deploy folder
echo Creating deployment package...
mkdir "deploy"

REM Copy files
echo Copying files...
xcopy /E /I /Y "dist" "deploy\dist"
copy /Y "package.json" "deploy\"
copy /Y "package-lock.json" "deploy\"
copy /Y ".env.production" "deploy\.env"
copy /Y ".htaccess" "deploy\"
xcopy /E /I /Y "migrations" "deploy\migrations"

REM Create directories
mkdir "deploy\uploads"
mkdir "deploy\logs"
type nul > "deploy\production.db"

echo Done.
echo.

echo ========================================
echo Package created in 'deploy' folder
echo ========================================
echo.
echo Next steps:
echo 1. Compress 'deploy' folder to ZIP
echo 2. Upload to Namecheap cPanel
echo 3. Follow NAMECHEAP_DEPLOYMENT.md
echo.
pause
