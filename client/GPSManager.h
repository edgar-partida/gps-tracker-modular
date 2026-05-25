#ifndef GPS_MANAGER_H
#define GPS_MANAGER_H

#include <TinyGPS++.h>
#include <SoftwareSerial.h>

class GPSManager {
private:
    SoftwareSerial ss;
    TinyGPSPlus gps;
public:
    GPSManager(int rx, int tx);
    void begin(unsigned long baud);
    bool update(); // Returns true if new valid data is available
    float getLat();
    float getLng();
    float getSpeed();
};

#endif
