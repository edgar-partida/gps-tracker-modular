#ifndef CONFIG_H
#define CONFIG_H

// ESP32 standard VSPI pins for LoRa
#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 26

#define FREQUENCY 433E6

// WiFi and API Configuration
#define WIFI_SSID "SSID-NAME"
#define WIFI_PASS "PASS"
#define API_URL "http://server-ip:8082/api/locations"

#endif
