@echo off
title Mini-WTD - Serveur local PHP
color 0A

cd /d "C:\Projets\Mini-WTD"

:: Vérifie PHP
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo PHP n'est pas détecté. Installe-le ou ajoute son chemin dans les variables d'environnement.
    pause
    exit /b
)

echo.
echo ============================================
echo   ?? Lancement du serveur Mini-WTD
echo   ?? http://localhost:8080/
echo ============================================
echo.

start http://localhost:8080/
php -S 0.0.0.0:8080 -t public

echo.
echo ? Le serveur Mini-WTD s'est arrêté.
pause
