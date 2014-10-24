bool 
Babuino::withDouble()
{
	STACKPTR location, index;
	double  rhs, lhs;

	switch (_regs.opCode)
	{
	case OP_SET:
		//Serial.println("---set---");
		popStackPtr(_stack, &location);
		popDouble(_stack, &rhs);
		setDouble(_stack, location, rhs);
		return true;

	case OP_GET:
		//Serial.println("---get---");
		popStackPtr(_stack, &location);
		getDouble(_stack, location, &rhs);
		pushDouble(_stack, rhs);
		return true;

	case OP_ASET:
		//Serial.println("---aset---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		popDouble(_stack, &rhs);
		setDouble(_stack, location + index * sizeof(double), rhs);
		return true;

	case OP_AGET:	
		//Serial.println("---aget---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		getDouble(_stack, location + index * sizeof(double), &rhs);
		pushDouble(_stack, rhs);
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output ");
			popDouble(_stack, &rhs);	// The return value
				// point where the arguments size is on the stack.
			location = getArgsLocation();
			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// If the size > 0 then step over the size location too. 
				// Otherwise keep pointing to the same place because the return
				// value should overwrite where the arguments size would be.
			if (argsSize > 0)
				argsSize += sizeof(uint8_t);
			setDouble(_stack, location - (STACKPTR)argsSize - sizeof(double), rhs);
		}
		return true;

	case OP_SEND:
		{
			//Serial.println("---send---");
			popDouble(_stack, &rhs);
			uint8_t nbuf[sizeof(double)];
			hton(rhs, nbuf);
			//_defaultStream->write(nbuf, sizeof(double)); // Replaced for debugging
			_defaultStream->print(rhs);
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
			double* buf = (double*)getStackAddress(_stack, bufLoc);
			uint8_t nbuf[sizeof(double)];
			for (int i = 0; i < items; i++)
			{
				rhs = *buf;
				hton(rhs, nbuf);
				//_defaultStream->write(nbuf, sizeof(double)); // Replaced for debugging
				_defaultStream->println(rhs);
				buf++;
			}
		}
		return true;
#ifdef SUPPORT_STRING
	case OP_TOSTR:
		{
			//Serial.println("---tostr---");
			popDouble(_stack, &rhs);
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
				double tmp;
				popDouble(_stack, &tmp);
			}

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
				setStackPtr(_stack, location, getTop(_stack) - sizeof(double));
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

	popDouble(_stack, &rhs);	// rhs

	switch (_regs.opCode)
	{
	case OP_ABS:
		pushDouble(_stack, (double)fabs((double)rhs));
		return true;
	case OP_NEG:
		pushDouble(_stack, -rhs);
		return true;
	case OP_MATH_SQR:
		pushDouble(_stack, rhs * rhs);
		return true;
	case OP_MATH_SQRT:
		pushDouble(_stack, (double)sqrt((double)rhs));
		return true;
	case OP_MATH_EXP:
		pushDouble(_stack, (double)exp((double)rhs));
		return true;
	case OP_MATH_SIN:
		//Serial.print("sin (");
		//Serial.print(rhs);
		//Serial.print(") ");
		pushDouble(_stack, (double)sin((double)rhs));
		return true;
	case OP_MATH_COS:
		pushDouble(_stack, (double)cos((double)rhs));
		return true;
	case OP_MATH_TAN:
		pushDouble(_stack, (double)tan((double)rhs));
		return true;
	case OP_MATH_ASIN:
		pushDouble(_stack, (double)asin((double)rhs));
		return true;
	case OP_MATH_ACOS:
		pushDouble(_stack, (double)acos((double)rhs));
		return true;
	case OP_MATH_ATAN:
		pushDouble(_stack, (double)atan((double)rhs));
		return true;
	case OP_MATH_SINH:
		pushDouble(_stack, (double)sinh((double)rhs));
		return true;
	case OP_MATH_COSH:
		pushDouble(_stack, (double)cosh((double)rhs));
		return true;
	case OP_MATH_TANH:
		pushDouble(_stack, (double)tanh((double)rhs));
		return true;
	case OP_MATH_LN:
		pushDouble(_stack, (double)log((double)rhs));
		return true;
	case OP_MATH_LOG10:
		pushDouble(_stack, (double)log10((double)rhs));
		return true;
	case OP_MATH_RND:
		pushDouble(_stack, (double)round((double)rhs));
		return true;
	case OP_MATH_TRUNC:
		pushDouble(_stack, (double)trunc((double)rhs));
		return true;
	case OP_MATH_FLOOR:
		pushDouble(_stack, (double)floor((double)rhs));
		return true;
	case OP_MATH_CEIL:
		pushDouble(_stack, (double)ceil((double)rhs));
		return true;
	case OP_MATH_ISNAN:
		pushDouble(_stack, (double)isnan((double)rhs));
		return true;
	case OP_MATH_ISINF:
		pushDouble(_stack, (double)isinf((double)rhs));
		return true;

	}

	popDouble(_stack, &lhs);	// lhs

	switch (_regs.opCode)
	{
	case OP_ADD:
		pushDouble(_stack, (double)(lhs + rhs));
		return true;

	case OP_SUB:
		pushDouble(_stack, (double)(lhs - rhs));
		return true;

	case OP_MUL:
		pushDouble(_stack, (double)(lhs * rhs));
		return true;

	case OP_DIV:
		//Serial.print("div (");
		//Serial.print(lhs);
		//Serial.print("/");
		//Serial.print(rhs);
		//Serial.print(") ");
		pushDouble(_stack, (double)(lhs / rhs));
		return true;

	case OP_MOD:
		pushDouble(_stack, (double)fmod((double)lhs, (double)rhs));
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
		pushDouble(_stack, (double)fmin((double)lhs, (double)rhs));
		return true;	
	case OP_MAX:
		pushDouble(_stack, (double)fmax((double)lhs, (double)rhs));
		return true;
	case OP_MATH_POW:
		pushDouble(_stack, (double)pow((double)lhs, (double)rhs));
		return true;
	case OP_MATH_HYPOT:
		pushDouble(_stack, (double)hypot((double)lhs, (double)rhs));
		return true;
	case OP_MATH_ATAN2:
		pushDouble(_stack, (double)atan2((double)lhs, (double)rhs));
		return true;
	}
	return false;
}
