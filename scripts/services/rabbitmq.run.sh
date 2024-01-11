#!/bin/bash

docker run -d \
  --name rabbitmq_manager \
  --restart always \
  -p 5672:5672 \
  -p 15672:15672 \
  --env-file ./scripts/services/rabbitmq.env \
  rabbitmq:management
