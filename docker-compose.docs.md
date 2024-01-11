## Documentación de configuración - Docker-Compose

> **Descipción**

- A partir de la ejecución del archivo de docker-compose.yml ubicado en el root del proyecto, se inicializa servicio de base de datos y API de administración de credenciales.
- Se debe configurar en variables de entorno, directo en el archivo, tanto para el servicio como para la base de datos.
- Es necesario un vocado de datos luego de inicializar, esto se puede ejecutar directamente por sql, la cual se encuentra en scripts/sql/base_data.sql o ejecutando algunos de los scripts .sh o .bat  de scripts/bash/bulk_data.<.sh | .bat> dependiendo del sistema operativo.

> **Ejecución**

- Desde el root del proyecto ejecutar

 ```
    docker-compose up -d
 ```

- Las migraciones corren durante la creación y ejecución del servicio
- El volcado de datos inicial (solo por única vez a menos que se elimine la base de datos) hacerlo con el siguiente comando o ejecutando el script sql directo en el motor de base de datos.

```
    docker exec -it api_credentials_management bash ./scripts/bash/bulk_data.sh

En Windows probablemente se necesite ejecutar de la siguiente forma

    winpty docker exec -it api_credentials_management bash ./scripts/bash/bulk_data.sh
```

- Si se requiere ver logs
```
  docker logs api_credentials_management -f
```

> **Eliminar Serivico de API y Base de datos**

- Esto elimina por completo servicio de api y base de datos, lo que ocaciona la pérdida de datos.

- Ejecución desde Linux

```
    docker-compose down

    docker rmi <nombre de imagen> -f => ejemplo: docker rmi fybush/managerapi:1.1.0

    sudo chmod 7777 ../db_proyects/db/

    sudo rm -rf ../db_proyects/db/
    
```

> **Eliminar y reconstruir solo servicio de API**

```
    docker-compose stop api_credentials_management

    docker rm api_credentials_management

    docker rmi <nombre de imagen> -f => ejemplo: docker rmi fybush/managerapi:1.1.0 -f

    sudo chmod -R 777 ../db_proyects/db/postgres

    docker-compose up -d --no-deps --build api_credentials_management

    docker-compose ps

    sudo chmod -R 750 ./db/postgres
```