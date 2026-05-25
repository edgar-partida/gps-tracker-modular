#include "LoRaManager.h"

bool LoRaManager::begin(long freq, int ss, int rst, int dio0) {
    LoRa.setPins(ss, rst, dio0);
    return LoRa.begin(freq);
}

String LoRaManager::receive() {
    int packetSize = LoRa.parsePacket();
    String message = "";
    if (packetSize) {
        while (LoRa.available()) {
            message += (char)LoRa.read();
        }
    }
    return message;
}
