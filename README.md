chmod +x ./scripts/bash/bulk_data.sh
docker build -t credential_service -f ./dockerfiles/Dockerfile.local .
docker run -d -p 4080:4080 credential_service

docker-compose down && /
      docker rmi api_credentials_management && /
      sudo chmod 7777 ./db/ &&  /
      sudo rm -rf ./db/ && /
      docker-compose up -d


      chmod +x reset_containers.sh

docker network inspect bridge | grep Gateway

docker build -t managerapi -f ./dockerfiles/Dockerfile.local .

docker run --add-host=host.docker.internal:host-gateway -p 4500:4500 -d --name managerapi managerapi

docker run -p 4500:4500 -d --name managerapi managerapi

docker logs managerapi -f

docker stop managerapi && docker rm managerapi && docker rmi managerapi

