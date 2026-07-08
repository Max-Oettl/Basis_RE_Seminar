@echo off
setlocal
cd /d "%~dp0"
title Reltest SVG-Browser
node tools\svg-browser\server.js
if errorlevel 1 (
  echo.
  echo Der SVG-Browser konnte nicht gestartet werden.
  pause
)
