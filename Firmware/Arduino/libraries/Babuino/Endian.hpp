#ifndef __ENDIAN_HPP__
#define __ENDIAN_HPP__

#include <stdint.h>

extern void hton(int16_t  val, uint8_t* bytes);
extern void hton(uint16_t val, uint8_t* bytes);
extern void hton(int32_t  val, uint8_t* bytes);
extern void hton(uint32_t val, uint8_t* bytes);
extern void hton(float    val, uint8_t* bytes);
extern void hton(double   val, uint8_t* bytes);

extern void ntoh(uint8_t* bytes, int16_t&  val);
extern void ntoh(uint8_t* bytes, uint16_t& val);
extern void ntoh(uint8_t* bytes, int32_t&  val);
extern void ntoh(uint8_t* bytes, uint32_t& val);
extern void ntoh(uint8_t* bytes, float&    val);
extern void ntoh(uint8_t* bytes, double&   val);

#endif // __ENDIAN_HPP__
