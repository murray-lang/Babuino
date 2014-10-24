#include "stack.h"
#include <stdbool.h> // for 'bool'

// Private stack structure
typedef struct _STACK
{
	uint8_t  stack[STACK_SIZE];		// The main stack grow upwards
	bool     available;
	STACKPTR top;
	STACKPTR stringTop;
} STACK, *PSTACK;

static STACK stacks[MAX_STACKS];

void 
initStack(void* pstack)
{
	((PSTACK)pstack)->available = true;
	((PSTACK)pstack)->top = 0;
	((PSTACK)pstack)->stringTop = STACK_SIZE;
	STACKPTR i;
	for (i = 0; i < STACK_SIZE; i++)
		((PSTACK)pstack)->stack[i] = 0;	
}

void 
initStacks()
{
	int i;
	for (i = 0; i < MAX_STACKS; i ++)
		initStack((void*)&stacks[i]);
}

void* 
allocateStack(size_t size)
{
	int i;
	for (i = 0; i < MAX_STACKS; i ++)
	{
		if (stacks[i].available)
		{
			stacks[i].available = false;
			return (void*)&stacks[i];
		}
	}
	return 0;
}

void	  
releaseStack(void* pstack)
{
	STACKPTR i;
	for (i = 0; i < MAX_STACKS; i ++)
	{
		if (pstack == (void*)&stacks[i])
		{
			initStack(pstack);
			break;
		}
	}
}

void    
setStackState(void* pstack, const PSTACKSTATE pState)
{
	((PSTACK)pstack)->top       = pState->top;
	((PSTACK)pstack)->stringTop = pState->stringTop;	
}

void     
getStackState(void* pstack, PSTACKSTATE pState)
{
	pState->top       = ((PSTACK)pstack)->top;
	pState->stringTop = ((PSTACK)pstack)->stringTop;
}

void     
pushStackState(void* pstack, const PSTACKSTATE pState)
{
	pushStackPtr(pstack, pState->top);
	pushStackPtr(pstack, pState->stringTop);
}

void     
popStackState(void* pstack, PSTACKSTATE pState)
{
	popStackPtr(pstack, &pState->stringTop);
	popStackPtr(pstack, &pState->top);
}

STACKPTR 
pushn(void* pstack, STACKPTR amount)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > (STACK_SIZE - amount))
		return INVALID_STACKPTR;
#endif
	((PSTACK)pstack)->top += amount;
	return ((PSTACK)pstack)->top;
}

STACKPTR 
popn(void* pstack, STACKPTR amount)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < amount)
		return ~0;
#endif
	((PSTACK)pstack)->top -= amount;
	return ((PSTACK)pstack)->top;
}

STACKPTR 
getTop(void* pstack)
{
	return ((PSTACK)pstack)->top;
}

STACKPTR 
setTop(void* pstack, STACKPTR newTop)
{
#ifdef STACK_CHECKED
	if (newTop > STACK_SIZE || newTop < 0)
		return INVALID_STACKPTR;
#endif
	((PSTACK)pstack)->top = newTop;
	return newTop;
}

// Temporary for debugging
STACKPTR 
getStringTop(void* pstack)
{
	return ((PSTACK)pstack)->stringTop;	
}

void*    
getStackAddress(void* pstack, STACKPTR loc)
{
	return &((PSTACK)pstack)->stack[loc];
}

void*    
getTopAddress(void* pstack)
{
	return &((PSTACK)pstack)->stack[((PSTACK)pstack)->top];
}


STACKPTR 
pushUint8(void* pstack, uint8_t val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - 1)
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	((PSTACK)pstack)->stack[whereItWent] = val;
	((PSTACK)pstack)->top++;
	
	return whereItWent;	
}

STACKPTR popUint8(void* pstack, uint8_t* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < 1)
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top--;
	*pval = ((PSTACK)pstack)->stack[((PSTACK)pstack)->top];
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topUint8(void* pstack, uint8_t* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - 1;
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = ((PSTACK)pstack)->stack[pos];
	return pos;	
}

STACKPTR getUint8(void* pstack, STACKPTR loc, uint8_t* pval)
{
#ifdef STACK_CHECKED
	if (loc + 1 > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = ((PSTACK)pstack)->stack[loc];
	return loc;
}

STACKPTR setUint8(void* pstack, STACKPTR loc, uint8_t val)
{
#ifdef STACK_CHECKED
	if (loc + 1 > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->stack[loc] = val;
	return loc;
}

STACKPTR pushStackPtr(void* pstack, STACKPTR val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - sizeof(STACKPTR))
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	*((STACKPTR*)&((PSTACK)pstack)->stack[whereItWent]) = val;
	((PSTACK)pstack)->top += sizeof(STACKPTR);
	
	return whereItWent;	
}

STACKPTR popStackPtr(void* pstack, STACKPTR* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < sizeof(STACKPTR))
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top -= sizeof(STACKPTR);
	*pval =*((STACKPTR*)&((PSTACK)pstack)->stack[((PSTACK)pstack)->top]);
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topStackPtr(void* pstack, STACKPTR* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - sizeof(STACKPTR);
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = *((STACKPTR*)&((PSTACK)pstack)->stack[pos]);
	return pos;
}

STACKPTR getStackPtr(void* pstack, STACKPTR loc, STACKPTR* pval)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(STACKPTR) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = *((STACKPTR*)&((PSTACK)pstack)->stack[loc]);
	return loc;
}

STACKPTR setStackPtr(void* pstack, STACKPTR loc, STACKPTR val)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(STACKPTR) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	*((STACKPTR*)&((PSTACK)pstack)->stack[loc]) = val;
	return loc;
}


STACKPTR pushUint16(void* pstack, uint16_t val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - sizeof(uint16_t))
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	*((uint16_t*)&((PSTACK)pstack)->stack[whereItWent]) = val;
	((PSTACK)pstack)->top += sizeof(uint16_t);
	
	return whereItWent;
}

STACKPTR popUint16(void* pstack, uint16_t* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < sizeof(uint16_t))
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top -= sizeof(uint16_t);
	*pval =*((uint16_t*)&((PSTACK)pstack)->stack[((PSTACK)pstack)->top]);
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topUint16(void* pstack, uint16_t* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - sizeof(uint16_t);
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = *((uint16_t*)&((PSTACK)pstack)->stack[pos]);
	return pos;
}

STACKPTR getUint16(void* pstack, STACKPTR loc, uint16_t* pval)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(uint16_t) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = *((uint16_t*)&((PSTACK)pstack)->stack[loc]);
	return loc;
}

STACKPTR setUint16(void* pstack, STACKPTR loc, uint16_t val)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(uint16_t) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	*((uint16_t*)&((PSTACK)pstack)->stack[loc]) = val;
	return loc;
}

#ifdef SUPPORT_32BIT
STACKPTR pushUint32(void* pstack, uint32_t val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - sizeof(uint32_t))
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	*((uint32_t*)&((PSTACK)pstack)->stack[whereItWent]) = val;
	((PSTACK)pstack)->top += sizeof(uint32_t);
	
	return whereItWent;
}

STACKPTR popUint32(void* pstack, uint32_t* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < sizeof(uint32_t))
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top -= sizeof(uint32_t);
	*pval =*((uint32_t*)&((PSTACK)pstack)->stack[((PSTACK)pstack)->top]);
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topUint32(void* pstack, uint32_t* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - sizeof(uint32_t);
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = *((uint32_t*)&((PSTACK)pstack)->stack[pos]);
	return pos;
}

STACKPTR getUint32(void* pstack, STACKPTR loc, uint32_t* pval)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(uint32_t) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = *((uint32_t*)&((PSTACK)pstack)->stack[loc]);
	return loc;
}

STACKPTR setUint32(void* pstack, STACKPTR loc, uint32_t val)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(uint32_t) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	*((uint32_t*)&((PSTACK)pstack)->stack[loc]) = val;
	return loc;
}

#endif

#ifdef SUPPORT_FLOAT
STACKPTR pushFloat(void* pstack, float val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - sizeof(float))
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	*((float*)&((PSTACK)pstack)->stack[whereItWent]) = val;
	((PSTACK)pstack)->top += sizeof(uint32_t);
	
	return whereItWent;
}

STACKPTR popFloat(void* pstack, float* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < sizeof(float))
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top -= sizeof(float);
	*pval =*((float*)&((PSTACK)pstack)->stack[((PSTACK)pstack)->top]);
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topFloat(void* pstack, float* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - sizeof(float);
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = *((float*)&((PSTACK)pstack)->stack[pos]);
	return pos;
}

STACKPTR getFloat(void* pstack, STACKPTR loc, float* pval)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(float) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = *((float*)&((PSTACK)pstack)->stack[loc]);
	return loc;
}

STACKPTR setFloat(void* pstack, STACKPTR loc, float val)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(float) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	*((float*)&((PSTACK)pstack)->stack[loc]) = val;
	return loc;
}

#endif

#ifdef SUPPORT_DOUBLE
STACKPTR pushDouble(void* pstack, double val)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top > STACK_SIZE - sizeof(double))
		return INVALID_STACKPTR;
#endif
	STACKPTR whereItWent = ((PSTACK)pstack)->top;	
	*((double*)&((PSTACK)pstack)->stack[whereItWent]) = val;
	((PSTACK)pstack)->top += sizeof(uint32_t);
	
	return whereItWent;
}

STACKPTR popDouble(void* pstack, double* pval)
{
#ifdef STACK_CHECKED
	if (((PSTACK)pstack)->top < sizeof(double))
		return INVALID_STACKPTR;
#endif	
	((PSTACK)pstack)->top -= sizeof(double);
	*pval =*((double*)&((PSTACK)pstack)->stack[((PSTACK)pstack)->top]);
	
	return ((PSTACK)pstack)->top;
}

STACKPTR topDouble(void* pstack, double* pval)
{
	STACKPTR pos = ((PSTACK)pstack)->top - sizeof(double);
#ifdef STACK_CHECKED
	if (pos < 0)
		return INVALID_STACKPTR;	
#endif
	*pval = *((double*)&((PSTACK)pstack)->stack[pos]);
	return pos;
}

STACKPTR getDouble(void* pstack, STACKPTR loc, double* pval)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(double) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif
	*pval = *((double*)&((PSTACK)pstack)->stack[loc]);
	return loc;
}

STACKPTR setDouble(void* pstack, STACKPTR loc, double val)
{
#ifdef STACK_CHECKED
	if (loc + sizeof(float) > ((PSTACK)pstack)->top || loc < 0)
		return INVALID_STACKPTR;
#endif	
	*((float*)&((PSTACK)pstack)->stack[loc]) = val;
	return loc;
}

#endif

#ifdef SUPPORT_STRING

STACKPTR _pushChar(PSTACK pstack, uint8_t ch)
{
#ifdef STACK_CHECKED
	if (pstack->stringTop < 1)
		return INVALID_STACKPTR;
#endif	
	pstack->stringTop--;
	pstack->stack[pstack->stringTop] = ch;
	
	return pstack->stringTop;
}

STACKPTR _popChar(PSTACK pstack, uint8_t* ch)
{
#ifdef STACK_CHECKED
	if (pstack->stringTop > STACK_SIZE - 1)
		return INVALID_STACKPTR;
#endif	
	*ch = pstack->stack[pstack->stringTop];
	pstack->stringTop++;
	return pstack->stringTop;

}

STACKPTR _setChar(PSTACK pstack, STACKPTR loc, uint8_t ch)
{
#ifdef STACK_CHECKED
	if (loc > STACK_SIZE - 1)
		return INVALID_STACKPTR;
#endif
	pstack->stack[loc] = ch;	
	return loc;
}

STACKPTR _pushString(PSTACK pstack, uint8_t* psz)
{
		// Avoiding string.h for now
	uint16_t  length  = 0;	
	uint8_t * pszTemp = psz;
	while (*pszTemp++)
		length++;
#ifdef STACK_CHECKED
	if (pstack->stringTop < length)
		return INVALID_STACKPTR;
#endif
		// Push the terminating 0 regardless of length
	while (--pszTemp >= psz)
		_pushChar(pstack, *pszTemp);

	return pstack->stringTop; // (changed by _pushChar() )
}

STACKPTR _popString(PSTACK pstack)
{
	uint8_t next;
	uint16_t pos;
	do
	{
		pos = _popChar(pstack, &next);
	}
	while (next != 0 && pos != INVALID_STACKPTR);
	return pstack->stringTop;
}

STACKPTR _topString(PSTACK pstack, uint8_t** ppsz)
{
	*ppsz = (uint8_t*)getStackAddress(pstack, pstack->stringTop);
	return pstack->stringTop;
}

STACKPTR _getString(PSTACK pstack, STACKPTR loc, uint8_t** ppsz)
{
	*ppsz = (uint8_t*)getStackAddress(pstack, loc);
	return loc;
}

STACKPTR _setString(PSTACK pstack, STACKPTR loc, uint8_t* psz)
{
	STACKPTR next = loc;
	do
	{
		_setChar(pstack, next++, *psz);
	}
	while (*psz++);

	return loc;
}


STACKPTR pushString(void* pstack, uint8_t* psz)
{
		// Push the string onto the downward growing stack first
	STACKPTR strLoc = _pushString((PSTACK)pstack, psz);
#ifdef STACK_CHECKED
	if (strLoc == INVALID_STACKPTR)
		return INVALID_STACKPTR;
#endif
		// Now push the string's offset onto the main stack
	return pushStackPtr(pstack, strLoc);

}

STACKPTR popString(void* pstack)
{
		// Simply pop from both stacks
	_popString((PSTACK)pstack);
	STACKPTR tmp;
	return popStackPtr(pstack, &tmp);
}

STACKPTR topString(void* pstack, uint8_t** ppsz)
{
		// ***NOTE***
		// In order to support the current scheme for returning strings from
		// functions, we have to use the pointer on the main stack to point
		// to the string rather than assume that it's at the top of the string
		// stack. (The string could actually be in zombie land beyond the top
		// of the string stack.)
		// Get the pointer from the mainstack
	STACKPTR strPtr;
	topStackPtr(pstack, &strPtr);
		// Get the string from the string stack
	_getString((PSTACK)pstack, strPtr, ppsz);
	return strPtr;
}

STACKPTR getString(void* pstack, STACKPTR loc, uint8_t** ppsz)
{
		// Get the location of the string in the string stack from the given
		// location in the main stack
	STACKPTR strLoc;
#ifdef STACK_CHECKED
	STACKPTR tmpLoc = getStackPtr(pstack, loc, &strLoc);
	if (tmpLoc == INVALID_STACKPTR)
		return INVALID_STACKPTR;
	tmpLoc = _getString((PSTACK)pstack, strLoc, ppsz);
	if (tmpLoc == INVALID_STACKPTR)
		return INVALID_STACKPTR;
#else
	getStackPtr(pstack, loc, &strLoc);
	_getString((PSTACK)pstack, strLoc, ppsz);
#endif
	return loc;
}

STACKPTR setString(void* pstack, STACKPTR loc, uint8_t* psz)
{
		// Get the location of the string in the string stack from the given
		// location in the main stack
	STACKPTR strLoc;
#ifdef STACK_CHECKED
	STACKPTR tmpLoc = getStackPtr(pstack, loc, &strLoc);
	if (tmpLoc == INVALID_STACKPTR)
		return INVALID_STACKPTR;
	tmpLoc = _setString((PSTACK)pstack, strLoc, psz);
	if (tmpLoc == INVALID_STACKPTR)
		return INVALID_STACKPTR;
#else
	getStackPtr(pstack, loc, &strLoc);
	_setString((PSTACK)pstack, strLoc, psz);
#endif
	return loc;
}

#endif

