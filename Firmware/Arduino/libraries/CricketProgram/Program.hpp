#ifndef __PROGRAM_HPP__
#define __PROGRAM_HPP__
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
// Program base class. A place to put functionality that would be common to
// many programs.   
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

// Using Arduino EEPROM library rather than the AVR library so that, hopefully,
// the code could be used unmodified within a PIC (or other) Arduino 
// implementation.
#include "../EEPROM/EEPROM.h"
#include <Serial.h>

class Program
{
public:
	Program(int startAddress)
	{
		_startAddress	= startAddress;
		_pc				= startAddress;
	}
	
	virtual bool setup() = 0;
	virtual int  run() = 0;
	
protected:

	inline uint8_t eepromReadByte(int address)
	{
		uint8_t temp = EEPROM.read(address);
		//Serial.println((int)temp);
		return temp; //EEPROM.read(address);
	}
	
	inline int eepromReadInt(int address)
	{
		uint8_t temp1 = EEPROM.read(address);
		uint8_t temp2 = EEPROM.read(address + 1);
		
		return (temp1<<8) + (temp2&0xFF);
	}
	
    void eepromWriteByte(int address, uint8_t value)
	{
		EEPROM.write(address, value);
	}
	
	void eepromWriteInt(int address, int value)
	{
		EEPROM.write(address, (uint8_t)(value >> 8));
		EEPROM.write(address + 1, (uint8_t)(value & 0xFF));
	}
	
protected:
		// These members are a vestige of the design process and haven't 
		// actually come into use yet.
	int		_startAddress;	// Program binary
	int		_pc;			// Program Counter
};




#endif // __PROGRAM_HPP__
