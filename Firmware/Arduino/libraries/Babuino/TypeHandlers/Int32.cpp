bool 
Babuino::withInt32()
{
	STACKPTR location, index;
	int32_t  rhs, lhs;

	switch (_regs.opCode)
	{
	case OP_ASHIFT:
	case OP_LSHIFT:
		{
			int8_t shift;
			popUint8(_stack, (uint8_t*)&shift);
			popUint32(_stack, (uint32_t*)&lhs);
			if (shift >= 0)
				pushUint32(_stack, (uint32_t)(lhs << shift));
			else
				pushUint32(_stack, (uint32_t)(lhs >> -shift));
			return true;
		}
	case OP_SET:
		//Serial.println("---set---");

		popStackPtr(_stack, &location);
		popUint32(_stack, (uint32_t*)&rhs);

		setUint32(_stack, location, (uint32_t)rhs);
		return true;

	case OP_GET:
		//Serial.println("---get---");
		popStackPtr(_stack, &location);
		getUint32(_stack, location, (uint32_t*)&rhs);
		pushUint32(_stack, (uint32_t)rhs);
		return true;

	case OP_ASET:
		//Serial.println("---aset---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		popUint32(_stack, (uint32_t*)&rhs);
		setUint32(_stack, location + index * sizeof(int32_t), (uint32_t)rhs);
		return true;

	case OP_AGET:
		//Serial.println("---aget---");
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		getUint32(_stack, location + index * sizeof(int32_t), (uint32_t*)&rhs);
		pushUint32(_stack, (uint32_t)rhs);
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output ");
			popUint32(_stack, (uint32_t*)&rhs);	// The return value
				// point to where the arguments size is on the stack.
			location = getArgsLocation();
			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// If the size > 0 then step over the size location too. 
				// Otherwise keep pointing to the same place because the return
				// value should overwrite where the arguments size would be. 
			if (argsSize > 0)
				argsSize += sizeof(uint8_t);
			setUint32(_stack, location - (STACKPTR)argsSize - sizeof(int32_t), (uint32_t)rhs);
		}
		return true;

	case OP_SEND:
		{
			//Serial.println("---send---");
			popUint32(_stack, (uint32_t*)&rhs);
			uint8_t buf[sizeof(int32_t)];
			hton(rhs, buf);
			//_defaultStream->write(nbuf, sizeof(int32_t)); // Replaced for debugging
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
			int32_t* buf = (int32_t*)getStackAddress(_stack, bufLoc);
			uint8_t nbuf[sizeof(int32_t)];
			for (int i = 0; i < items; i++)
			{
				rhs = *buf;
				hton(rhs, nbuf);
				//_defaultStream->write(nbuf, sizeof(int32_t)); // Replaced for debugging
				_defaultStream->print(rhs);
				buf++;
			}
		}
		return true;
#ifdef SUPPORT_STRING
	case OP_TOSTR:
		{
			//Serial.println("---tostr---");
			popUint32(_stack, (uint32_t*)&rhs);
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
				uint32_t tmpUint32;
				popUint32(_stack, &tmpUint32);
			}

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
				setStackPtr(_stack, location, getTop(_stack) - sizeof(int32_t));
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

	popUint32(_stack, (uint32_t*)&rhs);

	switch (_regs.opCode)
	{
	case OP_BITNOT:
		pushUint32(_stack, (uint32_t)~rhs);
		return true;

	case OP_ABS:
		pushUint32(_stack, (uint32_t)abs(rhs));
		return true;

	case OP_NEG:
		pushUint32(_stack, (uint32_t)-rhs);
		return true;
	}

	popUint32(_stack, (uint32_t*)&lhs);

	switch (_regs.opCode)
	{
	case OP_ADD:
		pushUint32(_stack, (uint32_t)(lhs + rhs));
		return true;

	case OP_SUB:
		pushUint32(_stack, (uint32_t)(lhs - rhs));
		return true;

	case OP_MUL:
		pushUint32(_stack, (uint32_t)(lhs * rhs));
		return true;

	case OP_DIV:
		pushUint32(_stack, (uint32_t)(lhs / rhs));
		return true;

	case OP_MOD:
		pushUint32(_stack, (uint32_t)(lhs % rhs));
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
		pushUint32(_stack, (uint32_t)(lhs & rhs));
		return true;

	case OP_BITOR:
		pushUint32(_stack, (uint32_t)(lhs | rhs));
		return true;

	case OP_BITXOR:
		pushUint32(_stack, (uint32_t)(lhs ^ rhs));
		return true;
	
	case OP_MIN:
		pushUint32(_stack, (uint32_t)min(lhs, rhs));
		return true;	
	case OP_MAX:
		pushUint32(_stack, (uint32_t)max(lhs, rhs));
		return true;
	}
	return false;
}
