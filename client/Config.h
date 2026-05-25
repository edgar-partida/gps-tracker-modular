#ifndef CONFIG_H
#define CONFIG_H

// LoRa Pins (Standard SPI for Nano)
#define LORA_SCK  13
#define LORA_MISO 12
#define LORA_MOSI 11
#define LORA_SS   10
#define LORA_RST  9
#define LORA_DIO0 2

// GPS Pins
#define GPS_RX_PIN 4
#define GPS_TX_PIN 3
#define GPS_BAUD   9600

// Radio Settings
#define FREQUENCY 433E6

#endif
