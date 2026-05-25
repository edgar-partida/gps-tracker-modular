# Tracker Client (Hardware)

Este módulo se encarga de la lectura de sensores GPS y el envío de datos mediante tecnología LoRa.

## Detalles Técnicos
- **Plataforma:** Arduino / PlatformIO.
- **Librerías principales:** `LoRa.h`, `TinyGPS++`.
- **Hardware:** Semtech SX1276/77/78/79.

## Configuración
Asegúrate de configurar la frecuencia correcta en el código (e.g., `433E6`, `915E6`) según tu región geográfica.

## Wiring
VCC -> 3.3V, NSS -> 10, DIO0 -> 2 (Ver código principal para detalles de pines).