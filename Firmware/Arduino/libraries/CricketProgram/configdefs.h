#ifndef __CONFIGDEFS_H__
#define __CONFIGDEFS_H__

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


#define STACK_SIZE 32
#define LSTACK_SIZE 4

#define MAX_VARIABLES 16

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