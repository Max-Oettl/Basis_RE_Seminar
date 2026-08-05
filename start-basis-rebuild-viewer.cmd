@echo off
setlocal
cd /d "%~dp0"
title Basis Rebuild Viewer
set "VIEWER_PORT=%BASIS_REBUILD_VIEWER_PORT%"
if not defined VIEWER_PORT set "VIEWER_PORT=%~1"
if not defined VIEWER_PORT set "VIEWER_PORT=4174"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "tools\basis-rebuild-viewer\start-viewer.ps1" -Port "%VIEWER_PORT%"
if errorlevel 1 (
  echo.
  echo Der Basis Rebuild Viewer konnte nicht gestartet werden.
  pause
)
