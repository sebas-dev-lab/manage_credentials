## Documentación

> Versión latest: 1.2.0

> Docker Hub repository: fybush/managerapi:1.2.0

> Public

### Documentación Docker

> Ver en archivo docker.docs.md

### Documentación Docker Compose

> Ver en archivo docker-compose.docs.md


### Instalación desde local

> Tener base de datos en ejecución
> Configurar enviroments en /src/infrasctructure/envs/envs.local
> Ejecutar

```
    npm install
```

```
    npm run start:local
```

### Endpoints

> Notas
- En /postman se encuntra el json para importar en postman y probar los endponts.
- Endpoints de busqueda
  - Considerar que contiene filtros (por campos especificos), busqueda por termino (parametro term) que busca el contenido de term en varios campos de la tabla en cuestion y, page y limit para establecer el paginado, numero de pagina y cantidad de registros por búsqueda respectivamente.


> Health Check

```
curl --location 'http://localhost:4500/api/v1/healthcheck/version'
```

> Auth

- Signin

```
curl --location 'http://localhost:4500/api/v1/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "slescano@gett.mobi",
    "password": "Gett2023!"
}'
```

> Manage users

- Search
```
curl --location 'http://localhost:4500/api/v1/manage-users?name=<Param name>&last_name=<params last name>&term=<term to search>&page=1&limit=10' \
--header 'Authorization: Bearer Token'
```

- Crear Users
```
curl --location 'http://localhost:4500/api/v1/manage-users' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <Token>' \
--data-raw '{
    "name": "user11",
    "last_name": "lastname11",
    "email": "email17@email.com",
    "password": "Password2023!",
    "role_id": 2
}'
```

- Update Users
```
curl --location --request PATCH 'http://localhost:4500/api/v1/manage-users/2' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <Token>' \
--data '{
     "enable": true
}'
```

> Manage Credentials

- Create Credentials
 ```
 curl --location 'http://localhost:4500/api/v1/manage-credentials' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <Token>' \
--data-raw '{
    "secret": "Password20232!",
    "site": "http://site4.com",
    "username": "email5@email.com",
    "note": "Password20232!",
    "auth_users": [8,9]
}'
 ```

- Search Credentials
```
curl --location 'http://localhost:4500/api/v1/manage-credentials?term=<term to search>&page=2&limit=2' \
--header 'Authorization: Bearer <Token>'
```

- Search Credential by Id
```
curl --location 'http://localhost:4500/api/v1/manage-credentials/1' \
--header 'Authorization: Bearer <Token>'
```

- Search credentials by allowed users 
```
curl --location 'http://localhost:4500/api/v1/manage-credentials/allowed-users/1?page=2&limit=2' \
--header 'Authorization: Bearer <Token>'
```

- Update Credentials
```
curl --location --request PATCH 'http://localhost:4500/api/v1/manage-credentials/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <Token>' \
--data '{
    "delete_users": [1,2,3,4,5],
    "add_users": [5,6]
}'
```