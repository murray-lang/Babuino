#ifndef __ANALOGOUTPUT_HPP__
#define __ANALOGOUTPUT_HPP__
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
// The purpose of this code is to define an analog output (PWM) pin directly 
// into code space, hence avoiding the need to store pin numbers as a class 
// member in RAM.
//
// It is a work in progress and the deferred output stuff hasn't been 
// exercised.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Define an analog output pin
// Give it a name and an Arduino pin number
// Writes directly to the pin
//------------------------------------------------------------------------------
#define ANALOG_OUTPUT(name, pin)		\
    inline void setup##name()							\
	{													\
		pinMode(pin, OUTPUT);							\
	}													\
	inline void  name(unsigned char value) const		\
	{											\
		analogWrite(pin, value);				\
	}
	
//------------------------------------------------------------------------------
// This class allows you to register changes in analog outputs, but to give
// effect to those changes at a later time. ie. the output is deferred.
//------------------------------------------------------------------------------
#define BEGIN_DEFERRED_ANALOG_OUTPUTS(name)		\
	class  AnalogOutputs_##name					\
	{											\
	public:

//------------------------------------------------------------------------------
// Add a deferred analog output.
// Must be declared between BEGIN_DEFERRED_ANALOG_OUTPUTS and
// END_DEFERRED_ANALOG_OUTPUTS.
//------------------------------------------------------------------------------
#define DEFERRED_ANALOG_OUTPUT(name, pin)		\
    inline void setup##name()							\
	{													\
		pinMode(pin, OUTPUT);							\
	}													\
	inline void  direct_##name(unsigned char value) const		\
	{													\
		analogWrite(pin, value);						\
	}													\
	unsigned char name##Value = 0;						\
	inline void name(unsigned char value)				\
	{													\
		name##Value = value;							\
	}													\
	inline void name() const									\
	{													\
		direct_##name(name##Value);						\
	}

//------------------------------------------------------------------------------
// Start the routine that is called to apply changes that have been made.
//------------------------------------------------------------------------------
#define BEGIN_DEFER_ANALOG_OUTPUT_HANDLER(name)	\
		inline void name()								\
		{

//------------------------------------------------------------------------------
// Add an output (defined using DEFERRED_ANALOG_OUTPUT) to the above handler.
// Must be placed between BEGIN_DEFER_ANALOG_OUTPUT_HANDLER and
// END_DEFER_ANALOG_OUTPUT_HANDLER.
//------------------------------------------------------------------------------
#define APPLY_DEFERRED_ANALOG_OUTPUT(name)				\
			name();

//------------------------------------------------------------------------------
// End of the handler routine
//------------------------------------------------------------------------------
#define END_DEFER_ANALOG_OUTPUT_HANDLER }

//------------------------------------------------------------------------------
// Finish off the definition of the class and declare an instance.
//------------------------------------------------------------------------------
#define END_DEFERRED_ANALOG_OUTPUTS(name) } name;

#endif /* __ANALOGOUTPUT_HPP__ */
