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

protected:
	volatile unsigned char _states;
	volatile unsigned char _candidateStates;
	volatile unsigned char _isDebounced;
};


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
		static unsigned long lastDebounceTime = 0;				\
		if (latched)											\
			if (isDebounced(index))								\
				if (getState(index))							\
					return;										\
    	unsigned long thisTime = millis();						\
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
		if ((thisTime - lastDebounceTime) > DEBOUNCE_DELAY)		\
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
// Add a call to debounce a specific input.
//------------------------------------------------------------------------------
#define ADD_TO_DEBOUNCE_HANDLER(name)		\
		debounce##name();

#endif /* __DIGITALINPUT_HPP__ */
