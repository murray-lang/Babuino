bool 
Babuino::withStackPtr()
{
	STACKPTR location, index;
	STACKPTR  rhs;

	switch (_regs.opCode)
	{
	case OP_SET:
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &rhs);
		setStackPtr(_stack, location, rhs);
		return true;

	case OP_GET:
		popStackPtr(_stack, &location);
		getStackPtr(_stack, location, &rhs);
		pushStackPtr(_stack, rhs);
		return true;

	case OP_ASET:
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		popStackPtr(_stack, &rhs);
		setStackPtr(_stack, location + index * sizeof(STACKPTR), rhs);
		return true;

	case OP_AGET:
		popStackPtr(_stack, &location);
		popStackPtr(_stack, &index);
		getStackPtr(_stack, location + index * sizeof(STACKPTR), &rhs);
		pushStackPtr(_stack, rhs);
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output ");
			popStackPtr(_stack, &rhs);	// The return value
				// point to where the arguments size is on the stack.
			location = getArgsLocation();
			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// If the size > 0 then step over the size location too. 
				// Otherwise keep pointing to the same place because the return
				// value should overwrite where the arguments size would be. 
			if (argsSize > 0)
				argsSize += sizeof(uint8_t);
			setStackPtr(_stack, location - (uint16_t)argsSize - sizeof(STACKPTR), rhs);
		}
		return true;
#ifdef SUPPORT_STRING
	case OP_TOSTR:
		{
			//Serial.println("---tostr---");
			popStackPtr(_stack, &rhs);
				// ***KLUDGE WARNING***
				// Borrowing unused (hopefully) stack space as a buffer!
				// just to avoid having to allocate another buffer.
			
			char* psz = (char *)getTopAddress(_stack);
			utoa((unsigned int) rhs, psz, 10);
				// Logically this is wrong because I'm apparently 
				// pushing a string to a location that it already 
				// occupies. However, the stack implementation 
				// pushes strings onto a separate stack, then
				// pushes the location onto the main stack. So
				// the string doesn't get copied over itself, and
				// is already copied before the first characters are
				// overwritten by pushing the location pointer onto the
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
				STACKPTR tmp;
				popStackPtr(_stack, &tmp);
			}

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
				setStackPtr(_stack, location, getTop(_stack) - sizeof(STACKPTR));
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
	return false;
}
