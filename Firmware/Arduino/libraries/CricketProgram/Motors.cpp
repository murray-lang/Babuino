//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// This code is designed to drive a collection of motors. Originally written to
// the MotorShield shield (and therfore the Ardumoto), it now supports a lower-
// level interface to an H_Bridge driver as used by the Babuino board.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------
#include "Motors.hpp"


Motors::Motors()
{
	Motors(false, false);
}

Motors::Motors(bool reverseA, bool reverseB)
{
	_motorA.reversePolarity(reverseA, false);
	_motorB.reversePolarity(reverseB, false);
}

void 
Motors::setup()
{
	_motorA.setup();
	_motorB.setup();
}

void      
Motors::setPower(enum Motors::Selected selected, byte power)
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
Motors::getPower(enum Motors::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getPower();
	else if ((selected & MOTOR_B) != 0)
		return _motorB.getPower();
	else 
		return 0;
}

void      
Motors::setDirection(enum Motors::Selected selected, enum MotorBase::eDirection dir)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.setDirection(dir);
		
	if ((selected & MOTOR_B) != 0)
		_motorB.setDirection(dir);
}

MotorBase::eDirection
Motors::getDirection(enum Motors::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getDirection();
	else
		return _motorB.getDirection();
}

void      
Motors::reverseDirection(enum Motors::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.reverseDirection();
		
	if ((selected & MOTOR_B) != 0)
		_motorB.reverseDirection();
}

void      
Motors::setBrake(enum Motors::Selected selected, enum MotorBase::eBrake brake)
{
	if ((selected & MOTOR_A) != 0)
		_motorA.setBrake(brake);
		
	if ((selected & MOTOR_B) != 0)
		_motorB.setBrake(brake);
}

MotorBase::eBrake
Motors::getBrake(enum Motors::Selected selected)
{
	if ((selected & MOTOR_A) != 0)
		return _motorA.getBrake();
	else
		return _motorB.getBrake();
}

void      
Motors::on(enum Motors::Selected selected)
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
Motors::off(enum Motors::Selected selected)
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
Motors::off()
{
	_motorA.off();
	_motorB.off();
}

