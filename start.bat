@echo off
echo.
echo  =============================================
echo   QueueLess AI - Starting Development Servers
echo  =============================================
echo.

:: Store the project root (the folder containing this bat file)
set PROJECT_ROOT=%~dp0

:: Start frontend
echo [1/2] Starting Frontend (Vite + React) on http://localhost:5173 ...
start "QueueLess Frontend" cmd /k "cd /d %PROJECT_ROOT% && npm run dev"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start backend
echo [2/2] Starting Backend (FastAPI) on http://localhost:8000 ...
start "QueueLess Backend" cmd /k "cd /d %PROJECT_ROOT%backend && venv\Scripts\python main.py"

echo.
echo  Both servers are starting in separate windows...
echo.
echo  ==============================================
echo   Open your browser and go to:
echo   http://localhost:5173
echo  ==============================================
echo.
echo  Demo Login:
echo    Customer : demo@queueless.ai  /  demo123
echo    Admin    : admin@queueless.ai /  admin123
echo.
echo  API Docs: http://localhost:8000/docs
echo.
pause
