@echo off
echo Starting Gulmohar Resort Frontend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd /d "%~dp0Frontend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Start the frontend server
echo Starting frontend server on http://localhost:3001...
echo The application will open automatically in your browser
echo Press Ctrl+C to stop the server
echo.

npm start

REM If npm start fails or exits
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start frontend server
    echo Check the error messages above
) else (
    echo.
    echo Frontend server stopped
)

pause
