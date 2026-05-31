@echo off
setlocal

if /i "%~1"=="--dry-run" (
  set "REDAESTH_DRY_RUN=1"
)

set "ROOT=%~dp0"
set "CLIENT_DIR=%ROOT%client"
set "SERVER_DIR=%ROOT%server"
set "FRONTEND_URL=http://localhost:3000"

if not exist "%CLIENT_DIR%\package.json" (
  echo Client workspace not found at "%CLIENT_DIR%".
  pause
  exit /b 1
)

if not exist "%SERVER_DIR%\package.json" (
  echo Server workspace not found at "%SERVER_DIR%".
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not available in PATH. Install Node.js first.
  pause
  exit /b 1
)

if /i "%REDAESTH_DRY_RUN%"=="1" (
  echo [dry-run] npm install --prefix "%CLIENT_DIR%"
  echo [dry-run] npm install --prefix "%SERVER_DIR%"
  echo [dry-run] start "REDAESTH API" cmd /k "cd /d ""%SERVER_DIR%"" ^&^& npm run dev"
  echo [dry-run] start "REDAESTH Frontend" cmd /k "cd /d ""%CLIENT_DIR%"" ^&^& npm start"
  echo [dry-run] start "REDAESTH Browser" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 8; Start-Process '%FRONTEND_URL%'"
  exit /b 0
)

if not exist "%CLIENT_DIR%\node_modules" (
  echo Installing frontend dependencies...
  call npm install --prefix "%CLIENT_DIR%"
  if errorlevel 1 (
    echo Frontend install failed.
    pause
    exit /b 1
  )
)

if not exist "%SERVER_DIR%\node_modules" (
  echo Installing backend dependencies...
  call npm install --prefix "%SERVER_DIR%"
  if errorlevel 1 (
    echo Backend install failed.
    pause
    exit /b 1
  )
)

echo Launching REDAESTH API...
start "REDAESTH API" cmd /k "cd /d ""%SERVER_DIR%"" && npm run dev"

echo Launching REDAESTH frontend...
start "REDAESTH Frontend" cmd /k "cd /d ""%CLIENT_DIR%"" && npm start"

echo Opening browser...
start "REDAESTH Browser" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 8; Start-Process '%FRONTEND_URL%'"

echo REDAESTH is starting up in separate windows.
exit /b 0
