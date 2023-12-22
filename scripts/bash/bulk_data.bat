@echo off
set SQL_SCRIPT_PATH=..\sql\base_data.sql
set PGPASSWORD=Fayser17
set ERROR_LOG=error_log.txt

REM Comprobar si el archivo init.txt ya existe con el valor "1"
if not exist "%~dp0init.txt" (
  REM Comando para ejecutar el script SQL con psql (asegúrate de tener psql instalado)
  set PGPASSWORD=%PGPASSWORD%
  "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -U creds_manager_user -d creds_manager -p 5434 -f "%~dp0%SQL_SCRIPT_PATH%" 2> "%~dp0%ERROR_LOG%"

  REM Verificar si ocurrió un error durante la ejecución de psql
  if %errorlevel% neq 0 (
    echo Error al ejecutar el script SQL. Verifica el archivo %ERROR_LOG% para obtener más detalles.
  ) else (
    REM Crear el archivo init.txt con el valor "1" en el mismo directorio que el script batch
    echo 1 > "%~dp0init.txt"
    echo Data dump completed successfully.
  )
) else (
  echo Existing data dump.
)
