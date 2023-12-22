#!/bin/bash

docker-compose down

docker rmi api_credentials_management

sudo chmod 7777 ./db/

sudo rm -rf ./db/

docker-compose up -d

chmod +x ./scripts/bash/bulk_data.sh

docker exec -it api_credentials_management npm run migration:run

./scripts/bash/bulk_data.sh