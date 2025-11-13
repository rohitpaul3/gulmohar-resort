@echo off
title Gulmohar Resort - Install Dependencies
echo =====================================================
echo     Gulmohar Resort - Installing Dependencies
echo =====================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo Installing Backend Dependencies...
echo ====================================
cd /d "%~dp0Backend"
npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
) else (
    echo ✓ Backend dependencies installed successfully
)

echo.
echo Installing Frontend Dependencies...
echo ===================================
cd /d "%~dp0Frontend"
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo ✓ Frontend dependencies installed successfully
)

echo.
echo =====================================================
echo   ✓ All dependencies installed successfully!
echo.
echo   You can now run the application using:
echo   - start-both.bat (recommended)
echo   - start-backend.bat (backend only)  
echo   - start-frontend.bat (frontend only)
echo =====================================================
echo.
pause
