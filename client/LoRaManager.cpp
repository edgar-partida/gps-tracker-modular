#include "LoRaManager.h"

bool LoRaManager::begin(long freq, int ss, int rst, int dio0) {
    LoRa.setPins(ss, rst, dio0);
    return LoRa.begin(freq);
}

void LoRaManager::sendData(String message) {
    LoRa.beginPacket();
    LoRa.print(message);
    LoRa.endPacket();
}
