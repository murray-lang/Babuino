#ifndef __CRICKETPROGRAM_H__
#define __CRICKETPROGRAM_H__
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
// This is a privately developed, fully Arduino version of Babuino with no 
// official status.
//
// I wanted a pure Arduino sketch version of Babuino...
//		* so that it can run with no (or little) modification on any Arduino
//			board that I find suitable at a particular time for reasons of
//			economics and/or feature set.
//
//		* so that I can take full advantage of libraries and shields that have 
//			been developed by third parties for Arduino.
// 
// To this end I have avoided direct port manipulation and reprogramming 
// of timers. It will be less efficient than the original code, but I'm prepared
// to wear that until it presents practical problems.
// 
// Though the structure of the code has changed considerably, it owes its 
// existence to the the Babuino project AVR source code v033 by:
//           Adeilton Cavalcante de Oliveira Jr
// Furthermore the core handshaking, uploading and interpreter code is much as 
// Adeilton wrote it (though I accept full responsibility for any introduced
// bugs).
// 
// I cannot assign any more or less public rights to this code that Adeilton 
// assigned to his. Otherwise, I hope that others find it useful, and that its
// provenance is acknowledged.
//------------------------------------------------------------------------------

#include <Arduino.h>
//#include <pins_arduino.h> 
#include "Program.hpp"
#include "Stack.hpp"
#include "DigitalInput.hpp"
#include "DigitalOutput.hpp"
#include "AnalogInput.hpp"
#include "AnalogOutput.hpp"

#include "Motors.hpp"
#include "SerialStream.hpp"
#include <Serial.h>

#define LED_IDLE_PERIOD		4000
#define LED_RUN_PERIOD		 800

//------------------------------------------------------------------------------
// This is intended to simplify the manipulation of two-byte numbers.
// I'm starting to think that it's more trouble than it's worth.
//------------------------------------------------------------------------------
union ShortUnion2Bytes
{
	int asShort;
	struct
	{
		unsigned char lowByte;
		char          highByte;
	};

	inline operator int() 				{ return asShort; }
	inline ShortUnion2Bytes& operator ++()
	{
		asShort++;
		return *this;
	}
	inline ShortUnion2Bytes& operator --()
	{
		asShort--;
		return *this;
	}
	inline ShortUnion2Bytes& operator +=(int rhs)
	{
		asShort += rhs;
		return *this;
	}
	inline ShortUnion2Bytes& operator -=(int rhs)
	{
		asShort -= rhs;
		return *this;
	}
	inline bool operator == (int rhs) { return asShort == rhs; }
	inline bool operator < (int rhs)  { return asShort < rhs; }
	inline bool operator > (int rhs)  { return asShort > rhs; }
};
//------------------------------------------------------------------------------
// Some #defines from the original Babuino code have been put into these enums. 
//------------------------------------------------------------------------------
enum eMachineState { UNKNOWN, READY, COMM, RUN };
enum eCommState { COMM_IDLE, COMM_STARTED, COMM_FINISHED, COMM_TIMEOUT };
enum eRunRequest { STOPPED, RUNNING };
enum eCricketCommands
{
	cmdSetPointer		= 131,
	cmdReadBytes		= 132,
	cmdWriteBytes		= 133,
	cmdRun				= 134,
	cmdCricketCheck		= 135,
	cmdCricketCheckACK	= 55
};
enum eInterpreterMode { CRICKET_MODE, INEX_MODE };

//------------------------------------------------------------------------------
// A number of state variables from the original Babuino code have been stuffed
// into bit fields to save RAM. All of these occupy only one byte.
//------------------------------------------------------------------------------
struct _CricketProgramStates
{
	eMachineState    machineState    : 2;
	eCommState       commState	     : 2;
	eRunRequest      runRequest      : 1;
	bool             waitingCmd      : 1;
	eInterpreterMode interpreterMode : 1;
	unsigned int     unused          : 1;
};

//------------------------------------------------------------------------------
// A class to encapsulate the manipulation of program states.
//------------------------------------------------------------------------------
class CricketProgramStates : protected _CricketProgramStates
{
public:
	CricketProgramStates()
	{
		machineState    = READY;
		commState       = COMM_IDLE;
		runRequest      = STOPPED;
		interpreterMode = CRICKET_MODE;
	}

	inline eMachineState getMachineState() const
	{
		return machineState;
	}

	inline void setMachineState(eMachineState state)
	{
		machineState = state;
	}

	inline eCommState getCommState() const
	{
		return commState;
	}

	inline void setCommState(eCommState state)
	{
		commState = state;
	}

	inline eRunRequest getRunRequest() const
	{
		return runRequest;
	}

	inline void setRunRequest(eRunRequest state)
	{
		runRequest = state;
	}

	inline bool isWaitingCmd() const
	{
		return waitingCmd;
	}

	inline void setWaitingCmd(bool state)
	{
		waitingCmd = state;
	}
	
	inline eInterpreterMode getInterpreterMode() const
	{
		return interpreterMode;
	}

	inline void setInterpreterMode(eInterpreterMode mode)
	{
		interpreterMode = mode;
	}
};

//------------------------------------------------------------------------------
// The Babuino logic has been placed into this class.
//------------------------------------------------------------------------------
class CricketProgram : public Program
{
public:
	CricketProgram(int startAddress)
		: Program(startAddress)
	{
		_selectedMotors = Motors::MOTOR_NONE;
		_timerCount     = 0;
	}
	
	virtual bool setup();
	virtual int  run();
	void loop();
		
protected:
	void doComm();
	void code_exec();
	void beep() const;
	void double_beep() const;
	
	//void print_stack(); // debugging
	
	void oscillateLedIdle() const;
	void oscillateLedRun() const;
	
	void debounce()
	{
		_switches.debounce();
		if(_switches.isrunDebounced())
		{
			if (_switches.getrun())
			{
				_states.setRunRequest(RUNNING);
				_switches.clearrun();
			}
		}
	}

	// Declare resources
		// Change this if you want host communications to use something
		// else (eg. Serial1, Serial2, a Bluetooth shield or whatever)
	DECLARE_SERIAL_STREAM(Serial)
	
	DEFINE_STACK(int, STACK_SIZE)
	//DEFINE_STACK(int, LSTACK_SIZE)
	DECLARE_STACK(int, STACK_SIZE, _stack)
	//DECLARE_STACK(int, LSTACK_SIZE, _lstack)

	// The following declarations are designed to define pin usage directly
	// into code, rather than have lots of RAM used just to hold the pin
	// numbers.
	class SwitchInputs : protected DebouncerBase
	{
	public:
		DEBOUNCED_DIGITAL_INPUT(run, PIN_RUN, LOW, true, 0)
		inline void debounce()
		{
			ADD_TO_DEBOUNCE_HANDLER(run)
		}
	} _switches;
	
	class SensorInputs
	{
	public:
		ANALOG_INPUT(A, A2)
		ANALOG_INPUT(B, A3)
		ANALOG_INPUT(C, A4)
		ANALOG_INPUT(D, A5)
	} _sensors;
	
		// There is currently nothing in the code to make this LED flash at 
		// different rates as the original Babuino code does. (TO DO)
	DIGITAL_OUTPUT(userLed, PIN_LED, HIGH, LOW)
		
	ANALOG_OUTPUT(piezoBeeper, PIN_BEEPER)
	
	enum eOpCodes
	{
		OP_CODE_END 	= 0x00,	// ok
		OP_BYTE			= 0x01,	// x	try another code - seems OK - ??
		OP_NUMBER		= 0x02,	// <------ Testing - OK
		OP_BLOCK	 	= 0x03,	// Was OP_LIST
		OP_EOB		 	= 0x04,	// Was OP_EOL
		OP_EOLR	 		= 0x05,	// Seems OK?
		OP_LTHING		= 0x06,	// ok
		OP_STOP			= 0x07,	// ok
		OP_OUTPUT	 	= 0x08,	// ok
		OP_REPEAT	 	= 0x09,	// ok
		OP_IF		 	= 0x0A,	// ok
		OP_IFELSE		= 0x0B,	// <------ Testing - OK
		OP_BEEP 		= 0x0C,	// ok
		OP_NOTE			= 0x0D,
		OP_WAITUNTIL 	= 0x0E,	// <------ Testing - OK
		OP_LOOP	 		= 0x0F,	// ok
		OP_WAIT	 		= 0x10,	// ok
		OP_TIMER		= 0x11,	// <------ Testing - OK
		OP_RESETT		= 0x12,	// <------ Testing - OK
		OP_SEND	 		= 0x13,	// ok
		OP_IR			= 0x14,
		OP_NEWIR		= 0x15,
		OP_RANDOM	 	= 0x16,	// <------ Testing - OK
		OP_PLUS	 		= 0x17,	// ok
		OP_MINUS	 	= 0x18,	// ok
		OP_MUL			= 0x19,	// ok
		OP_DIV			= 0x1A,	// ok
		OP_REMAIN_DIV 	= 0x1B,	// <------ Testing - OK
		OP_EQUAL	 	= 0x1C,	// ok
		OP_GREATER_THAN = 0x1D,	// ok
		OP_LESS_THAN 	= 0x1E,	// ok
		OP_AND		 	= 0x1F,	// ok
		OP_OR		 	= 0x20,	// ok
		OP_XOR		 	= 0x21,	// ok
		OP_NOT		 	= 0x22,	// ok
		OP_SETGLOBAL 	= 0x23,	// ok
		OP_GLOBAL	 	= 0x24,	// ok
		OP_ASET	 		= 0x25,
		OP_AGET	 		= 0x26,
		OP_RECORD	 	= 0x27,	// ok
		OP_RECALL	 	= 0x28,	// ok
		OP_RESETDP	 	= 0x29,	// ok
		OP_SETDP	 	= 0x2A,	// ok
		OP_ERASE	 	= 0x2B,	// ok
		OP_WHEN	 		= 0x2C,	//
		OP_WHENOFF	 	= 0x2D,	//
		OP_SEL_A 		= 0x2E,	// ok
		OP_SEL_B 		= 0x2F,	// ok
		OP_SEL_AB 		= 0x30,	// ok
		OP_ON 			= 0x31,	// ok
		OP_ONFOR 		= 0x32,	// ok
		OP_OFF 			= 0x33,	// ok
		OP_THISWAY		= 0x34,	// ok
		OP_THATWAY		= 0x35,	// ok
		OP_RD			= 0x36,	// ok
		OP_SENSORA		= 0x37,	// ok
		OP_SENSORB		= 0x38,	// ok
		OP_SWITCHA		= 0x39,	// ok
		OP_SWITCHB		= 0x3A,	// ok
		OP_SETPOWER		= 0x3B,	// ok
		OP_BRAKE		= 0x3C,	// ok
		OP_BSEND		= 0x3D,
		OP_BSR			= 0x3E,
		OP_SEL_C 		= 0x3F,	// ok
		OP_SEL_D 		= 0x40,	// ok
		OP_SEL_CD 		= 0x41,	// ok
		OP_SEL_ABCD 	= 0x42,	// ok
		OP_FASTSEND 	= 0x43,
		OP_STOP1	 	= 0x44,	// ok
		OP_EB		 	= 0x45,
		OP_DB		 	= 0x46,
		OP_LOW_BYTE 	= 0x47,
		OP_HIGH_BYTE 	= 0x48,
		// Adding switches/sensors causes conflicts
		OP_SENSORC		= 0x49,
		OP_SENSORD		= 0x4A,
		OP_SWITCHC		= 0x4F,
		OP_SWITCHD		= 0x50,
		OP_LEDON		= 0x55,
		OP_LEDOFF		= 0x56,
		OP_SETSVH		= 87,
		OP_SVR			= 88,
		OP_SVL			= 89,
		OP_TALK_TO_MOTORS = 90,
		//---- new codes from here on ----
		OP_WHILE		= 128,
		OP_DO			= 129,
		OP_CALL			= 130,
		OP_LE			= 131,
		OP_GE			= 132,
		OP_NE			= 133,
		OP_SETLOCAL		= 134,
		OP_GETLOCAL		= 135,
		OP_SETTEMP		= 136,
		OP_GETTEMP		= 137,
		OP_GETPARAM		= 138,
		OP_GOTO			= 139,
		OP_FOR			= 140,		
		OP_RANDOMXY     = 141,
		OP_SENDN        = 142,
		OP_SERIALN      = 143,
		OP_NEWSERIALN   = 144,
		OP_SETSVHN      = 145,
		OP_SVRN			= 146,
		OP_SVLN			= 147,
		OP_SENSOR		= 148,
		OP_SWITCH		= 149,
		OP_PUSH			= 150,	//Raise the stack by the given amount
		OP_POP			= 151,	//Clear the top of the stack by the given amount
		OP_ENTER		= 152,
		OP_LEAVE		= 153
	};
	
protected:
	CricketProgramStates	_states;
	ShortUnion2Bytes		_address;
	int						_globals[MAX_GLOBALS];
	int						_temporaries[MAX_TEMPORARIES];
	unsigned int			_timerCount;
	Motors					_motors;
	Motors::Selected 		_selectedMotors;
};

#endif // __CRICKETPROGRAM_H__
