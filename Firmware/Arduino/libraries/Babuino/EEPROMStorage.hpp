#ifndef __EEPROMSTORAGE_HPP__
#define __EEPROMSTORAGE_HPP__

#include "ProgramStorage.hpp"


class EepromStorage : public ProgramStorage
{
public:
	virtual uint16_t getStartAddress()
	{
		return 0;
	}
	virtual uint16_t  readByte(uint16_t address, uint8_t& val);
	virtual uint16_t  readBytes(uint16_t address, uint8_t* buf, uint16_t len);

	virtual uint16_t  writeByte(uint16_t address, uint8_t val);
	virtual uint16_t  writeBytes(uint16_t address, uint8_t* buf, uint16_t len);
	
	virtual void     erase()
	{
		// Can't erase EEPROM from code!
	}
	virtual bool getReadyToRead()
	{
		return true; // For now. Haven't needed it so far
	}
	virtual bool getReadyToWrite(unsigned int requiredBytes)
	{
		return true; // For now. Haven't needed it so far
	}
	
};

#endif //__EEPROMSTORAGE_HPP__
