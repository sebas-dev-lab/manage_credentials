#!/bin/bash

# Ruta al script SQL
SQL_SCRIPT_PATH=$(pwd)/scripts/sql/base_data.sql
ERROR_LOG="error_log.txt"

# Variables de entorno del contenedor Docker
NODE_ENV=${NODE_ENV:-local}
DB_HOST=${DB_HOST:-172.17.0.1}
DB_PORT=${DB_PORT:-5434}
DB_USERNAME=${DB_USERNAME:-creds_manager_user}
DB_PASSWORD=${DB_PASSWORD:-Fayser17}
DB_DATABASE=${DB_DATABASE:-creds_manager}


# Comprobar si el archivo init.txt ya existe con el valor "1"
if [ ! -f "init.txt" ] || [ "$(cat init.txt)" != "1" ]; then
  # Comando para ejecutar el script SQL con psql (asegúrate de tener psql instalado)
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -p "$DB_PORT" -f "$SQL_SCRIPT_PATH" 2> "$ERROR_LOG"

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
