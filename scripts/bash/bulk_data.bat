@echo off
setlocal enabledelayedexpansion

REM Ruta al script SQL
set "SQL_SCRIPT_PATH=..\sql\base_data.sql"
set "ERROR_LOG=error_log.txt"

REM Variables de entorno del contenedor Docker
set "NODE_ENV=local"
set "DB_HOST=172.17.0.1"
set "DB_PORT=5434"
set "DB_USERNAME=creds_manager_user"
set "DB_PASSWORD=Fayser17"
set "DB_DATABASE=creds_manager"

REM Comprobar si el archivo init.txt ya existe con el valor "1"
if not exist "%~dp0init.txt" (
  REM Comando para ejecutar el script SQL con psql (asegúrate de tener psql instalado)
  set "PGPASSWORD=!DB_PASSWORD!"
  "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h !DB_HOST! -U !DB_USERNAME! -d !DB_DATABASE! -p !DB_PORT! -f "%~dp0%SQL_SCRIPT_PATH%" 2> "%~dp0%ERROR_LOG%"

  REM Verificar si ocurrió un error durante la ejecución de psql
  if !errorlevel! neq 0 (
    echo Error al ejecutar el script SQL. Verifica el archivo %ERROR_LOG% para obtener más detalles.
  ) else (
    REM Crear el archivo init.txt con el valor "1" en el mismo directorio que el script batch
    echo 1 > "%~dp0init.txt"
    echo Data dump completed successfully.
  )
) else (
  echo Existing data dump.
)

endlocal
