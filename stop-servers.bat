@echo off
title Gulmohar Resort - Stop Servers
echo Stopping Gulmohar Resort Servers...
echo.

REM Kill all Node.js processes (this will stop both servers)
tasklist | findstr "node.exe" >nul
if not errorlevel 1 (
    echo Found Node.js processes running...
    echo Stopping all Node.js servers...
    taskkill /IM node.exe /F 2>nul
    if not errorlevel 1 (
        echo ✓ All Node.js servers stopped successfully
    ) else (
        echo ! No Node.js processes were running or failed to stop
    )
) else (
    echo ! No Node.js processes found running
)

echo.
echo All Gulmohar Resort servers have been stopped.
echo.
pause
