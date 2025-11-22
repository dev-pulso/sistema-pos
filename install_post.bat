@echo off
setlocal ENABLEDELAYEDEXPANSION

:: ============================================
::   SISTEMA POS - INSTALACION AUTOMATICA
:: ============================================

title Instalador del Sistema POS

echo.
echo ============================================
echo     Instalador Automatico del Sistema POS
echo ============================================
echo.

:: Verificar Docker
echo Verificando instalacion de Docker...
docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Docker no esta instalado en este equipo.
    echo Descargalo desde: https://www.docker.com/products/docker-desktop/
    echo Luego ejecuta este archivo nuevamente.
    echo.
    pause
    exit /b
)

echo Docker detectado correctamente.
echo.

:: Crear carpeta uploads del backend si la usas
if not exist backend\uploads (
    echo Creando carpeta backend\uploads...
    mkdir backend\uploads
)

echo.

:: Levantar todos los servicios definidos en docker-compose (backend, frontend, db)
echo Iniciando contenedores (backend, frontend y base de datos)...
docker compose --env-file .env.docker up -d --build

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar Docker Compose.
    echo Verifica que el archivo docker-compose.yml existe y no tiene errores.
    echo.
    pause
    exit /b
)

echo.
echo ==============================================
echo   Sistema POS instalado y funcionando ✔️
echo ==============================================
echo.
echo Servicios disponibles:
echo   - Frontend: http://localhost:3000
echo   - Backend : http://localhost:4000
echo   - Postgres: puerto 5432 (contenedor "db")
echo.
echo Para detener el sistema usa:
echo     docker compose down
echo.
echo Todo se ha instalado correctamente.
echo.

pause
exit /b
