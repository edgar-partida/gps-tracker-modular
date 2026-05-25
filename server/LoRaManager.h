#ifndef LORA_MANAGER_H
#define LORA_MANAGER_H

#include <SPI.h>
#include <LoRa.h>

class LoRaManager {
public:
    bool begin(long freq, int ss, int rst, int dio0);
    String receive();
};

#endif
