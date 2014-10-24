#ifndef __VARIABLES_H__
#define __VARIABLES_H__

typedef enum
{
	TYPE_VOID		= -1,
	TYPE_UCHAR		= 0,
	TYPE_CHAR		= 1,
	TYPE_UINT16		= 2,
	TYPE_INT16		= 3,
	TYPE_UINT32		= 4,
	TYPE_INT32		= 5,
	TYPE_FLOAT		= 6,
	TYPE_DOUBLE 	= 7,
	TYPE_ARRAY  	= 0x8,
	TYPE_POINTER	= 0xF
} eType;

typedef struct
{
	eType type  : 4;	
	int   index : 12;	//ie. max 4096 bytes of addressable data
} VariableInfo;
#endif //__VARIABLES_H__