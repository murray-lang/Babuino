bool 
Babuino::withString()
{
	//Serial.println("---withstring---");
	STACKPTR location;
	uint8_t* psz;

	switch (_regs.opCode)
	{
	case OP_SET:
		{
			//Serial.print("set ");
			popStackPtr(_stack, &location);
				// Copy the string directly from the stack top to avoid the need
				// for another buffer.
			topString(_stack, &psz);
			//Serial.print((char*)psz); Serial.print("("); Serial.print((uint16_t)psz); Serial.println(")");
			setString(_stack, location, psz);
			popString(_stack);	// Now dispose of the string at the top
		}
		return true;

	case OP_GET:
		{
			//Serial.print("get ");
			popStackPtr(_stack, &location);
			getString(_stack, location, &psz);
			//Serial.print((char*)psz); Serial.print("("); Serial.print((uint16_t)psz); Serial.println(")");
			pushString(_stack, psz);
		}
		return true;

	case OP_SEND:
		{
			//Serial.print("send ");
			topString(_stack, &psz);
			//Serial.print((const char*)psz);
			//Serial.println("\"");
			_defaultStream->write((const char*)psz);
			//Serial.print("' [");
			//Serial.print(getStringTop(_stack));
			//Serial.print(" ("); Serial.print((uint16_t)psz); Serial.print(")"); 
			popString(_stack);
		
			//Serial.print(", "); Serial.print(getStringTop(_stack)); Serial.println("]");
		}
		return true;

	case OP_OUTPUT:
		{
			//Serial.print("output: ");
			STACKPTR strPtr;
				// The return string is at the top of the stack, but what's
				// actually on top of the stack is a stack pointer to the 
				// string on a separate hidden stack. This pointer is what
				// will be returned.
			topStackPtr(_stack, &strPtr);	// The return value
			uint8_t* psz;
			topString(_stack, &psz);
			//Serial.print((char*)psz);
			//Serial.print(" [");
			//Serial.print(getStringTop(_stack));
			//Serial.print(", ");	
				// ***NOTE CAREFULLY - BAD STUFF***
				// We need to pop the string because the calling code expects 
				// the parameters that it pushed to be at the top of the stack
				// when the function returns. 
				// However, the string will actually still exist in the land of
				// the dead beyond the stack top. The pointer we obtained above 
				// still points to it.
			popString(_stack);
			//Serial.print(getStringTop(_stack));
			//Serial.print("] "); Serial.print(strPtr); Serial.print("->"); 
			//Serial.print((uint16_t)getStackAddress(_stack, strPtr)); 
				// point to where the arguments size is on the stack.
			location = getArgsLocation();

			uint8_t argsSize;
			getUint8(_stack, location - sizeof(uint8_t), &argsSize); // Get size of args. 
				// Functions that return strings must always have the args size
				// byte supplied. Also add the size of the arg size byte itself. 
			argsSize += sizeof(uint8_t);
				// Replace the string pointer in the return value location with 
				// the one that points to the return string.
			//Serial.print("->"); Serial.println(location - (STACKPTR)argsSize - sizeof(STACKPTR));
			setStackPtr(_stack, location - (STACKPTR)argsSize - sizeof(STACKPTR), strPtr);
		}
		return true;

	case OP_FOREACH:
		{	
			//Serial.println("---foreach---");
			PROGPTR blockAddr;
			popProgPtr(_stack, &blockAddr);		// Block address
			//Serial.println(location);
			popStackPtr(_stack, &location);  // Iterator variable location (Variable contains a 'pointer')
			//Serial.println(iteratorLoc);
			uint8_t itemsRemaining;
			popUint8(_stack, &itemsRemaining);   // Number of items remaining
			//Serial.println(itemsRemaining);
				// If we've gone through the block then we need to pop the
				// last list item off the stack
			if (hasBlockExecuted())
				popString(_stack);

			if (itemsRemaining > 0)				// Any items remaining
			{
					// Set the value of the variable to the location on the
					// stack of the next list item (ie the top)
					// Note that the main stack will only contain a pointer to
					// a second stack set up for strings.
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
