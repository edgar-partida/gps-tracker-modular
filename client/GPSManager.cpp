#include "GPSManager.h"

GPSManager::GPSManager(int rx, int tx) : ss(rx, tx) {}

void GPSManager::begin(unsigned long baud) {
    ss.begin(baud);
}

bool GPSManager::update() {
    while (ss.available() > 0) {
        if (gps.encode(ss.read())) {
            return gps.location.isValid() && gps.location.isUpdated();
        }
    }
    return false;
}

float GPSManager::getLat() { return gps.location.lat(); }
float GPSManager::getLng() { return gps.location.lng(); }
float GPSManager::getSpeed() { return gps.speed.kmph(); }
