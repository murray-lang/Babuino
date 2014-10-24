#ifndef __ADDRESS_H__
#define __ADDRESS_H__

#include <Arduino.h>
#include <stdint.h>
#include "configdefs.h"

class Address
{
public:
	Address()
	{
		_address = 0;
	}

	void set(PROGPTR val)
	{
		_address = val;
	}

	void set(uint8_t msb, uint8_t lsb)
	{
		_address = (PROGPTR)((msb << 8) + (lsb & 0xFF));
	}

	operator PROGPTR()
	{
		return _address;
	}

	void increment(int amt = 1)
	{
		_address += amt;
	}

	Address& operator = (PROGPTR val) 
	{ 
		_address = val;
		return *this;
	}

	Address& operator ++ (int) 
	{ 
		_address++; 
		return *this;
	}

	Address& operator -- (int) 
	{ 
		_address--;
		return *this; 
	}

	boolean operator == (PROGPTR rhs) 
	{ 
		return _address == rhs; 
	}

	boolean operator < (PROGPTR rhs)  
	{ 
		return _address < rhs; 
	}

	boolean operator > (PROGPTR rhs)  
	{ 
		return _address > rhs; 
	}
	
protected:
	PROGPTR _address;	
};

#endif // __ADDRESS_H__
