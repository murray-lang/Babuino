#ifndef __MOTORS_HPP__
#define __MOTORS_HPP__
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
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// This code is designed to drive a collection of motors. Originally written to
// the MotorShield shield (and therfore the Ardumoto), it now supports a lower-
// level interface to an H_Bridge driver as used by the Babuino board.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------
#include "Arduino.h"
#include "configdefs.h"
#include "Motor.hpp"

//------------------------------------------------------------------------------
// Encapsulates a collection of motors.
//------------------------------------------------------------------------------
class Motors
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
	Motors();
	Motors(bool reverseA, bool reverseB);
	
	void setup();
	
	void      setPower(enum Selected selected, byte power);
	byte      getPower(enum Selected selected);
	
	void      setDirection(enum Selected selected, enum MotorBase::eDirection dir);
	MotorBase::eDirection getDirection(enum Selected selected);
	
	void      setBrake(enum Selected selected, enum MotorBase::eBrake brake);
	MotorBase::eBrake     getBrake(enum Selected selected);
	
	void      reverseDirection(enum Selected selected);
	
	void      on(enum Selected selected);
	void      off(enum Selected selected);
	void      off(void);
	
private:
#ifdef _MOTORS_MOTORSHIELD_
	MOTOR(_motorA, PIN_MOTOR_A_DIR, PIN_MOTOR_A_PWM, PIN_MOTOR_A_BRAKE, false)
	MOTOR(_motorB, PIN_MOTOR_B_DIR, PIN_MOTOR_B_PWM, PIN_MOTOR_B_BRAKE, false)
#elif defined _MOTORS_H_BRIDGE_ || defined _BOARD_BABUINO_ 	
	MOTOR(_motorA, PIN_H_MOTOR_A_1, PIN_H_MOTOR_A_2, PIN_H_MOTOR_A_PWM, false)
	MOTOR(_motorB, PIN_H_MOTOR_B_1, PIN_H_MOTOR_B_2, PIN_H_MOTOR_B_PWM, false)
#endif	
};
#endif //__MOTORS_HPP__
