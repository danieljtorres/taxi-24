
# Taxi 24

API de transporte que conecta pasajeros con conductores
## Running locally

Clone el repositorio

```bash
  git clone git@github.com:danieljtorres/taxi-24.git
```

Vaya al directorio del proyecto

```bash
  cd taxi-24
```

Instale las dependencias

```bash
  npm install
```

Inicie el servidor

```bash
  npm run start:dev
```

## Environment Variables

Para ejecutar este proyecto necesitara crear un archivo `.env.development` en el directorio `/envs` con las siguientes variables de entorno

`MONGO_DB_DATABASE=nombre_base_datos`

Para la conexion con mongo por default utiliza el host `localhost:27017` si necesita cambiar el host o su conexion necesita autenticacion puede configurar las siguientes variables

`MONGO_DB_HOST`

`MONGO_DB_USERNAME`

`MONGO_DB_PASSWORD`

Por default el puerto de la app es 3000 si necesita editarlo puede configurar la siguiente variable

`PORT`
## Seed Database

El proyecto puede inyectar registros de prueba a la base de datos, para inyectar los registros ejecute el siguiente comando

```bash
  npm run command-nest seed-data
```

Esto inyectara: 

- 12 registros de conductores con diferentes geolocalizaciones
- 4 registros de pasajeros

Para crear y administrar viajes, asi como ver los conductores cercanos, dejo preparado una listas de posibles casos de latitud y longitud

```bash
  [ latitud, longitud ]
  [-34.56547727533884, -58.45284494050236]
  [-34.588425931575536, -58.42525880864136]
  [-34.617434630315884, -58.433161814803555]
  [-34.57364937950123, -58.50598479980289]
```

Esto le permitira probar diferentes casos
## API Reference

Una vez el servidor este ejecutandose podra ingresar a una documentacion de swagger lista para usar y probar los diferentes metodos de la API

Link: [Swagger API Reference](http://localhost:3000/docs)
## Running Tests

Para correr los test ejecute el siguiente comando

```bash
  npm run test
```
