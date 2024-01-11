.PHONY: dump_data run_local
VERSION := 1.0.0

include ./src/infrastructure/envs/.env.local
export

all: dump_data run_local

dump_data:
	bash ./scripts/bash/bulk_data.sh

run_rabbit:
	chmod +x ./scripts/services/rabbitmq.run.sh
	bash ./scripts/services/rabbitmq.run.sh

run_local:
	bash ./init.sh


