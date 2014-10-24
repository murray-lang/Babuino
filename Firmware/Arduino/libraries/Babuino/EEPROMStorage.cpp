#include "EEPROMStorage.hpp"
#include "Endian.hpp"
#include "configdefs.h"

// Using Arduino EEPROM library rather than the AVR library so that, hopefully,
// the code could be used unmodified within a PIC (or other) Arduino 
// implementation.
// Actually Energia (MSP430 LaunchPad Arduino version) doesn't have EEPROM
#ifdef _HAS_EEPROM_
#include "../EEPROM/EEPROM.h"
#endif

uint16_t  
EepromStorage::readByte(uint16_t address, uint8_t& val)
{
#ifdef _HAS_EEPROM_
	val = EEPROM.read((int)address);
	return address + 1; 
#else
	return INVALID_ADDRESS;
#endif
}

uint16_t  
EepromStorage::readBytes(uint16_t address, uint8_t* buf, uint16_t len)
{
#ifdef _HAS_EEPROM_
	for (int i = 0; i < len; i++)
		buf[i] = EEPROM.read((int)address + i);
	return address + len;
#else
	return INVALID_ADDRESS;
#endif	
}


uint16_t      
EepromStorage::writeByte(uint16_t address, uint8_t value)
{
#ifdef _HAS_EEPROM_
	EEPROM.write((int)address, value);
	return address + 1;
#else
	return INVALID_ADDRESS;
#endif	
}

uint16_t      
EepromStorage::writeBytes(uint16_t address, uint8_t* buf, uint16_t len)
{
#ifdef _HAS_EEPROM_
	for (int i = 0; i < len; i++)
		EEPROM.write((int)address + i, buf[i]);
	return address + len;
#else
	return INVALID_ADDRESS;
#endif	
}

