#ifndef __BABUINO_H__
#define __BABUINO_H__
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


#include <Arduino.h>
//#include <pins_arduino.h> 

#include "Program.hpp"
#include "Address.h"
//#include "Stack.hpp"
//#include "DownwardStack.hpp"
extern "C"
{
#include "stack.h"
}
#include "DigitalInput.hpp"
#include "DigitalOutput.hpp"
#include "AnalogOutput.hpp"

#include "Motors.hpp"
#include "SerialStream.hpp"
#include <Serial.h>

#ifdef __AVR__
#include "EEPROMStorage.hpp"
#elif __MSP430__
#include "FlashStorage.hpp"
#endif

#define LED_IDLE_PERIOD		4000
#define LED_RUN_PERIOD		 800


//------------------------------------------------------------------------------
// Some #defines from the original Babuino code have been put into these enums. 
//------------------------------------------------------------------------------
enum eMachineState { UNKNOWN, READY, COMM, RUN  };
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
enum eParity { PARITY_NONE, PARITY_ODD, PARITY_EVEN };
enum eTransport { TRANSPORT_SERIAL, TRANSPORT_ETHERNET };

//------------------------------------------------------------------------------
// A number of state variables from the original Babuino code have been stuffed
// into bit fields to save RAM. All of these occupy only one byte.
//------------------------------------------------------------------------------
struct _CricketProgramStates
{
	eMachineState    machineState    : 3;
	eCommState       commState	     : 2;
	eRunRequest      runRequest      : 1;
	bool             waitingCmd      : 1;
	unsigned int     unused          : 1;
};

struct _SerialParams
{
	uint8_t	stopbits	: 2;
	eParity parity		: 2;
	uint8_t databits	: 4;
};

struct _Registers
{
	Address		pc;			    // program counter
	uint8_t 	opCode;		    // Current instruction
	uint8_t		withCode;	    // Sets current data type for stack operations
	//STACKPTR  	localFrame;     // Saved onto the stack by procedures
	STACKSTATE  localFrame;
	STACKSTATE  checkPoint;			// Used to cleanup args for a function call 
	STACKPTR  	repcountLocation;	// Saved onto the stack by blocks
	uint8_t		blockDepthMask;		// One bit set to indicate block depth
	uint8_t     blocksExecuted;		// Bit set when block is run the first time
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

};

//------------------------------------------------------------------------------
// The Babuino logic has been placed into this class.
//------------------------------------------------------------------------------
class Babuino : public Program
{
public:
	Babuino(int startAddress);
	void reset();
	
	virtual bool setup();
	virtual int  run();
	void loop();
		
protected:
	void    doComm();
	void    code_exec();
	void    pushRegisters();
	void    popRegisters();
	STACKPTR getArgsLocation();
	void    beep() const;
	void    double_beep() const;
	int16_t readAnalog(uint8_t i);
	bool    readDigital(uint8_t i); 
	bool    writeAnalog(uint8_t i, uint8_t value);
	bool    writeDigital(uint8_t i, bool value); 

	void     i2cStart();
	void     i2cStop();
	void     i2cTxRx(uint16_t addr, uint8_t* txbuff, uint8_t txbufflen, uint8_t* rxbuff, uint8_t rxbufflen, uint16_t timeout);
	void     i2cRx(uint16_t addr, uint8_t* rxbuff, uint8_t rxbufflen, uint16_t timeout);
	uint32_t i2cErrors();

	bool withCurrentType();
	//template<class T> bool withInteger(uint8_t withCode);
	//template<class T> bool withFloatingPoint(uint8_t withCode);
	bool withUint8();
	bool withInt8();
	bool withStackPtr();
	bool withBool();

	bool withUint16();
	bool withInt16();

#ifdef SUPPORT_32BIT
	bool withUint32();
	bool withInt32();
#endif
#ifdef SUPPORT_FLOAT
	bool withFloat();
#endif
#ifdef SUPPORT_DOUBLE
	bool withDouble();
#endif
#ifdef SUPPORT_STRING
	bool withString();
#endif	

	bool withConfig();
	bool withMath();

	void setPinDirections(int dir);
	void configSerial();
	void configSend();
	void configSendSerial();
	void configSendEthernet();

	void descendBlock();
	void ascendBlock();
	void setBlockExecuted();
	bool hasBlockExecuted();

		// Throw away an item on the stack based on the "with" code.
	STACKPTR popValue(uint8_t withCode);	
	
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
	
	
		// There is currently nothing in the code to make this LED flash at 
		// different rates as the original Babuino code does. (TO DO)
	DIGITAL_OUTPUT(userLed, PIN_LED, HIGH, LOW)
		
	ANALOG_OUTPUT(piezoBeeper, PIN_BEEPER)

	
protected:
	//DownwardTypedStack				_stack;
	void*					_stack;
#ifdef __AVR__
	EepromStorage			_storage;
#elif __MSP430__
	FlashStorage			_storage;
#endif
	CricketProgramStates	_states;
	_Registers				_regs;
	//int						_globals[MAX_GLOBALS];
	//int						_temporaries[MAX_TEMPORARIES];
	uint16_t				_timerCount;
	Motors					_motors;
	Motors::Selected 		_selectedMotors;
	Stream*					_defaultStream;
};

#endif // __CRICKETPROGRAM_H__
