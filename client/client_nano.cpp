#include "Config.h"
#include "GPSManager.h"
#include "LoRaManager.h"

GPSManager gpsManager(GPS_RX_PIN, GPS_TX_PIN);
LoRaManager loraManager;

void printFirstCoordinates()
{
    // Wait for the first valid GPS fix to log initial coordinates
    Serial.println(F("Waiting for initial GPS fix..."));
    while (!gpsManager.update())
    {
        // Stay here until we get valid data
    }

    char latStr[12];
    char lngStr[12];
    dtostrf(gpsManager.getLat(), 1, 6, latStr);
    dtostrf(gpsManager.getLng(), 1, 6, lngStr);

    Serial.print(F("Initial Position Logged: "));
    Serial.print(latStr);
    Serial.print(F(", "));
    Serial.println(lngStr);
}

void setup()
{
    Serial.begin(115200);
    Serial.println("Starting GPS Manager...");
    gpsManager.begin(GPS_BAUD);
    Serial.println("GPS Started correctly");
    printFirstCoordinates();
    Serial.println("Starting LoRa Manager...");
    if (!loraManager.begin(FREQUENCY, LORA_SS, LORA_RST, LORA_DIO0))
    {
        Serial.println("LoRa Failed!");
        while (1)
            ;
    }
    else
    {
        Serial.println("LoRa Started correctly");
    }
    Serial.println("Bike Tracker Active");
}

void loop()
{
    if (gpsManager.update())
    {
        char latStr[12];
        char lngStr[12];
        char speedStr[8];
        char payload[40];

        // Convert floats to strings safely
        dtostrf(gpsManager.getLat(), 1, 6, latStr);
        dtostrf(gpsManager.getLng(), 1, 6, lngStr);
        dtostrf(gpsManager.getSpeed(), 1, 2, speedStr);

        // Format the final payload buffer
        snprintf(payload, sizeof(payload), "%s,%s,%s", latStr, lngStr, speedStr);

        loraManager.sendData(String(payload));
        Serial.print(F("Sent: "));
        Serial.println(payload);
    }
}
