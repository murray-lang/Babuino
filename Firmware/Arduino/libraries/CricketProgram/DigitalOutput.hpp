#ifndef __DIGITALOUTPUT_HPP__
#define __DIGITALOUTPUT_HPP__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// The purpose of this code is to define a digital output pin directly into code
// space, hence avoiding the need to store pin numbers as a class member in RAM.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// BEGIN_DIGITAL_OUTPUTS defines an optional class for aggregating digital 
// outputs declared using the DIGITAL_OUTPUT() macro. This is a convenience for
// keeping related outputs together, but is NOT a prerequisite for using
// the DIGITAL_OUTPUT() macro - that can be used on its own.
//------------------------------------------------------------------------------
#define BEGIN_DIGITAL_OUTPUTS(name)						\
	class  DigitalOutputs_##name						\
	{													\
	public:

//------------------------------------------------------------------------------
// Give an output a name, an Arduino pin, the state deemed to mean "on" and the
// state deemed to mean "off"
// This macro can be used on its own or between BEGIN_DIGITAL_OUTPUTS and 
// END_DIGITAL_OUTPUTS.
//------------------------------------------------------------------------------
#define DIGITAL_OUTPUT(name, pin, onState, offState)		\
	inline void  name(bool value) const									\
	{																\
		digitalWrite(pin, value ? onState : offState);				\
	}																\
	inline void setup##name()											\
	{																\
		pinMode(pin, OUTPUT);										\
	}

//------------------------------------------------------------------------------
// Finish off the definition of the aggregating class and declare an instance
//------------------------------------------------------------------------------
#define END_DIGITAL_OUTPUTS(name) } name;


//------------------------------------------------------------------------------
// This class allows you to register changes in up to eight digital outputs, but
// to give effect to those changes at a later time. ie. the outputs are 
// deferred.
//------------------------------------------------------------------------------
class DeferredDigitalOutputBase
{
public:
	DeferredDigitalOutputBase()
	{
		_states      = 0;
		_isAvailable = 0;
	}
protected:
	inline bool getState(char index)
	{
		return (_states & (1 << index)) != 0;
	}

	inline void setState(char index, bool state)
	{
		_states &= ~(1 << index);   // Clear the bit first
		if (state)					// Now set it if required
			_states |= 1 << index;
		setAvailable(index, true);
	}

	inline bool getAvailable(char index)
	{
		return (_isAvailable & (1 << index)) != 0;
	}

	inline void setAvailable(char index, bool state)
	{
		_isAvailable &= ~(1 << index);  // Clear the bit first
		if (state)						// Now set it if required
			_isAvailable |= 1 << index;
	}
protected:
	unsigned char _states;
	unsigned char _isAvailable;
};

//------------------------------------------------------------------------------
// Begin the creation of an aggregation of up to eight deferred digital outputs.
//------------------------------------------------------------------------------
#define BEGIN_DEFERRED_DIGITAL_OUTPUTS(name)								\
	class DeferredDigitalOutput_##name : public DeferredDigitalOutputBase	\
	{																		\
	public:

//------------------------------------------------------------------------------
// Add a deferred output by name. Give it a unique index between 0 and 7
//------------------------------------------------------------------------------
#define DEFERRED_DIGITAL_OUTPUT(name, index)								\
		inline void name(bool state)										\
		{																	\
			setState(index, state);											\
		}

//------------------------------------------------------------------------------
// Start the handler to be called to apply stored digital output values
//------------------------------------------------------------------------------
#define BEGIN_DEFER_DIGITAL_OUTPUT_HANDLER(name)						\
		inline void name() const											\
		{

//------------------------------------------------------------------------------
// Add a deferred output to the handler
//------------------------------------------------------------------------------
#define APPLY_DEFERRED_DIGITAL_OUTPUT(outputs, name, index)					\
			if (getAvailable(index))										\
				outputs.name(getState(index));

//------------------------------------------------------------------------------
// End the handler routine
//------------------------------------------------------------------------------
#define END_DEFER_DIGITAL_OUTPUT_HANDLER }

//------------------------------------------------------------------------------
// Finish off the digital outputs aggregation class definition and declare an
// instance.
//------------------------------------------------------------------------------
#define END_DEFERRED_DIGITAL_OUTPUTS(name) } name;

#endif /* __DIGITALOUTPUT_HPP__ */
