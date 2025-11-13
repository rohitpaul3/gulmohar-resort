@echo off
title Gulmohar Resort - Starting Both Servers
echo =====================================================
echo        Gulmohar Resort Billing System
echo =====================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting both Backend and Frontend servers...
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "Gulmohar Resort - Backend" cmd /k "cd /d \"%~dp0Backend\" && if not exist \"node_modules\" (echo Installing backend dependencies... && npm install) && echo Backend server starting on http://localhost:5001... && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window  
echo Starting Frontend Server...
start "Gulmohar Resort - Frontend" cmd /k "cd /d \"%~dp0Frontend\" && if not exist \"node_modules\" (echo Installing frontend dependencies... && npm install) && echo Frontend server starting on http://localhost:3001... && npm start"

echo.
echo =====================================================
echo  Both servers are starting in separate windows:
echo  - Backend:  http://localhost:5001
echo  - Frontend: http://localhost:3001
echo.
echo  The frontend will automatically open in your browser
echo  Close this window when you're done
echo =====================================================
echo.

REM Keep this window open for instructions
echo Press any key to close this launcher window...
pause >nul
