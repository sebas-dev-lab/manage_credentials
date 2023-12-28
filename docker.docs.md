## Documentación de configuración - Docker

### Configuración de Dockerfile - local

> Nombre: Dockerfile.local

> Ubicación: ./dockerfiles/Dockerfile.local

> **Notas** 
>
> - Si se va a ejectuar de forma local usando solo el dockerfile y no docker-compose entonces, si el sistema operativo es Windows o Mac OS, reemplazar el enviroment "DB_HOST=127.0.0.1" por "DB_HOST=host.docker.internal". 
>  - Para el caso de Linux se recomienda colocar la ip de la máquina local. Se puede conocer corriendo el siguiente comando
>  - Esto es necesario para poder comunicarse con la base de datos correspondiente
>  - Modificar los enviroments en función de la configuración a la base de datos (Hacerlo directo en Dockerfile.local)
>  - Se requiere tener Base de datos corriendo de forma local o en cloud
>  - Si se requiere ejecutar base de datos y serivicio, ejecutar desde docker-compose (Ver docker-compose.docs.md)

```
    docker network inspect bridge | grep Gateway
```

### **Comandos de ejecución**

> Desde el root del proyecto ejecutar

- **Build Image**
```
    docker build -t managerapi -f ./dockerfiles/Dockerfile.local .
```
- **Run Container**

```
- Windows - Mac OS X

    docker run --add-host=host.docker.internal:host-gateway -p 4500:4500 -d \
        -e NODE_ENV=entorno \
        -e DB_HOST=nueva_direccion_ip \
        -e DB_PORT=nuevo_puerto \
        -e DB_USERNAME=nuevo_usuario \
        -e DB_PASSWORD=nueva_contraseña \
        -e DB_DATABASE=nueva_base_de_datos \
        --name managerapi managerapi


- Linux

    docker run -p 4500:4500 -d \
        -e NODE_ENV=entorno \
        -e DB_HOST=nueva_direccion_ip \
        -e DB_PORT=nuevo_puerto \
        -e DB_USERNAME=nuevo_usuario \
        -e DB_PASSWORD=nueva_contraseña \
        -e DB_DATABASE=nueva_base_de_datos \
        --name managerapi managerapi

```

- **Ver logs**
```
    docker logs managerapi -f
```

- **Parar y elminar contenedor - Eliminar imagen**

```
    docker stop managerapi && docker rm managerapi && docker rmi managerapi
```

### Docker Hub

> Este proyecto se almacena en Docker Hub
> Realizar pull según el siguiente comando
```
    docker pull fybush/managerapi:<tag>
```
> O ejectuar lo siguiente para ejecutar el servicio a partir de una imagen en particular
```
    docker run -p 4500:4500 -d \
        -e NODE_ENV=entorno \
        -e DB_HOST=nueva_direccion_ip \
        -e DB_PORT=nuevo_puerto \
        -e DB_USERNAME=nuevo_usuario \
        -e DB_PASSWORD=nueva_contraseña \
        -e DB_DATABASE=nueva_base_de_datos \
        --name managerapi fybush/managerapi:1.2.0
```

### Migraciones y volcado de datos

> Migrations
- Requiere de base de datos en ejecución y variables de entorno correctamente configuradas.
- Se ejecutan al construirse la imagen. 

> Volcado de datos
- Opción uno: Copiar el script sql de /scripts/sql/base_data.sql al motor de base de datos y ejecutar.
- Opción dos: Ejecutar script .sh o .bat de /scripts/bash/bulk_data.<.sh | .bat>, esto se puede realizar ejecutando el script desde dentro del contenedor según el siguiente comando
```
    docker exec -it managerapi bash ./scripts/bash/bulk_data.sh
```

