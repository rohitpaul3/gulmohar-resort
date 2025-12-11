@echo off
REM Gulmohar Resort - Production Build Script

echo.
echo ========================================
echo Gulmohar Resort - Production Build
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing Frontend Dependencies...
cd Frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

echo.
echo [2/4] Building Frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo [3/4] Installing Backend Dependencies...
cd Backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo [4/4] Build Complete!
echo.
echo ========================================
echo Production Build Summary
echo ========================================
echo.
echo Frontend:
echo   - Build directory: Frontend\build
echo   - Ready for deployment to Vercel, Netlify, or Render
echo.
echo Backend:
echo   - Dependencies installed
echo   - Ready for deployment
echo   - Ensure MongoDB is configured
echo.
echo Next Steps:
echo 1. Update .env files with production URLs
echo 2. Deploy Frontend to Vercel/Netlify/Render
echo 3. Deploy Backend to Render/Railway/Heroku
echo 4. Update REACT_APP_API_URL with deployed backend URL
echo 5. Redeploy frontend with updated API URL
echo.
echo ========================================
echo.
pause
