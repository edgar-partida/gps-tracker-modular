# WebServer - Backend API

Servidor central de datos construido con Node.js y Express.

## API Endpoints
- `POST /api/locations`: Recibe nueva ubicación.
- `GET /api/dates`: Lista días con registros.
- `GET /api/hours?date=YYYY-MM-DD`: Lista horas disponibles para una fecha.
- `GET /api/locations?date=YYYY-MM-DD&hour=HH`: Consulta trayectos específicos.

## Variables de Entorno
Crear un archivo `.env` basado en `.env.example` para configurar la conexión a la base de datos.