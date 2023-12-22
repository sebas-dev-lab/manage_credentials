#!/bin/bash

echo "Stoping container..."
docker-compose stop api_credentials_management

echo "Deleteing container..."
docker rm api_credentials_management

echo "Deleteing image..."
docker rmi api_credentials_management -f

echo "Change permissions..."
sudo chmod -R 777 ./db/postgres

echo "Start container..."
docker-compose up -d --no-deps --build api_credentials_management

echo "Logs services..."
docker-compose ps

echo "Change Permissions..."
sudo chmod -R 750 ./db/postgres

echo "Running Migrations..."
docker exec -it api_credentials_management npm run migration:run