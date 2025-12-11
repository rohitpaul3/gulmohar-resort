@echo off
REM Production Testing Script for Gulmohar Resort

echo.
echo ========================================
echo Gulmohar Resort - Production Testing
echo ========================================
echo.

REM Get URLs from user
set /p BACKEND_URL="Enter your Render backend URL (e.g., https://gulmohar-backend.onrender.com): "
set /p FRONTEND_URL="Enter your Vercel frontend URL (e.g., https://gulmohar.vercel.app): "

echo.
echo Testing Backend...
echo.

REM Test health check
echo [1/5] Testing Health Check...
curl -s %BACKEND_URL%/api/health
echo.
echo.

REM Test get all bills
echo [2/5] Testing Get All Bills...
curl -s %BACKEND_URL%/api/bills | findstr /C:"billNumber" >nul
if errorlevel 1 (
    echo ERROR: Could not fetch bills
) else (
    echo SUCCESS: Bills endpoint working
)
echo.

REM Test create bill
echo [3/5] Testing Create Bill...
curl -s -X POST %BACKEND_URL%/api/bills ^
  -H "Content-Type: application/json" ^
  -d "{\"customerName\":\"Test\",\"roomNumber\":\"C1\",\"mobileNo\":\"9876543210\",\"roomCharges\":1000,\"foodCharges\":500,\"otherCharges\":0}" ^
  | findstr /C:"billNumber" >nul
if errorlevel 1 (
    echo ERROR: Could not create bill
) else (
    echo SUCCESS: Create bill endpoint working
)
echo.

REM Test frontend
echo [4/5] Testing Frontend...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %FRONTEND_URL%
echo.

REM Summary
echo [5/5] Test Summary
echo.
echo ========================================
echo Production Testing Complete
echo ========================================
echo.
echo Backend URL: %BACKEND_URL%
echo Frontend URL: %FRONTEND_URL%
echo.
echo Next Steps:
echo 1. Verify all tests passed
echo 2. Check browser console for errors
echo 3. Test create bill feature
echo 4. Test delete bill feature
echo 5. Test multiple customers/rooms
echo.
pause
