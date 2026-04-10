@echo off
title Visualizer Studio Pro - Local Render Node
echo [SYSTEM] Engaging Visualizer Studio Core...
echo [SYSTEM] Initializing 1080p Export Engine...
echo.
cd %~dp0
call npm run dev
pause
