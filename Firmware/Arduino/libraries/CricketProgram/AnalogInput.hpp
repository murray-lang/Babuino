#ifndef __ANALOGINPUT_HPP__
#define __ANALOGINPUT_HPP__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// The purpose of this code is to define an analog input pin directly into code
// space, hence avoiding the need to store pin numbers as a class member in RAM.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------
#define BEGIN_ANALOG_INPUTS(name)		\
class AnalogInputs_##name				\
{										\
public:

#define ANALOG_INPUT(name, pin)		\
	inline int name() const					\
	{										\
		return analogRead(pin);				\
	}

#define END_ANALOG_INPUTS(name) } name;

#endif /* __ANALOGINPUT_HPP__ */
