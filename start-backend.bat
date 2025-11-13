@echo off
echo Starting Gulmohar Resort Backend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0Backend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Start the backend server
echo Starting backend server on http://localhost:5001...
echo Press Ctrl+C to stop the server
echo.

npm start

REM If npm start fails or exits
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend server
    echo Check the error messages above
) else (
    echo.
    echo Backend server stopped
)

pause
