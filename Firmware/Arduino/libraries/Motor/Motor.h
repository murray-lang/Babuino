#ifndef __MOTOR_HPP__
#define __MOTOR_HPP__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// This code is designed to drive a Motor as made available by the MotorShield
// shield. Motor settings can be stored then applied to the oins at a later 
// time.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------
#include "Arduino.h"

	
class MotorBase
{
public:
	enum eDirection { THIS_WAY, THAT_WAY };
	enum eBrake	{ BRAKE_OFF, BRAKE_ON };

	// All state information stored in a single byte of RAM using bit fields
	struct State
	{
		bool		 on        : 1;
		eDirection	 direction : 1;
		eBrake		 brake     : 1;
		bool         reverse   : 1; // ie Polarity. Handy if wires are back to front!
		unsigned int power	   : 3; // 0-7 (presets between 0 and 255)
		bool		 applied   : 1;
	};
public:
	MotorBase()
	{
	}
	
	inline void on(bool applyNow = true)
	{
		_state.on = true;
		_state.brake = BRAKE_OFF;
		if (applyNow)
		{
			applyPower();
			applyBrake();
		}
		else
			_state.applied = false;
	}
	
	inline void off(bool applyNow = true) 
	{ 
		_state.on = false;
		if (applyNow)
			applyPower();
		else
			_state.applied = false; 
	}
	
	inline void setPower(byte power, bool applyNow = true)
	{
		_state.power = power;
		if (applyNow)
			applyPower();
		else
			_state.applied = false;
	}

	inline byte getPower(void)
	{
		return _state.power;
	}
	
	inline void setDirection(enum eDirection dir, bool applyNow = true)
	{
		_state.direction = dir;
		if (applyNow)
			applyDirection();
		else
			_state.applied   = false;
	}
	
	inline eDirection getDirection(void)
	{
		return _state.direction;
	}
	
	inline void reverseDirection(bool applyNow = true)
	{
		_state.direction = opposite(_state.direction);
		if (applyNow)
			applyDirection();
		else
			_state.applied   = false;
	}

	inline void setBrake(enum eBrake brake, bool applyNow = true)
	{
		_state.brake   = brake;
		if (applyNow)
			applyBrake();
		else
			_state.applied   = false;
	}
	
	inline eBrake     getBrake(void)
	{
		return _state.brake;
	}

	inline void reversePolarity(bool reverse, bool applyNow = true)
	{
		_state.reverse   = reverse;
		if (applyNow)
			applyDirection();
		else
			_state.applied   = false;
	}
	
	inline enum eDirection opposite(enum eDirection dir)
	{
		return dir == THIS_WAY ? THAT_WAY : THIS_WAY;
	}

	inline bool isApplied()
	{
		return _state.applied;
	}

	virtual void setup()          = 0;
	virtual void applyDirection() = 0;
	virtual void applyPower()     = 0;
	virtual void applyBrake()     = 0;
	
	void apply()
	{
		if (_state.applied)
				return;	
		applyDirection();
		applyPower();
		applyBrake();
		_state.applied = true;
	}

	inline byte presetToPower(byte pwr)
	{
		if (pwr > 7)
			pwr = 7;

		return (255/7) * pwr;
	}
protected:
	State	_state;
};

//------------------------------------------------------------------------------
// Declare a motor by name, and specify the Arduino pins. Also specify the
// polarity (this is to deal with unexpected reversal of the wiring of motors.
// The reason for using this macro is to declare the pins directly into code and
// avoid the need to use member variables in RAM just to hold pin numbers.
// While this conserves RAM, it does use more code space than otherwise might be
// used.
//------------------------------------------------------------------------------
#define MOTOR(name, pinDir, pinPwm, pinBrake, rev)				\
	class Motor_##name	: public MotorBase						\
	{															\
	public:														\
		Motor_##name()											\
		{														\
			_state.reverse = rev;								\
		}														\
		virtual void setup()				           			\
		{														\
			pinMode(pinDir, OUTPUT);							\
			pinMode(pinBrake, OUTPUT);							\
			pinMode(pinPwm, OUTPUT);							\
		}														\
		virtual void applyDirection()							\
		{														\
			eDirection dir;										\
			if (_state.reverse)									\
				dir = opposite(_state.direction);				\
			else												\
				dir = _state.direction;							\
			digitalWrite(pinDir, dir);							\
		}														\
		virtual void applyPower()								\
		{														\
			byte power;											\
			if (_state.on)										\
				power = presetToPower(_state.power);			\
			else												\
				power = 0;										\
			analogWrite(pinPwm, power);							\
		}														\
		virtual void applyBrake()								\
		{														\
			digitalWrite(pinBrake, _state.brake);				\
		}														\
	} name;
	

#endif //__MOTOR_HPP__
