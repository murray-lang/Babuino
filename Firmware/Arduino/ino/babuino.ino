  // Unfortunately, these have to be included here for the corresponding
  // libraries to be linked by the Arduino IDE, even though they are 
  // already included where they are needed.
#include <Motor.h>
#include <MotorShield.h>
//#include <LiquidCrystal.h>
#include <EEPROM.h>  

#include <CricketProgram.h>
//#include <Serial.h>

CricketProgram babuino(0);
// initialize the library with the numbers of the interface pins
//LiquidCrystal lcd(32, 34, 22, 24, 26, 28);

void setup()
{
  //Serial.begin(9600);
  babuino.setup();
    // Set up Cricket run button (separate from Arduino run button)
  PCICR |= (1<<PCIE0);
  PCMSK0 |= (1<<PCINT2);
  //lcd.begin(16, 2);
  //lcd.setCursor(0, 0);
  //lcd.print("Test");
  //lcd.setCursor(0, 1);
  
  //pinMode(4, OUTPUT);
  //digitalWrite(4, LOW);
  
  //pinMode(10, INPUT);							
  //digitalWrite(10, HIGH);
  //interrupts();
}

void loop()
{
  babuino.loop();
  //digitalWrite(4, LOW);
  //Serial.println("Hello");
  //delay(1000);
  //digitalWrite(4, HIGH);
  //delay(1000);
  
}

ISR(PCINT0_vect)
{
  //digitalWrite(4, HIGH);
  //lcd.print("interrupt");
 babuino.onPinChange();  
}



