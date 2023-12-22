chmod +x ./scripts/bash/bulk_data.sh
docker build -t credential_service -f ./dockerfiles/Dockerfile.local .
docker run -d -p 4080:4080 credential_service

docker-compose down && /
      docker rmi api_credentials_management && /
      sudo chmod 7777 ./db/ &&  /
      sudo rm -rf ./db/ && /
      docker-compose up -d


      chmod +x reset_containers.sh
