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
#include "MotorShield.h"


MotorShield::MotorShield()
{
	MotorShield(false, false);
}

MotorShield::MotorShield(bool reverseA, bool reverseB)
{
	_motorA.reversePolarity(reverseA, false);
	_motorB.reversePolarity(reverseB, false);
}

void 
MotorShield::setup()
{
	_motorA.setup();
	_motorB.setup();
}

void      
MotorShield::setPower(enum MotorShield::Selected selected, byte power)
{
	if ((selected & MOTOR_A) != 0)
	{
		_motorA.setPower(power);
	}
		
	if ((selected & MOTOR_B) != 0)
	{
		_motorB.setPower(power);
	}
}

byte      
MotorShield::getPower(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getPower();
	else if ((selected & MOTOR_B) != 0)
		return _motorB.getPower();
	else 
		return 0;
}

void      
MotorShield::setDirection(enum MotorShield::Selected selected, enum MotorBase::eDirection dir)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.setDirection(dir);
		
	if ((selected & MOTOR_B) != 0)
		_motorB.setDirection(dir);
}

MotorBase::eDirection
MotorShield::getDirection(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getDirection();
	else
		return _motorB.getDirection();
}

void      
MotorShield::reverseDirection(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.reverseDirection();
		
	if ((selected & MOTOR_B) != 0)
		_motorB.reverseDirection();
}

void      
MotorShield::setBrake(enum MotorShield::Selected selected, enum MotorBase::eBrake brake)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.setBrake(brake);
		
	if ((selected & MOTOR_B) != 0)
		_motorB.setBrake(brake);
}

MotorBase::eBrake
MotorShield::getBrake(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getBrake();
	else
		return _motorB.getBrake();
}

void      
MotorShield::on(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
	{
		_motorA.on();
	}
		
	if ((selected & MOTOR_B) != 0)
	{
		_motorB.on();
	}
}

void      
MotorShield::off(enum MotorShield::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
	{
		_motorA.off();
	}
		
	if ((selected & MOTOR_B) != 0)
	{
		_motorB.off();
	}
}

void      
MotorShield::off()
{
	_motorA.off();
	_motorB.off();
}

