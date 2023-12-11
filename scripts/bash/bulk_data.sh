#!/bin/bash

# Ruta al script SQL
SQL_SCRIPT_PATH=$(pwd)/scripts/sql/base_data.sql
PGPASSWORD="Fayser17"
ERROR_LOG="error_log.txt"
PORT=5432

# Comprobar si el archivo init.txt ya existe con el valor "1"
if [ ! -f "init.txt" ] || [ "$(cat init.txt)" != "1" ]; then
  # Comando para ejecutar el script SQL con psql (asegúrate de tener psql instalado)
  PGPASSWORD="$PGPASSWORD" psql -h localhost -U creds_manager_user -d creds_manager -p "$PORT" -f "$SQL_SCRIPT_PATH" 2> "$ERROR_LOG"

  # Verificar si ocurrió un error durante la ejecución de psql
  if [ $? -ne 0 ]; then
    echo "Error al ejecutar el script SQL. Verifica el archivo $ERROR_LOG para obtener más detalles."
  else
    # Crear el archivo init.txt con el valor "1"
    echo "1" > init.txt
    echo "Data dump completed successfully."
  fi
else
  echo "Existing data dump."
fi
