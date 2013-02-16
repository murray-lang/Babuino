#ifndef __MOTORSHIELD_H__
#define __MOTORSHIELD_H__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// This code is designed to drive a MotorShield shield, and will probably work
// with the Ardumotor shield since that uses the same pins. Only two motors are
// currently supported, because thats all those shields have. It would be 
// trivial to add mor motors though.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------
#include "Arduino.h"
#include "../Motor/Motor.h"

#define PIN_MOTOR_A_DIR			12
#define PIN_MOTOR_A_PWM			 3
#define PIN_MOTOR_A_BRAKE		 9
#define PIN_MOTOR_A_LOADSENSE	A0

#define PIN_MOTOR_B_DIR			13
#define PIN_MOTOR_B_PWM			11
#define PIN_MOTOR_B_BRAKE		 8
#define PIN_MOTOR_B_LOADSENSE	A1

class MotorShield
{
public:
	enum Selected
	{
		MOTOR_NONE = 0,
		MOTOR_A    = 0b01,
		MOTOR_B    = 0b10,
		MOTOR_AB   = 0b11
	};
public:
	MotorShield();
	MotorShield(bool reverseA, bool reverseB);
	
	void setup();
	
	void      setPower(enum Selected selected, byte power);
	byte      getPower(enum Selected selected);
	
	void      setDirection(enum Selected selected, enum MotorBase::eDirection dir);
	MotorBase::eDirection getDirection(enum Selected selected);
	
	void      setBrake(enum Selected selected, enum MotorBase::eBrake brake);
	MotorBase::eBrake     getBrake(enum Selected selected);
	
	void      reverseDirection(enum MotorShield::Selected selected);
	
	void      on(enum Selected selected);
	void      off(enum Selected selected);
	void      off(void);
	
private:
	MOTOR(_motorA, PIN_MOTOR_A_DIR, PIN_MOTOR_A_PWM, PIN_MOTOR_A_BRAKE, false)
	MOTOR(_motorB, PIN_MOTOR_B_DIR, PIN_MOTOR_B_PWM, PIN_MOTOR_B_BRAKE, false)
};
#endif //__MOTORSHIELD_H__
