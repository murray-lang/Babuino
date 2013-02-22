#ifndef __DIGITALINPUT_HPP__
#define __DIGITALINPUT_HPP__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// The purpose of this code is to define a digital input pin directly into code
// space, hence avoiding the need to store pin numbers as a class member in RAM.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

#define DEBOUNCE_DELAY 50

//------------------------------------------------------------------------------
// Please note that this debouncer code is a work in progress and has not been 
// exhaustively tested. It seems to work OK for the run button at this stage.
//------------------------------------------------------------------------------
class DebouncerBase
{
public:
	DebouncerBase()
	{
		_states          = 0;
		_candidateStates = 0;
		_isDebounced     = 0;
	}
protected:

	inline bool getState(char index) const
	{
		return (_states & (1 << index)) != 0;
	}

	inline void setState(char index, bool state)
	{
		_states &= ~(1 << index);   // Clear the bit first
		if (state)					// Now set it if required
			_states |= 1 << index;
		setDebounced(index, true);
	}

	inline bool getCandidateState(char index) const
	{
		return (_candidateStates & (1 << index)) != 0;
	}

	inline void setCandidateState(char index, bool state)
	{
		_candidateStates &= ~(1 << index);
		if (state)
			_candidateStates |= 1 << index;
	}
	
	inline bool isDebounced(char index) const
	{
		return (_isDebounced & (1 << index)) != 0;
	}

	inline void setDebounced(char index, bool debounced)
	{
		_isDebounced &= ~(1 << index);
		if (debounced)
			_isDebounced |= 1 << index;
	}

	inline unsigned char getTime() const
	{
			// Time is divided by 8 so that a byte can still represent a
			// reasonable delay before overflowing. Least significant bit
			// now represents 8ms.
		return (char)(millis() & 0xEF) >> 3 ;
	}

	inline unsigned int timeDifference(unsigned char before, unsigned char after) const
	{
		if (before <= after)	// normal - no overflow
		{
			return (unsigned int)(after - before);
		}
		else
		{
			return (unsigned int)((255 - before) + after); // Overflowed (assume only once)
		}
	}

	inline bool debounceTimeExpired(unsigned char before, unsigned char after) const
	{
		return (timeDifference(before, after) << 3) >= DEBOUNCE_DELAY;
	}


protected:
	volatile unsigned char _states;
	volatile unsigned char _candidateStates;
	volatile unsigned char _isDebounced;
};

//------------------------------------------------------------------------------
// BEGIN_DIGITAL_INPUTS defines an optional class for aggregating digital 
// inputs declared using the DIGITAL_INPUT() macro. This is a convenience for
// keeping related inputs together, but is NOT a prerequisite for using
// the DIGITAL_INPUT() macro - that can be used on its own.
// Debouncing is not supported, but this is fine in many cases.  
//------------------------------------------------------------------------------
#define BEGIN_DIGITAL_INPUTS(name)						\
	class  DigitalInputs_##name							\
	{													\
	public:

//------------------------------------------------------------------------------
// Digital inputs that need debouncing should be declared between 
// BEGIN_DEBOUNCED_DIGITAL_INPUTS and END_DEBOUNCED_DIGITAL_INPUTS. This will
// place them in an aggregating class that derives from DebouncerBase, which 
// provides the state information to debounce up to eight inputs.
// See CricketProgram.h for an example of its use.
//------------------------------------------------------------------------------
#define BEGIN_DEBOUNCED_DIGITAL_INPUTS(name)			\
	class  DigitalInputs_##name	: public DebouncerBase	\
	{													\
	public:
	
//------------------------------------------------------------------------------
// Name a pin, identify the Arduino pin number, and indicate which state is 
// deemed to mean "on". This macro can be used on its own.
//------------------------------------------------------------------------------
#define DIGITAL_INPUT(name, pin, onState)				\
	inline void setup##name()							\
	{													\
		pinMode(pin, INPUT);							\
		digitalWrite(pin, HIGH); 						\
	}													\
	inline bool  get##name() const						\
	{													\
		return digitalRead(pin) == onState;				\
	}
	
//------------------------------------------------------------------------------
// Name a pin, identify the Arduino pin number, indicate which state is deemed
// to be "on", indicate whether it latches into the on state and give it an
// index into the states maintained by DebouncerBase.
// This needs to be declared between BEGIN_DEBOUNCED_DIGITAL_INPUTS and 
// END_DEBOUNCED_DIGITAL_INPUTS.
//------------------------------------------------------------------------------
#define DEBOUNCED_DIGITAL_INPUT(name, pin, onState, latched, index)		\
	inline void setup##name()									\
	{															\
		pinMode(pin, INPUT);									\
		digitalWrite(pin, HIGH); 								\
	}															\
	inline bool  raw##name() const								\
	{															\
		return digitalRead(pin) == onState;						\
	}															\
	void debounce##name()										\
	{															\
		static unsigned char lastDebounceTime = 0;				\
		if (latched)											\
			if (isDebounced(index))								\
				if (getState(index))							\
					return;										\
    	unsigned char thisTime = getTime();						\
		bool rawState = raw##name();							\
		if (isDebounced(index))									\
		{														\
			if (rawState != getState(index))					\
			{													\
				setDebounced(index, false);						\
				lastDebounceTime = 0;							\
			}													\
		}														\
		if (   rawState != getCandidateState(index)				\
		    || lastDebounceTime == 0 )							\
		{														\
			lastDebounceTime = 	thisTime;						\
			setCandidateState(index, rawState);					\
		}														\
		if (debounceTimeExpired(lastDebounceTime, thisTime))	\
		{														\
			setState(index, rawState);							\
			lastDebounceTime = 0;								\
		}														\
	}															\
	inline void set##name##Debounced(bool debounced)			\
	{															\
		setDebounced(index, debounced);							\
	}															\
	inline bool is##name##Debounced()							\
	{															\
		return isDebounced(index);								\
	}															\
	inline bool get##name() const								\
	{															\
		return getState(index);									\
	}															\
	inline void clear##name()									\
	{															\
		setState(index, false);									\
	}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------	
#define DEBOUNCED_DIGITAL_INPUT_BLAH(name, pin, onState, latched, index)		\
	inline void setup##name()									\
	{															\
		pinMode(pin, INPUT);									\
		digitalWrite(pin, HIGH); 								\
	}															\
	inline bool  raw##name() const								\
	{															\
		return digitalRead(pin) == onState;						\
	}															\
	void debounce##name()										\
	{															\
		bool rawState = raw##name();							\
		digitalWrite(5, rawState ? HIGH : LOW);					\
	}															\
	inline void set##name##Debounced(bool debounced)			\
	{															\
		setDebounced(index, debounced);							\
	}															\
	inline bool is##name##Debounced()							\
	{															\
		return isDebounced(index);								\
	}															\
	inline bool get##name() const								\
	{															\
		return getState(index);									\
	}															\
	inline void clear##name()									\
	{															\
		setState(index, false);									\
	}

//------------------------------------------------------------------------------
// End the definition of the digital inputs aggregation and declare an instance.
//------------------------------------------------------------------------------
#define END_DIGITAL_INPUTS(name) } name;

//------------------------------------------------------------------------------
// Begin the routine that is called to debounce inputs.
// This should be placed between BEGIN_DEBOUNCED_DIGITAL_INPUTS and 
// END_DEBOUNCED_DIGITAL_INPUTS.
//------------------------------------------------------------------------------
#define BEGIN_DEBOUNCE_HANDLER(name)		\
	inline void name()						\
	{

//------------------------------------------------------------------------------
// Add a call to debounce a specific input.
// This should be placed between BEGIN_DEBOUNCE_HANDLER and END_DEBOUNCE_HANDLER
//------------------------------------------------------------------------------
#define ADD_TO_DEBOUNCE_HANDLER(name)		\
		debounce##name();

#define END_DEBOUNCE_HANDLER }


#endif /* __DIGITALINPUT_HPP__ */
