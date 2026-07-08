@echo off
setlocal
cd /d "%~dp0"
title Basis Rebuild Viewer
node tools\basis-rebuild-viewer\server.js
if errorlevel 1 (
  echo.
  echo Der Basis Rebuild Viewer konnte nicht gestartet werden.
  pause
)
