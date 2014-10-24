#include "Endian.hpp"

void 
hton(int16_t  val, uint8_t* bytes)
{
	hton((uint16_t)val, bytes);		
}

void 
hton(uint16_t val, uint8_t* bytes)
{
	bytes[0] = (uint8_t)((val >> 8) & 0xFF);
	bytes[1] = (uint8_t)(val & 0xFF);
}

void 
hton(int32_t  val, uint8_t* bytes)
{
	hton((uint32_t)val, bytes);
}

void
hton(uint32_t val, uint8_t* bytes)
{
	bytes[0] = (uint8_t)((val >> 24) & 0xFF);
	bytes[1] = (uint8_t)((val >> 16) & 0xFF);
	bytes[2] = (uint8_t)((val >> 8) & 0xFF);
	bytes[3] = (uint8_t)(val & 0xFF);
}

void 
hton(float val, uint8_t* bytes)
{
	union _fbytes
	{
		float f;
		uint8_t bytes[4];
	} fbytes;

	fbytes.f = val;
	bytes[0] = fbytes.bytes[3];
	bytes[1] = fbytes.bytes[2];
	bytes[2] = fbytes.bytes[1];
	bytes[3] = fbytes.bytes[0];
}

void 
hton(double val, uint8_t* bytes)
{
	union _dbytes
	{
		double d;
		uint8_t bytes[8];
	} dbytes;

	dbytes.d = val;
	bytes[0] = dbytes.bytes[7];
	bytes[1] = dbytes.bytes[6];
	bytes[2] = dbytes.bytes[5];
	bytes[3] = dbytes.bytes[4];
	bytes[4] = dbytes.bytes[3];
	bytes[5] = dbytes.bytes[2];
	bytes[6] = dbytes.bytes[1];
	bytes[7] = dbytes.bytes[0];
}


void 
ntoh(uint8_t* bytes, int16_t&  val)
{
	ntoh(bytes, (uint16_t&)val);
}

void 
ntoh(uint8_t* bytes, uint16_t& val)
{
	val = (uint16_t)(bytes[0] << 8) + (bytes[1] & 0xFF);
}

void 
ntoh(uint8_t* bytes, int32_t&  val)
{
	ntoh(bytes, (uint32_t&)val); 
}

void 
ntoh(uint8_t* bytes, uint32_t& val)
{
	val = (uint32_t)(bytes[0] << 24) 
		+ (uint32_t)(bytes[1] << 16) 
		+ (uint32_t)(bytes[2] << 8) 
		+ (bytes[3] & 0xFF);
}

void 
ntoh(uint8_t* bytes, float&    val)
{
	union _fbytes
	{
		float f;
		uint8_t bytes[4];
	} fbytes;

	fbytes.bytes[3] = bytes[0];
	fbytes.bytes[2] = bytes[1];
	fbytes.bytes[1] = bytes[2];
	fbytes.bytes[0] = bytes[3];
	val = fbytes.f;
}

void 
ntoh(uint8_t* bytes, double&   val)
{
	union _dbytes
	{
		double d;
		uint8_t bytes[8];
	} dbytes;

	dbytes.bytes[7] = bytes[0];
	dbytes.bytes[6] = bytes[1];
	dbytes.bytes[5] = bytes[2];
	dbytes.bytes[4] = bytes[3];
	dbytes.bytes[3] = bytes[4];
	dbytes.bytes[2] = bytes[5];
	dbytes.bytes[1] = bytes[6];
	dbytes.bytes[0] = bytes[7];
	val = dbytes.d;	
}

