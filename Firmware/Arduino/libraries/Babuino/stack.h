#ifndef __STACK_H__
#define __STACK_H__

#include "configdefs.h"
#include <stddef.h>
#include <stdint.h>

typedef struct _STACKSTATE
{
	STACKPTR top;
	STACKPTR stringTop;
} STACKSTATE, *PSTACKSTATE;

extern void initStacks();

extern void*    allocateStack(size_t size);
extern void	    releaseStack(void* pstack);

extern void     initStack(void* pstack);

extern void*    getStackAddress(void* pstack, STACKPTR loc);
extern void*    getTopAddress(void* pstack);

extern void     setStackState(void* pstack, const PSTACKSTATE pState);
extern void     getStackState(void* pstack, PSTACKSTATE pState);
extern void     pushStackState(void* pstack, const PSTACKSTATE pState);
extern void     popStackState(void* pstack, PSTACKSTATE pState);


extern STACKPTR getTop(void* pstack);
extern STACKPTR setTop(void* pstack, STACKPTR newTop);

extern STACKPTR getStringTop(void* pstack); // Temporary for debugging

extern STACKPTR pushn(void* pstack, STACKPTR amount);
extern STACKPTR popn(void* pstack, STACKPTR amount);

extern STACKPTR pushUint8(void* pstack, uint8_t val);
extern STACKPTR popUint8(void* pstack, uint8_t* pval);
extern STACKPTR topUint8(void* pstack, uint8_t* pval);
extern STACKPTR getUint8(void* pstack, STACKPTR loc, uint8_t* pval);
extern STACKPTR setUint8(void* pstack, STACKPTR loc, uint8_t val);

extern STACKPTR pushStackPtr(void* pstack, STACKPTR val);
extern STACKPTR popStackPtr(void* pstack, STACKPTR* pval);
extern STACKPTR topStackPtr(void* pstack, STACKPTR* pval);
extern STACKPTR getStackPtr(void* pstack, STACKPTR loc, STACKPTR* pval);
extern STACKPTR setStackPtr(void* pstack, STACKPTR loc, STACKPTR val); 

extern STACKPTR pushUint16(void* pstack, uint16_t val);
extern STACKPTR popUint16(void* pstack, uint16_t* pval);
extern STACKPTR topUint16(void* pstack, uint16_t* pval);
extern STACKPTR getUint16(void* pstack, STACKPTR loc, uint16_t* pval);
extern STACKPTR setUint16(void* pstack, STACKPTR loc, uint16_t val);

#ifdef SUPPORT_32BIT
extern STACKPTR pushUint32(void* pstack, uint32_t val);
extern STACKPTR popUint32(void* pstack, uint32_t* pval);
extern STACKPTR topUint32(void* pstack, uint32_t* pval);
extern STACKPTR getUint32(void* pstack, STACKPTR loc, uint32_t* pval);
extern STACKPTR setUint32(void* pstack, STACKPTR loc, uint32_t val);
#endif

#ifdef SUPPORT_FLOAT
extern STACKPTR pushFloat(void* pstack, float val);
extern STACKPTR popFloat(void* pstack, float* pval);
extern STACKPTR topFloat(void* pstack, float* pval);
extern STACKPTR getFloat(void* pstack, STACKPTR loc, float* pval);
extern STACKPTR setFloat(void* pstack, STACKPTR loc, float val);
#endif

#ifdef SUPPORT_DOUBLE
extern STACKPTR pushDouble(void* pstack, double val);
extern STACKPTR popDouble(void* pstack, double* pval);
extern STACKPTR topDouble(void* pstack, double* pval);
extern STACKPTR getDouble(void* pstack, STACKPTR loc, double* pval);
extern STACKPTR setDouble(void* pstack, STACKPTR loc, double val);
#endif

#ifdef SUPPORT_STRING
extern STACKPTR pushString(void* pstack, uint8_t* psz);
extern STACKPTR popString(void* pstack);	// Throw it away
extern STACKPTR topString(void* pstack, uint8_t** ppsz);
extern STACKPTR getString(void* pstack, STACKPTR loc, uint8_t** ppsz);
extern STACKPTR setString(void* pstack, STACKPTR loc, uint8_t* psz);
#endif
 
#endif // __STACK_H__
