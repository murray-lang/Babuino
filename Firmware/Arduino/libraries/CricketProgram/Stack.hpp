#ifndef __STACK_H__
#define __STACK_H__
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// Define a stack of a given type and size. 
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

#define DEFINE_STACK(type, size) 	\
class Stack_##type##_##size			\
{									\
public:								\
	Stack_##type##_##size()			\
	{								\
		_top = 0;					\
	}								\
	void reset()					\
	{								\
		_top = 0;					\
	}								\
	void push (type val)			\
	{								\
		_stack[_top] = val;			\
		_top++;						\
		if (_top > size)			\
		{							\
		}							\
	}								\
	type pop()						\
	{								\
		if (_top <= 0)				\
		{							\
			return -1;				\
		}							\
		return _stack[--_top];		\
	}								\
	type at(int i)					\
	{								\
		if (i < size)				\
			return _stack[i];		\
		return -1;					\
	}								\
protected:							\
	type	_stack[size];			\
	int _top;						\
};

#define DECLARE_STACK(type, size, name)		\
Stack_##type##_##size name;

#endif //__STACK_H__