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
		_top = -1;					\
	}								\
	void reset()					\
	{								\
		_top = -1;					\
	}								\
	void push (type val)			\
	{								\
		if (_top == size -1)		\
		{							\
			return;					\
		}							\
		_top++;						\
		_stack[_top] = val;			\
	}								\
	type pushn(int n)				\
	{								\
		if (_top + n > size)		\
			return -1;				\
		_top += n;					\
		return _top;				\
	}								\
	type pop()						\
	{								\
		if (_top < 0)				\
		{							\
			return -1;				\
		}							\
		return _stack[_top--];		\
	}								\
	int popn(int n)					\
	{								\
		if (n > (_top + 1))			\
		{							\
			return -1;				\
		}							\
		_top -= n;					\
		return _top;				\
	}								\
	type top ()						\
	{								\
		if (_top < 0)				\
		{							\
			return -1;				\
		}							\
		return _stack[_top];		\
	}								\
	type get(int i)					\
	{								\
		if (i > _top)				\
			return -1;				\
		return _stack[i];			\
	}								\
	void set(int i, type val)		\
	{								\
		if (i >= 0 && i <= _top)	\
			_stack[i] = val;		\
	}								\
protected:							\
	type	_stack[size];			\
public:								\
	int _top;						\
};

#define DECLARE_STACK(type, size, name)		\
Stack_##type##_##size name;

#endif //__STACK_H__