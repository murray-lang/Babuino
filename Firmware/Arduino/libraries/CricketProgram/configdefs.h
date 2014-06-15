#ifndef __CONFIGDEFS_H__
#define __CONFIGDEFS_H__
/* -----------------------------------------------------------------------------
   Copyright 2014 Murray Lang

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   -----------------------------------------------------------------------------
 */
//------------------------------------------------------------------------------
// Use these defines to specify the basic hardware.
// Uncomment the definition(s) that apply.
//------------------------------------------------------------------------------
// Choose one of these
#define _BOARD_BABUINO_		// This also assumes the Babuino motor connections
//#define _BOARD_ARDUINO_

// Choose one, or none, of these
//#define _MOTORS_MOTORSHIELD_
//#define _MOTORS_H_BRIDGE_		// No need to define if BOARD_BABUINO is defined

//------------------------------------------------------------------------------
// These are the pins used by MotorShield and Ardumoto
//------------------------------------------------------------------------------
#define PIN_MOTOR_A_DIR			12
#define PIN_MOTOR_A_PWM			 3
#define PIN_MOTOR_A_BRAKE		 9
#define PIN_MOTOR_A_LOADSENSE	A0

#define PIN_MOTOR_B_DIR			13
#define PIN_MOTOR_B_PWM			11
#define PIN_MOTOR_B_BRAKE		 8
#define PIN_MOTOR_B_LOADSENSE	A1

//------------------------------------------------------------------------------
// These are the pins used by The Babuino board to directly control the H_Bridge
// motor driver
//------------------------------------------------------------------------------
#define PIN_H_MOTOR_A_1		 4		// PORTD pin 4 is Arduino digital pin 4 for ATMEGA168/328
#define PIN_H_MOTOR_A_2		 2		// PORTD pin 2 is Arduino digital pin 2 for ATMEGA168/328
#define PIN_H_MOTOR_A_PWM   11 		// PORTB pin 3 is Arduino digital pin 11 for ATMEGA168/328

#define PIN_H_MOTOR_B_1		12		// PORTB pin 4 is Arduino digital pin 12 for ATMEGA168/328
#define PIN_H_MOTOR_B_2		 7		// PORTD pin 7 is Arduino digital pin 7 for ATMEGA168/328
#define PIN_H_MOTOR_B_PWM    3		// PORTD pin 3 is Arduino digital pin 3 for ATMEGA168/328

#define PIN_DI1			 8
//#define PIN_DI2
//#define PIN_DI3
//#define PIN_DI4

#define PIN_DO1			 5
#define PIN_DO2			 6
#define PIN_DO3			10
#define PIN_DO4			13

#define PIN_AI1			A0
#define PIN_AI2			A1
#define PIN_AI3			A2
#define PIN_AI4			A3

#define PIN_AO1			 9
//#define PIN_AO2
//#define PIN_AO3
//#define PIN_AO4


#define STACK_SIZE 48
#define LSTACK_SIZE 4

#define MAX_GLOBALS 16
#define MAX_TEMPORARIES 8

#define LED_INTERVAL_RUN	 200
#define LED_INTERVAL_IDLE	1000

//------------------------------------------------------------------------------
// These I/O pins correspond to the Babuino board
//------------------------------------------------------------------------------
	// On the original Babuino board, the run button is on pin 0 of 
	// PORTB. For the ATMEGA168/328, this equates to Arduino digital 
	// pin 8
#define PIN_RUN	8
	// On the original Babuino board, the user led is on pin 5 of PORTD.
	// For the ATMEGA168/328, this equates to Arduino digital pin 5
#define PIN_LED 5
	// On the original Babuino board, the user beeper is on pin 1 of PORTB.
	// For the ATMEGA168/328, this equates to Arduino digital pin 9
#define PIN_BEEPER 9

#endif //__CONFIGDEFS_H__