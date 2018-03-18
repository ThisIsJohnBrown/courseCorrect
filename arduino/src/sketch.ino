#include <Wire.h>
#include "Adafruit_PWMServoDriver.h"
 
 Adafruit_PWMServoDriver pwms[1] = {
 Adafruit_PWMServoDriver(0x42)
//  Adafruit_PWMServoDriver(0x41),
//  Adafruit_PWMServoDriver(0x42)
};

String serialResponse = "";
 
 void setup() {
   Serial.begin(115200);
 
   pwms[0].begin();
   pwms[0].setPWMFreq(60);

   Serial.println("running7!");
 }
 
 void loop() {
    if ( Serial.available()) {
      
      serialResponse = Serial.readStringUntil(';');
      Serial.println("Loop!");
      Serial.println(serialResponse);

      int offset = -1;
      int board = -1;
      int tick = 0;
      int num = 0;
      
      for (int i = 0; i <= serialResponse.length(); i++) {
        if (serialResponse.substring(i, i+1) == ",") {
          num = serialResponse.substring(offset + 1, i).toInt();
          if (board == -1) {
            board = num;
          } else {
            pwms[board].setPWM(tick++, 0, num);
          }
          offset = i;
        }
      }
      Serial.println("End");
    }
 }