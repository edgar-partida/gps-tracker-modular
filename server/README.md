# Gateway Server

Actúa como puente (bridge) entre la red de radio (LoRa/UDP) y el protocolo HTTP de la web.

## Funcionamiento
1. Escucha paquetes entrantes del `/client`.
2. Extrae el payload de ubicación.
3. Realiza una petición `POST` al `/WebServer/backend`.

## Ejecución
`npm run dev` o `node index.js`.