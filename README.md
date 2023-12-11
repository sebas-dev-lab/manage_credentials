chmod +x ./scripts/bash/bulk_data.sh
docker build -t credential_service -f ./dockerfiles/Dockerfile.local .
docker run -d -p 4080:4080 credential_service
