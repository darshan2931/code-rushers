@echo off
REM Autonomous Workflow Builder - Start Script
REM This script starts both the backend and frontend servers

echo.
echo ============================================
echo  Autonomous Workflow Builder Startup
echo ============================================
echo.

REM Kill any existing node processes
taskkill /F /IM node.exe /T 2>nul
timeout /t 1 /nobreak>nul

REM Change to project directory
cd /d "c:\code rushers\autonomous-workflow-builder"

REM Start backend server
echo.
echo [1/2] Starting Backend Server on port 5000...
echo.
start "Workflow Builder - Backend" cmd /k "cd backend && node server.js"

REM Wait for backend to initialize
timeout /t 3 /nobreak>nul

REM Start frontend server
echo [2/2] Starting Frontend Server on port 3000...
echo.
start "Workflow Builder - Frontend" cmd /k "npm run dev"

REM Wait for frontend to initialize
timeout /t 5 /nobreak>nul

REM Display completion message
cls
echo.
echo ============================================
echo  ✓ Servers Started Successfully!
echo ============================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000/builder
echo.
echo Opening application in browser...
echo.
timeout /t 2 /nobreak>nul

REM Open in default browser
start http://localhost:3000/builder

echo.
echo Keep these windows open while using the application.
echo.
pause
