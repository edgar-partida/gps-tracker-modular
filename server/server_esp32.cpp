#include <Arduino.h>
#include "Config.h"
#include "LoRaManager.h"
#include <WiFi.h>
#include <HTTPClient.h>

// Function Prototypes for C++ compatibility
void connectWiFi();
void processIncomingData(String data);
void sendToAPI(String lat, String lon, String speed);

LoRaManager loraManager;

void connectWiFi()
{
    Serial.print("Connecting to WiFi");
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void setup()
{
    Serial.begin(115200);
    connectWiFi();
    if (!loraManager.begin(FREQUENCY, LORA_SS, LORA_RST, LORA_DIO0))
    {
        Serial.println("LoRa Receiver Init Failed!");
        while (1)
            ;
    }
    Serial.println("Home Station Online - Waiting for Bike...");
}

void loop()
{
    String data = loraManager.receive();
    if (data != "")
    {
        Serial.println("RECEIVED BIKE LOCATION:");
        processIncomingData(data);
    }
}

void processIncomingData(String data)
{
    // Parse CSV: lat,lng,speed
    int firstComma = data.indexOf(',');
    int secondComma = data.indexOf(',', firstComma + 1);

    if (firstComma != -1 && secondComma != -1)
    {
        String lat = data.substring(0, firstComma);
        String lon = data.substring(firstComma + 1, secondComma);
        String speed = data.substring(secondComma + 1);

        Serial.println("Lat: " + lat + " | Lon: " + lon + " | Speed: " + speed + " km/h");
        Serial.println("Link: https://www.google.com/maps?q=" + lat + "," + lon);

        sendToAPI(lat, lon, speed);
    }
    else
    {
        Serial.println("Invalid data format received: " + data);
    }
}

void sendToAPI(String lat, String lon, String speed)
{
    Serial.println("[HTTP] Preparing to send location data...");
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        Serial.print("[HTTP] Connecting to API: ");
        Serial.println(API_URL);

        http.begin(API_URL);
        http.addHeader("Content-Type", "application/json");

        // Construct JSON payload
        String httpRequestData = "{\"latitude\":\"" + lat +
                                 "\",\"longitude\":\"" + lon +
                                 "\",\"speed\":" + speed + "}";

        Serial.print("[HTTP] POST Data: ");
        Serial.println(httpRequestData);

        int httpResponseCode = http.POST(httpRequestData);

        if (httpResponseCode > 0)
        {
            Serial.printf("[HTTP] Response Code: %d\n", httpResponseCode);
            String response = http.getString();
            Serial.println("[HTTP] Server Response: " + response);
        }
        else
        {
            Serial.printf("[HTTP] POST Failed. Error: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
        Serial.println("[HTTP] Request complete, connection closed.");
    }
    else
    {
        Serial.println("WiFi Disconnected. Reconnecting...");
        connectWiFi();
    }
}
