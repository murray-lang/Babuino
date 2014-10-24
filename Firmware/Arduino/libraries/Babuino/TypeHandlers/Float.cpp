bool 
Babuino::withFloat()
{
	STACKPTR location, index;
	float  rhs, lhs;

	switch (_regs.opCode)
	{
	case OP_SET:
		//Serial.println("---set---");
		popStackPtr(_stack, &location);
		popFloat(_stack, &rhs);
		setFloat(_stack, location, rhs);
		return true;

	case OP_GET:
		//Serial.println("---get---");
		popStackPtr(_stack, &location);
		getFloat(_stack, location, &rhs);
		pushFloat(_stack, rhs);
		return true;

	case OP_ASET:
		//Serial.println("---aset---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		popFloat(_stack, &rhs);
		setFloat(_stack, location + index * sizeof(float), rhs);
		return true;

	case OP_AGET:	
		//Serial.println("---aget---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		getFloat(_stack, location + index * sizeof(float), &rhs);
		pushFloat(_stack, rhs);
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output ");
			popFloat(_stack, &rhs);	// The return value
				// point where the arguments size is on the stack.
			location = getArgsLocation();
			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// If the size > 0 then step over the size location too. 
				// Otherwise keep pointing to the same place because the return
				// value should overwrite where the arguments size would be.
			if (argsSize > 0)
				argsSize += sizeof(uint8_t);
			setFloat(_stack, location - (STACKPTR)argsSize - sizeof(float), rhs);
		}
		return true;

	case OP_SEND:
		{
			//Serial.println("---send---");
			popFloat(_stack, &rhs);
			uint8_t nbuf[sizeof(float)];
			hton(rhs, nbuf);
			_defaultStream->write(nbuf, sizeof(float)); // Replaced for debugging
			//_defaultStream->print(rhs);
		}
		return true;

	case OP_SENDN:
		{
			//Serial.println("---sendn---");
			uint8_t items;
			uint8_t port;
			STACKPTR bufLoc;
			popUint8(_stack, &items);
			popUint8(_stack, &port);
			popStackPtr(_stack, &bufLoc); 
			float* buf = (float*)getStackAddress(_stack, bufLoc);
			uint8_t nbuf[sizeof(float)];
			for (int i = 0; i < items; i++)
			{
				rhs = *buf;
				hton(rhs, nbuf);
				//_defaultStream->write(nbuf, sizeof(float)); // Replaced for debugging
				_defaultStream->println(rhs);
				buf++;
			}
		}
		return true;
#ifdef SUPPORT_STRING
	case OP_TOSTR:
		{
			//Serial.println("---tostr---");
			popFloat(_stack, &rhs);
				// ***KLUDGE WARNING***
				// Borrowing unused (hopefully) stack space as a buffer!
				// just to avoid having to allocate another buffer.
			
			char* psz = (char *)getTopAddress(_stack);
			dtostrf((double)rhs, 5, 2, psz);
				// Logically this is wrong because I'm apparently 
				// pushing a string to a location that it already 
				// occupies. However, the stack implementation 
				// pushes strings onto a separate stack, then
				// pushes the location onto the main stack. So
				// the string doesn't get copied over itself, and
				// is already copied before the first characters are
				// overwritten by pushing the said location onto the
				// main stack.
			pushString(_stack, (uint8_t*)psz);
		}
		return true;
#endif
	case OP_FOREACH:
		{	
			//Serial.print("foreach ");
			PROGPTR blockAddr;
			popProgPtr(_stack, &blockAddr);		// Block address
			popStackPtr(_stack, &location);			// Iterator variable location (Variable contains a 'pointer')
			uint8_t itemsRemaining;
			popUint8(_stack, &itemsRemaining);			// Number of items remaining
				// If we've gone through the block then we need to pop the
				// previous list item off the stack
			if (hasBlockExecuted())
			{
				float tmp;
				popFloat(_stack, &tmp);
			}

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
				setStackPtr(_stack, location, getTop(_stack) - sizeof(float));
				_regs.pc = blockAddr;	// Point to the top of the block for the next iteration
				itemsRemaining--;					// Decrement the number of items remaining
				pushUint8(_stack, itemsRemaining);		// Save number of items remaining for next time
				pushStackPtr(_stack, location);		// Save iterator variable location for next time
				pushProgPtr(_stack, blockAddr);	// Save block address for next time
			}
			else
			{
				ascendBlock();			// Leaving. Pop the block.
			}
		}
		return true;
	}

	popFloat(_stack, &rhs);	// rhs

	switch (_regs.opCode)
	{
	case OP_ABS:
		pushFloat(_stack, (float)fabs((double)rhs));
		return true;
	case OP_NEG:
		pushFloat(_stack, -rhs);
		return true;
	case OP_MATH_SQR:
		pushFloat(_stack, rhs * rhs);
		return true;
	case OP_MATH_SQRT:
		pushFloat(_stack, (float)sqrt((double)rhs));
		return true;
	case OP_MATH_EXP:
		pushFloat(_stack, (float)exp((double)rhs));
		return true;
	case OP_MATH_SIN:
		//Serial.print("sin (");
		//Serial.print(rhs);
		//Serial.print(") ");
		pushFloat(_stack, (float)sin((double)rhs));
		return true;
	case OP_MATH_COS:
		pushFloat(_stack, (float)cos((double)rhs));
		return true;
	case OP_MATH_TAN:
		pushFloat(_stack, (float)tan((double)rhs));
		return true;
	case OP_MATH_ASIN:
		pushFloat(_stack, (float)asin((double)rhs));
		return true;
	case OP_MATH_ACOS:
		pushFloat(_stack, (float)acos((double)rhs));
		return true;
	case OP_MATH_ATAN:
		pushFloat(_stack, (float)atan((double)rhs));
		return true;
	case OP_MATH_SINH:
		pushFloat(_stack, (float)sinh((double)rhs));
		return true;
	case OP_MATH_COSH:
		pushFloat(_stack, (float)cosh((double)rhs));
		return true;
	case OP_MATH_TANH:
		pushFloat(_stack, (float)tanh((double)rhs));
		return true;
	case OP_MATH_LN:
		pushFloat(_stack, (float)log((double)rhs));
		return true;
	case OP_MATH_LOG10:
		pushFloat(_stack, (float)log10((double)rhs));
		return true;
	case OP_MATH_RND:
		pushFloat(_stack, (float)round((double)rhs));
		return true;
	case OP_MATH_TRUNC:
		pushFloat(_stack, (float)trunc((double)rhs));
		return true;
	case OP_MATH_FLOOR:
		pushFloat(_stack, (float)floor((double)rhs));
		return true;
	case OP_MATH_CEIL:
		pushFloat(_stack, (float)ceil((double)rhs));
		return true;
	case OP_MATH_ISNAN:
		pushFloat(_stack, (float)isnan((double)rhs));
		return true;
	case OP_MATH_ISINF:
		pushFloat(_stack, (float)isinf((double)rhs));
		return true;

	}

	popFloat(_stack, &lhs);	// lhs

	switch (_regs.opCode)
	{
	case OP_ADD:
		pushFloat(_stack, (float)(lhs + rhs));
		return true;

	case OP_SUB:
		pushFloat(_stack, (float)(lhs - rhs));
		return true;

	case OP_MUL:
		pushFloat(_stack, (float)(lhs * rhs));
		return true;

	case OP_DIV:
		//Serial.print("div (");
		//Serial.print(lhs);
		//Serial.print("/");
		//Serial.print(rhs);
		//Serial.print(") ");
		pushFloat(_stack, (float)(lhs / rhs));
		return true;

	case OP_MOD:
		pushFloat(_stack, (float)fmod((double)lhs, (double)rhs));
		return true;

	case OP_EQ:
		pushUint8(_stack, (uint8_t)(lhs == rhs));
		return true;

	case OP_GT:
		pushUint8(_stack, (uint8_t)(lhs > rhs));
		return true;

	case OP_LT:
		pushUint8(_stack, (uint8_t)(lhs < rhs));
		return true;

	case OP_LE:
		pushUint8(_stack, (uint8_t)(lhs <= rhs));
		return true;

	case OP_GE:
		pushUint8(_stack, (uint8_t)(lhs >= rhs));
		return true;

	case OP_NE:
		pushUint8(_stack, (uint8_t)(lhs != rhs));
		return true;
	
	case OP_MIN:
		pushFloat(_stack, (float)fmin((double)lhs, (double)rhs));
		return true;	
	case OP_MAX:
		pushFloat(_stack, (float)fmax((double)lhs, (double)rhs));
		return true;
	case OP_MATH_POW:
		pushFloat(_stack, (float)pow((double)lhs, (double)rhs));
		return true;
	case OP_MATH_HYPOT:
		pushFloat(_stack, (float)hypot((double)lhs, (double)rhs));
		return true;
	case OP_MATH_ATAN2:
		pushFloat(_stack, (float)atan2((double)lhs, (double)rhs));
		return true;
	}
	return false;
}
