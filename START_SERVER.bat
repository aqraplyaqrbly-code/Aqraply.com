@echo off
cd /d "d:\Aqraply 3\New folder\Aqraply 6 2nd"

echo ========================================
echo  Aqraply Application - Development Server
echo ========================================
echo.
echo Installing dependencies...
call npm install

echo.
echo Starting development server...
echo Vite frontend and Convex backend will start in parallel
echo.
call npm run dev

pause
