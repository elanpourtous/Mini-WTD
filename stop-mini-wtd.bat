@echo off
title ?? Arr�t du serveur Mini-WTD
color 0C

echo ============================================
echo ?? Arr�t du serveur Mini-WTD en cours...
echo ============================================

:: Tuer le processus PHP sur le port 8080
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /PID %%a /F >nul 2>&1

echo ? Serveur Mini-WTD arr�t�.
pause
