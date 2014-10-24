#ifndef __PROGRAMSTORAGE_HPP__
#define __PROGRAMSTORAGE_HPP__

#include <Arduino.h>
#include <stdint.h>
#include "Endian.hpp"

class ProgramStorage
{
public:
	virtual uint16_t  getStartAddress() = 0;
	virtual uint16_t  readByte(uint16_t address, uint8_t& val) = 0;
	virtual uint16_t  readBytes(uint16_t address, uint8_t* buf, uint16_t len) = 0;

	template<class T> uint16_t read(uint16_t address, T& val)
	{
		uint8_t  buf[sizeof(T)];
		uint16_t addr = readBytes(address, buf, sizeof(T));
		if (addr != INVALID_ADDRESS)
			ntoh(buf, val);
		return addr;
	}

	virtual uint16_t writeByte(uint16_t address, uint8_t val) = 0;
	virtual uint16_t writeBytes(uint16_t address, uint8_t* buf, uint16_t len) = 0;

	template<class T> uint16_t write(uint16_t address, T val)
	{
		uint8_t  buf[sizeof(T)];
		hton(val, buf);
		return writeBytes(address, buf, sizeof(T));
	}

	virtual void    erase() = 0;
	
	virtual bool getReadyToRead() = 0;
	virtual bool getReadyToWrite(unsigned int requiredBytes) = 0;

	static const uint16_t INVALID_ADDRESS;
};

// Force boolean storage to be 1 byte
template<> uint16_t ProgramStorage::read(uint16_t address, bool& val);
template<> uint16_t ProgramStorage::write(uint16_t address, bool val);

#endif // __PROGRAMSTORAGE_HPP__

