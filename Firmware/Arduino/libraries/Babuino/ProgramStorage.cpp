#include "ProgramStorage.hpp"

const uint16_t ProgramStorage::INVALID_ADDRESS = ((uint16_t)~0);

// Force boolean storage to be 1 byte
template<> 
uint16_t 
ProgramStorage::read(uint16_t address, bool& val)
{
	uint8_t ui8;
	uint16_t addr = readByte(address, ui8);
	val = !!ui8;
	return addr;
}

template<> 
uint16_t 
ProgramStorage::write(uint16_t address, bool val)
{
	uint8_t ui8 = (uint8_t)val;
	return writeByte(address, ui8);
}
