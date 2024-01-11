@echo off
setlocal enabledelayedexpansion

set "SQL_SCRIPT_PATH=..\sql\base_data.sql"
set "ERROR_LOG=error_log.txt"

set "NODE_ENV=local"
set "DB_HOST=172.17.0.1"
set "DB_PORT=5434"
set "DB_USERNAME=creds_manager_user"
set "DB_PASSWORD=Fayser17"
set "DB_DATABASE=creds_manager"

if not exist "%~dp0init.txt" (
  set "PGPASSWORD=!DB_PASSWORD!"
  "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h !DB_HOST! -U !DB_USERNAME! -d !DB_DATABASE! -p !DB_PORT! -f "%~dp0%SQL_SCRIPT_PATH%" 2> "%~dp0%ERROR_LOG%"

  if !errorlevel! neq 0 (
    echo Error al ejecutar el script SQL. Verifica el archivo %ERROR_LOG% para obtener más detalles.
  ) else (
    echo 1 > "%~dp0init.txt"
    echo Data dump completed successfully.
  )
) else (
  echo Existing data dump.
)

endlocal
