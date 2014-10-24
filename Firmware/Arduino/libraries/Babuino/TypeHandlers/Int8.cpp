bool 
Babuino::withInt8()
{
	STACKPTR location, index;
	int8_t  rhs, lhs;

	switch (_regs.opCode)
	{
	case OP_ASHIFT:
	case OP_LSHIFT:
		{
			popUint8(_stack, (uint8_t*)&rhs);
			popUint8(_stack, (uint8_t*)&lhs);
			if (rhs >= 0)
				pushUint8(_stack, (uint8_t)(lhs << rhs));
			else
				pushUint8(_stack, (uint8_t)(lhs >> -rhs));
			return true;
		}

	case OP_SET:
		//Serial.println("---set---");

		popStackPtr(_stack, &location);
		popUint8(_stack, (uint8_t*)&rhs);

		setUint8(_stack, location, (uint8_t)rhs);
		return true;

	case OP_GET:
		//Serial.println("---get---");
		popStackPtr(_stack, &location);
		getUint8(_stack, location, (uint8_t*)&rhs);
		pushUint8(_stack, (uint8_t)rhs);
		return true;

	case OP_ASET:
		//Serial.println("---aset---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		popUint8(_stack, (uint8_t*)&rhs);
		setUint8(_stack, location + index * sizeof(uint8_t), (uint8_t)rhs);
		return true;

	case OP_AGET:
		//Serial.println("---aget---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		getUint8(_stack, location + index * sizeof(uint8_t), (uint8_t*)&rhs);
		pushUint8(_stack, (uint8_t)rhs);
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output ");
			popUint8(_stack, (uint8_t*)&rhs);	// The return value
				// point to where the arguments size is on the stack.
			location = getArgsLocation();
			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// If the size > 0 then step over the size location too. 
				// Otherwise keep pointing to the same place because the return
				// value should overwrite where the arguments size would be. 
			if (argsSize > 0)
				argsSize += sizeof(uint8_t);
			setUint8(_stack, location - (STACKPTR)argsSize - sizeof(int8_t), (uint8_t)rhs);
		}
		return true;

	case OP_SEND:
		{
			//Serial.println("---send---");
			popUint8(_stack, (uint8_t*)&rhs);
			//_defaultStream->write(rhs); // Replaced for debugging
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
			uint8_t* buf = (uint8_t*)getStackAddress(_stack, bufLoc);
			for (int i = 0; i < items; i++)
			{
				rhs = (int8_t)*buf;
				//_defaultStream->write(rhs); // Replaced for debugging
				_defaultStream->print(rhs);
				buf++;
			}
		}
		return true;
#ifdef SUPPORT_STRING
	case OP_TOSTR:
		{
			//Serial.println("---tostr---");
			popUint8(_stack, (uint8_t*)&rhs);
				// ***KLUDGE WARNING***
				// Borrowing unused (hopefully) stack space as a buffer!
				// just to avoid having to allocate another buffer.
			
			char* psz = (char *)getTopAddress(_stack);
			itoa((int) rhs, psz, 10);
				// Logically this is wrong because I'm apparently 
				// pushing a string to a location that it already 
				// occupies. However, the stack implementation 
				// pushes strings onto a separate stack, then
				// pushes the location onto the main stack. So
				// the string doesn't get copied over itself, and
				// is already copied before the first characters are
				// overwritten by pushing the said location onto the
				// main.
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
				uint8_t tmpUint8;
				popUint8(_stack, &tmpUint8);
			}

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
				setStackPtr(_stack, location, getTop(_stack) - sizeof(int8_t));
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

	popUint8(_stack, (uint8_t*)&rhs);

	switch (_regs.opCode)
	{
	case OP_BITNOT:
		pushUint8(_stack, (uint8_t)~rhs);
		return true;

	case OP_ABS:
		pushUint8(_stack, (uint8_t)abs(rhs));
		return true;

	case OP_NEG:
		pushUint8(_stack, (uint8_t)-rhs);
		return true;
	}

	popUint8(_stack, (uint8_t*)&lhs);

	switch (_regs.opCode)
	{
	case OP_ADD:
		pushUint8(_stack, (uint8_t)(lhs + rhs));
		return true;

	case OP_SUB:
		pushUint8(_stack, (uint8_t)(lhs - rhs));
		return true;

	case OP_MUL:
		pushUint8(_stack, (uint8_t)(lhs * rhs));
		return true;

	case OP_DIV:
		pushUint8(_stack, (uint8_t)(lhs / rhs));
		return true;

	case OP_MOD:
		pushUint8(_stack, (uint8_t)(lhs % rhs));
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

	case OP_BITAND:
		pushUint8(_stack, (uint8_t)(lhs & rhs));
		return true;

	case OP_BITOR:
		pushUint8(_stack, (uint8_t)(lhs | rhs));
		return true;

	case OP_BITXOR:
		pushUint8(_stack, (uint8_t)(lhs ^ rhs));
		return true;

	case OP_MIN:
		pushUint8(_stack, (uint8_t)min(lhs, rhs));
		return true;	
	case OP_MAX:
		pushUint8(_stack, (uint8_t)max(lhs, rhs));
		return true;
	}
	return false;
}
