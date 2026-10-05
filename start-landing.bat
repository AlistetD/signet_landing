@echo off
setlocal
cd /d "%~dp0"
title SigNet landing

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed. Install it, then run this file again.
  pause
  exit /b 1
)

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm not found. Enabling via Corepack...
  call corepack enable
  call corepack prepare pnpm@12.5.1 --activate
  if errorlevel 1 (
    echo Could not enable pnpm. Install it, then run this file again.
    pause
    exit /b 1
  )
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call pnpm install
  if errorlevel 1 (
    echo pnpm install failed.
    pause
    exit /b 1
  )
)

echo Starting http://127.0.0.1:5173/
echo Keep this window open. Close it to stop the landing.
start "" cmd /c "timeout /t 10 /nobreak >nul & start http://127.0.0.1:5173/"
call pnpm dev
echo.
pause
