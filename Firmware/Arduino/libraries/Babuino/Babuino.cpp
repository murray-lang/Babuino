
#include "Babuino.h"
#include <math.h>
#include <stdlib.h>		// for number to string conversions
#include "Endian.hpp"
#include "BvmCodes.h"

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
Babuino::Babuino(int startAddress)
		: Program(startAddress),
		_stack(0)
{
	_selectedMotors = Motors::MOTOR_NONE;
	_timerCount     = 0;
	_defaultStream = &Serial;

	_regs.pc               = 0;
	_regs.opCode           = OP_INVALID;
	_regs.withCode         = OP_WITHINT16; // Gogo board default
	_regs.repcountLocation = ~0;
	_regs.blockDepthMask   = 0;
	_regs.blocksExecuted   = 0;

	_states.setRunRequest(STOPPED);
	_states.setMachineState(READY);
	_states.setCommState(COMM_IDLE);
}

void 
Babuino::reset()
{
	//_stack.reset();
	if (_stack)
		releaseStack(_stack);
	_stack = allocateStack(STACK_SIZE);

	_selectedMotors = Motors::MOTOR_NONE;
	_timerCount     = 0;
    _defaultStream = &Serial;

	_regs.pc               = 0;
	_regs.opCode           = OP_INVALID;
	_regs.withCode         = OP_WITHINT16; // Gogo board default
	getStackState(_stack, &_regs.localFrame);
	_regs.repcountLocation = ~0;
	_regs.blockDepthMask   = 0;
	_regs.blocksExecuted   = 0;

	_states.setRunRequest(STOPPED);
	_states.setMachineState(READY);
	_states.setCommState(COMM_IDLE);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
bool 
Babuino::setup()
{
	reset();
	randomSeed(analogRead(4));
	Serial.begin(9600);
	// TODO:
	// Configure pin directions
	
	//_storage.writeByte(0x01F0,0);	// Starting address should be 0 for now.
	//_storage.writeByte(0x01F1,0);
	
	_motors.setup();
	
	_switches.setuprun();
	setupuserLed();
	setuppiezoBeeper();
	
	double_beep();
	return true;
}

//------------------------------------------------------------------------------
// An adaptation of the loop in main() in the original Babuino code.
// This is intended to be called from within the Arduino loop() function.
//------------------------------------------------------------------------------
void 
Babuino::loop()
{
	debounce();
	
	switch (_states.getMachineState())
		{
		case READY:
			if (serialAvailable() > 0)
			{
				_states.setMachineState(COMM);
			}
			else if (_states.getRunRequest() == RUNNING)
			{
				_states.setMachineState(RUN);
			}
			break;

		case COMM:
			doComm();
			_states.setMachineState(READY);
			break;

		case RUN:
			_regs.pc.set(_storage.getStartAddress());
			initStack(_stack);
			_states.setMachineState(RUN);
			code_exec();
			_motors.off();
			_states.setMachineState(READY);
			break;
		}
}

//------------------------------------------------------------------------------
// This is for running the object outside of the Arduino environment.
//------------------------------------------------------------------------------
int
Babuino::run()
{
	while (true)
	{
		loop();
	}
	return 0;
}

//------------------------------------------------------------------------------
// An adaptation of a function of the same name in the original Babuino code.
//------------------------------------------------------------------------------
void
Babuino::doComm()
{
	byte			cmd = 0;
	byte			remainingChars = 0;
	unsigned int	byte_count = 0;

	_states.setWaitingCmd(true); 		// set the waiting flag
	_states.setCommState(COMM_STARTED);

	while (_states.getCommState() != COMM_FINISHED)
	{
			// The Cricket host expects all characters to be echoed, because
			// this was done by the infrared device used for communication
			// with the Cricket robot.
		uint8_t temp;
		if (!serialRead(&temp))
			continue;			// The timeout of serialRead will prevent this
								// being a tight loop.
		serialWrite(temp);
		
		if(_states.isWaitingCmd())
		{
			cmd = temp;
				// test received command and set number of bytes to read
			switch(cmd)
			{
			case cmdCricketCheck:
				remainingChars = 1;	// remaining character received should be 0 (not '0')
				_states.setWaitingCmd(false);
				break;

			case cmdSetPointer:
			case cmdReadBytes:
			case cmdWriteBytes:
				remainingChars = 2;
				_states.setWaitingCmd(false);
			break;

			case cmdRun:
				_states.setRunRequest(RUNNING);
				_states.setCommState(COMM_FINISHED);
			break;

			default:
				_states.setCommState(COMM_FINISHED);	// should never get here.
				break;
			}
		}
		else
		{
				// receive bytes corresponding to each command
			_states.setWaitingCmd(false);
			switch(cmd)
			{
			case cmdCricketCheck:
				if (remainingChars == 1)
					serialWrite(cmdCricketCheckACK);

				_states.setCommState(COMM_FINISHED);	// should never get here
				break;


			case cmdSetPointer:
				if (remainingChars == 2)
				{
					remainingChars--;
					_regs.pc.set((PROGPTR)(temp << 8));
				}
				else
				{
					remainingChars--;
					_regs.pc.increment((int)temp);
					_states.setCommState(COMM_FINISHED);
				}
				break;

			case cmdWriteBytes:
				if (remainingChars == 2)
				{
					remainingChars--;
					byte_count = (unsigned int)temp << 8;
				}
				else if (remainingChars == 1)
				{
					remainingChars--;
					byte_count |= temp & 0xFF;
					if (!_storage.getReadyToWrite(byte_count))
					{
						// TO DO: What now? How do I report an error?
					}
				}
				else
				{
					serialWrite(~temp);
					_storage.writeByte(_regs.pc, temp);
					_regs.pc++;
					byte_count--;
					if (byte_count == 0)
					{
						_states.setCommState(COMM_FINISHED);
					}
				}
				break;

			case cmdReadBytes:
				if (remainingChars == 2)
				{
					remainingChars--;
					byte_count = (unsigned int)temp << 8;
				}
				else if (remainingChars == 1)
				{
					remainingChars--;
					byte_count |= temp & 0xFF;
						// Once byte_count is received, start sending characters.
					while (byte_count > 0)
					{
						_storage.readByte(_regs.pc, temp);
						serialWrite(temp);
						_regs.pc++;
						byte_count--;
					}
					_states.setCommState(COMM_FINISHED);
				}
				break;

			default:
				_states.setCommState(COMM_FINISHED);	// should never get here
				break;
			}
		}
	}
}

//------------------------------------------------------------------------------
// An adaptation of a function of the same name in the original Babuino code.
//------------------------------------------------------------------------------
void
Babuino::code_exec()
{
	//Serial.println("code_exec()");
	
	if (!_storage.getReadyToRead())
	{
		// TO DO: What now? How do I report an error?
	}
	
	while (_states.getRunRequest() == RUNNING)
	{
		_storage.readByte(_regs.pc, _regs.opCode);
		_regs.pc++; 
		switch (_regs.opCode)
		{
			case OP_CONFIG:
				withConfig();
				break;

			case OP_MATH:
				withMath();
				break;

			case OP_BYTE:
			case OP_INT8:
			case OP_SPAN:
				{
					//Serial.println("int8 ");
					uint8_t value;
					_regs.pc = _storage.readByte(_regs.pc, value);
					pushUint8(_stack, value);
				}
				break;
			

			case OP_SHORT:
			case OP_UINT16:
				{
					//Serial.print("int16: ");
					uint16_t value;
					_regs.pc = _storage.read<uint16_t>(_regs.pc, value);
					//Serial.println(value);
					pushUint16(_stack, value);
				}
				break;

			case OP_GLOBAL:
				{
					//Serial.print("global: ");
					STACKPTR value;
					_regs.pc = _storage.read<STACKPTR>(_regs.pc, value);
					//Serial.println(value);
					pushStackPtr(_stack, value); //_stack.push(_stack.getBottom() - value);
				}
				break;

			case OP_INT32:
			case OP_UINT32:
				{
					//Serial.print("int32 ");

					uint32_t value;
					_regs.pc = _storage.read<uint32_t>(_regs.pc, value);
#ifdef SUPPORT_32BIT
					pushUint32(_stack, value);
#else
					pushUint16(_stack, (value >> 16) & 0xFFFF);	// High 16 bits
					pushUint16(_stack, value & 0xFFFF);	// Low 16 bits
#endif
				}
				break;

#ifdef SUPPORT_FLOAT
			case OP_FLOAT:
				{
					//Serial.print("float ");
					float value;
					_regs.pc = _storage.read<float>(_regs.pc, value);
					pushFloat(_stack, value);
				}
				break;
#endif
#ifdef SUPPORT_DOUBLE
			case OP_DOUBLE:
				{	
					//Serial.print("double ");
					double value;
					_regs.pc = _storage.read<double>(_regs.pc, value);
					pushDouble(_stack, value);
				}
				break;
#endif
			case OP_BOOL:
				{
					//Serial.print("bool  ");
					bool value;
					_regs.pc = _storage.read<bool>(_regs.pc, value);
					pushUint8(_stack, (uint8_t)value);
				}
				break;

			case OP_CPTR:
				{
					//Serial.print("cptr  ");
					PROGPTR value;
					_regs.pc = _storage.read<PROGPTR>(_regs.pc, value);
					pushProgPtr(_stack, value);
				}
				break;
#ifdef SUPPORT_STRING
			case OP_STRING:
				{
					//Serial.print("string: \"");
						// ***KLUDGE WARNING***
						// Borrowing unused (hopefully) stack space as a buffer!
						// (To avoid having to allocate another buffer.
					uint8_t* psz = (uint8_t*)getTopAddress(_stack);
					uint8_t nextChar;
					int16_t i = -1;
					do
					{
						i++;
						_regs.pc = _storage.readByte(_regs.pc, nextChar);
						psz[i] = nextChar;
					}
					while (nextChar);
					//Serial.print((char *)psz);
					//Serial.print("\" ");
						// Logically this is wrong because I'm apparently 
						// pushing a string to a location that it already 
						// occupies. However, the stack implementation 
						// pushes strings onto a separate stack, then
						// pushes the location onto the main stack. So
						// the string doesn't get copied over itself, and
						// is already copied before the first characters are
						// overwritten by pushing the said location onto the
						// main stack.
					//STACKSTATE state;
					//getStackState(_stack, &state);
					//Serial.print("[("); Serial.print(state.top); Serial.print(","); Serial.print(state.stringTop);Serial.print(") -> (");
					pushString(_stack, psz);
					//getStackState(_stack, &state);
					//Serial.print(state.top); Serial.print(","); Serial.print(state.stringTop);Serial.println(")]");
				}
				break;
	
			case OP_ASCII:
				{
					uint8_t* psz;
					topString(_stack, &psz);
					uint8_t ascii = psz[0];
					popString(_stack);
					pushUint8(_stack, ascii);
				}
				break;

			case OP_STRLEN:
				{
					uint8_t* psz;
					topString(_stack, &psz);
					uint8_t len = strlen((char*)psz);
					popString(_stack);
					pushUint8(_stack, len);
				}
				break;
#endif
			case OP_BEEP:
				//Serial.println("---beep---");
				beep();
				break;

			case OP_LEDON:
				//Serial.println("---LED on---");
				userLed(true);	// set the correct bit
				break;

			case OP_LEDOFF:
				//Serial.println("---LED off---");
				userLed(false);
				break;


			case OP_WITHINT8:
			case OP_WITHUINT8:
			case OP_WITHINT16:
			case OP_WITHUINT16:
			case OP_WITHBOOL:
			case OP_WITHPTR:
#ifdef SUPPORT_32BIT
			case OP_WITHINT32:
			case OP_WITHUINT32:
#endif
#ifdef SUPPORT_FLOAT
			case OP_WITHFLOAT:
#endif
#ifdef SUPPORT_DOUBLE
			case OP_WITHDOUBLE:
#endif
#ifdef SUPPORT_STRING			
			case OP_WITHSTRING:
#endif			
				_regs.withCode = _regs.opCode;
				break;

			case OP_LOCAL:
				{
					//Serial.print("local: local frame (");
					//Serial.print(_regs.localFrame);
					//Serial.print(") - ");

					STACKPTR varOffset;
					_regs.pc = _storage.read<uint16_t>(_regs.pc, (uint16_t&)varOffset);
					pushStackPtr(_stack, (STACKPTR)_regs.localFrame.top + varOffset);

					//Serial.print(varOffset);
					//Serial.print(" = global ");
					//Serial.println(_regs.localFrame + varOffset);
				}
				break;

			case OP_PARAM:
				{
					//Serial.print("param: ");
					STACKPTR varOffset;
					_regs.pc = _storage.read<uint16_t>(_regs.pc, (uint16_t&)varOffset);
						// We have an index into the parameters, which were put on
						// the stack in reverse order before the function call.
						// Calculate the absolute stack offset using the local
						// stack frame offset.
						// Also, the total size of the arguments was pushed last,
						// so we need to step past that too.
						// TODO: Check against the total argument size.
					pushStackPtr(_stack, 
									getArgsLocation() 
									- sizeof(uint8_t) 	// Number of args
									- varOffset		// Offset to the required param 
					);
				}
				break;

			case OP_BLOCK:
				{
					//Serial.print("block ");
					descendBlock();	// Shift the flag to the next block bit
					//char psz[10]; 
					//utoa(_regs.blockDepthMask, psz, 2);
					//Serial.println(psz);
					uint16_t blockLength;
						// Push address of next instruction (following the block
						// length data)
					pushProgPtr(_stack, (PROGPTR)_regs.pc + sizeof(uint16_t));
					_storage.read<uint16_t>(_regs.pc, blockLength);
						// Step past the block (tests there will bring execution back)
					_regs.pc.increment(blockLength);	

				}
				break;

			case OP_EOB:	
				//Serial.println("--eob--");
				setBlockExecuted();	// Set the bit to indicate that this block has executed
				break;
				
			case OP_DO:
				{
					//Serial.println("---do---");
					// OP_DO is like OP_BLOCK except that execution falls through to
					// the top of the block of code unconditionally rather than jump 
					// to the end where some condition is tested.
					// Need to:
					//  - Push the address that the following OP_BLOCK would push
					//  - Step past the:
					//	  - The OP_BLOCK code (uint8_t)
					//    - The block size (uint16_t)
					// After going through the code block it should jump back to 
					// the beginning of the OP_BLOCK and loop as usual.
					descendBlock();	// Shift the flag to the next block bit (normally done by OP_BLOCK)
					PROGPTR startOfBlock = (PROGPTR)_regs.pc + sizeof(uint8_t) +sizeof(uint16_t);
					pushProgPtr(_stack, startOfBlock); 
					_regs.pc.set(startOfBlock);
				}
				break;

			case OP_WHILE:
				{
					//Serial.print("while ");
					bool  condition;
					PROGPTR blockAddr;
					popUint8(_stack, (uint8_t*)&condition);
					//Serial.println(condition ? "true" : "false");
					//_stack.pop(blockAddr);
					if (condition) // if true then go to the block start address
					{
						topProgPtr(_stack, &blockAddr);
						_regs.pc = blockAddr;
					}
					else
					{
						popProgPtr(_stack, &blockAddr); // Throw it away
						ascendBlock();	// Finished with this block now
					}
				}	
				break;
				
			case OP_REPEAT:
				{
					//Serial.print("repeat ");
					PROGPTR blockAddr;
					uint16_t max;
					popProgPtr(_stack, &blockAddr);
					popUint16(_stack, &max);
					uint16_t repcount;
					if (!hasBlockExecuted()) // First time around?
					{
						repcount = 1;
						pushUint16(_stack, repcount);
							// point to the counter we just pushed
						STACKPTR slot = getTop(_stack);
							// Save outer loop's repcount pointer
						pushStackPtr(_stack, _regs.repcountLocation);
							// Set it to ours 
						_regs.repcountLocation = slot;
					}
					else
					{
						getUint16(_stack, _regs.repcountLocation, &repcount); // Get counter value
						repcount++;
					}
					//Serial.println(repcount);
					if (repcount <= max)
					{
						setUint16(_stack, _regs.repcountLocation, repcount);
						pushUint16(_stack, max);
						pushProgPtr(_stack, blockAddr);
						_regs.pc = blockAddr;
					}
					else
					{
							// Restore the outer loop's repcount pointer
						popStackPtr(_stack, &_regs.repcountLocation);
						popUint16(_stack, &repcount);			// Dispose of counter
						ascendBlock();	// Finished with this block now
					}
				}
				break;

			case OP_REPCOUNT:
				{
					uint16_t repcount;
					getUint16(_stack, _regs.repcountLocation, &repcount);
					pushUint16(_stack, repcount);
				}
				break;

			case OP_FOR:
				{
					//Serial.println("for ");
						// The counter variable has already been set to the from
						// value, so the from value isn't on the stack.
					PROGPTR blockAddr;
					int16_t  step, to, from;
					STACKPTR counterOff;
					int16_t  counterVal;
					popProgPtr(_stack, &blockAddr); 		
					popUint16(_stack, (uint16_t*)&step); 
					popUint16(_stack, (uint16_t*)&to);
					popUint16(_stack, (uint16_t*)&from); 
					popStackPtr(_stack, &counterOff); 
					getUint16(_stack, counterOff, (uint16_t*)&counterVal);

					//Serial.print(counterVal); 
					//Serial.print(" ");
					//Serial.print(to); 
					//Serial.print(" ");
					//Serial.println(step); 

					bool keepGoing;
						// See if this is the first time around
					if (!hasBlockExecuted())
					{
						counterVal = from;
						keepGoing = true;
					}
					else
					{
						// If step > 0 then assume from < to otherwise assume from > to
						keepGoing = (step > 0) ? (counterVal < to) : (counterVal > to); 
						counterVal += step;
					}
					if (keepGoing)
					{
						setUint16(_stack, counterOff, (uint16_t)counterVal);
						_regs.pc = blockAddr; // reiterate
						pushStackPtr(_stack, counterOff);	// Var offset
						pushUint16(_stack, (uint16_t)from);	// to
						pushUint16(_stack, (uint16_t)to);	// to
						pushUint16(_stack, (uint16_t)step);	// step
						pushProgPtr(_stack, blockAddr);
					}
					else
					{
						ascendBlock();
					}
				}
				break;


			case OP_IF:
				{
					//Serial.print("if ");
						// If it's the first time through then check the
						// condition
					if (!hasBlockExecuted())
					{
						PROGPTR blockAddr;
						bool     condition;
						popProgPtr(_stack, &blockAddr);  // Block initial address
						popUint8(_stack, (uint8_t*)&condition); // argument to test
						//Serial.println(condition ? "true" : "false");
						if (condition)
						{
							_regs.pc = blockAddr;
						}
						else
						{
							ascendBlock();
						}
					}
					else

					{
						ascendBlock();
					}
				}
				break;

				// IFELSE starts with address of THEN and ELSE lists (and 
				// CONDITIONAL) on the stack. CONDITIONAL is tested and 
				// appropriate list is run. 
			case OP_IFELSE:
				{
					//Serial.print("ifelse ");
					PROGPTR elseBlock;
					popProgPtr(_stack, &elseBlock);  // ELSE block start
						// Note that descendBlock() will have been called twice
						// the first time around (once for each block).
					ascendBlock(); // Remove the else block...
						// ...and use the then block flag for both purposes
					if (!hasBlockExecuted())
					{
						PROGPTR thenBlock;
						bool     condition;
						popProgPtr(_stack, &thenBlock); // THEN block start
						popUint8(_stack, (uint8_t*)&condition); 	  // argument to test
						if (condition)
						{
							//Serial.println("(then)");
							_regs.pc = thenBlock;
								// The ELSE address will get pushed again when
								// execution falls into the ELSE block after
								// exiting the THEN block.
								// Another else block will be descended into  
								// as well, and ascended away again above.
								// The eob code will be encountered at the end
								// of the then block, and that will set the
								// executed flag.
						}
						else
						{
							//Serial.println("(else)");
							_regs.pc = elseBlock;	  // the "ELSE" list
							pushProgPtr(_stack, (PROGPTR)0); // Push fake ELSE to balance
								// Borrow the then block flag and set it now as
								// executed since it won't actually be set
								// otherwise.
							setBlockExecuted();
								// Descend the else block now, as 
								// this also won't be done in the block's code.
							descendBlock();
						}
					}
					else
					{
						//popProgPtr(_stack, &elseBlock);  // dispose of unrequired address
						ascendBlock(); // ie. the then block
					}
				}
				break;

			case OP_PUSH:
				{
					//Serial.print("push ");
					uint8_t amount;
					popUint8(_stack, &amount);
					pushn(_stack, (STACKPTR)amount);
				}
				break;
			
			case OP_POP:
				{
					//Serial.print("pop ");
					uint8_t amount;
					popUint8(_stack, &amount);
					popn(_stack, (STACKPTR)amount);
				}
				break;
			
			case OP_CHKPOINT:
				getStackState(_stack, &_regs.checkPoint);
				break;

			case OP_ROLLBACK:
				setStackState(_stack, &_regs.checkPoint);
				break;
				
			case OP_CALL:
				{
					//Serial.println("call");
					PROGPTR procAddr;
					popProgPtr(_stack, &procAddr);			// Get the function location
						// Save the args location used by the calling function, and
						// set it to what was the stack top before it was pushed.
					/* 
					_regs.argsLoc = _stack.push(_regs.argsLoc);
					//Serial.print("args location: ");		
					//Serial.println(_regs.argsLoc);
					*/
					pushProgPtr(_stack, (PROGPTR)_regs.pc);	// Save the current code location for the return
					_regs.pc.set(procAddr);		        // Now jump to the function
				}
				break;

			case OP_BEGIN:
				//Serial.println("begin");
				pushRegisters();	// Save state of the caller
				
				_regs.blockDepthMask   = 0;
				_regs.blocksExecuted   = 0;
				getStackState(_stack, &_regs.localFrame); // = getTop(_stack);
				
				//Serial.println(_regs.localFrame);
				break;

			case OP_RETURN:
				{
					//Serial.print("return ");

						//Unwind the stack to the beginning of the local frame
					setStackState(_stack, &_regs.localFrame);
					popRegisters();
					
					PROGPTR returnAddr;
					popProgPtr(_stack, &returnAddr);	// Get the return address
					//_stack.pop(_regs.argsLoc);	// Restore the param location for the calling function
					_regs.pc.set(returnAddr);
				}
				break;
			
			case OP_EXIT:
				reset();
				//Serial.println("---exit---");
				break;

			case OP_LOOP:
				{
					//Serial.println("---loop---");
					PROGPTR blockAddr;
					topProgPtr(_stack, &blockAddr); 
					_regs.pc.set(blockAddr);

				}
				break;


			case OP_WAIT:
				{
					//Serial.println("---wait---");
					uint16_t tenths;
					popUint16(_stack, &tenths);
					delay(100 * tenths);
				}
				break;

			case OP_TIMER:
				//Serial.print("timer ");
				pushUint16(_stack, _timerCount); // TODO: implement timer!!
				break;

			case OP_RESETT:
				//Serial.println("---resett---");
				_timerCount = 0;
				break;

			case OP_RANDOM:
				//Serial.print("random ");
				pushUint16(_stack, (uint16_t)random(0, 32767));
				break;

			case OP_RANDOMXY:
				{
					//Serial.print("randomxy ");
					int16_t x;
					int16_t y;
					popUint16(_stack, (uint16_t*)&y);
					popUint16(_stack, (uint16_t*)&x);
					pushUint16(_stack, (uint16_t)random(x, y));
				}
				break;

			case OP_MOTORS:
				{
					//Serial.print("motors ");
					uint8_t selected;
					popUint8(_stack, &selected);
					_selectedMotors = (Motors::Selected)selected;
				}
				break;
				
			case OP_THISWAY:
				//Serial.print("---thisway---");
				_motors.setDirection(_selectedMotors, MotorBase::THIS_WAY);
				break;


			case OP_THATWAY:
				//Serial.print("---thatway---");
				_motors.setDirection(_selectedMotors, MotorBase::THAT_WAY);
				break;

			case OP_RD:
				//Serial.print("---rd---");
				_motors.reverseDirection(_selectedMotors);
				break;
				
			case OP_SETPOWER:
				{
					//Serial.print("setpower ");
					uint8_t power;
					popUint8(_stack, &power);
					if (power > 7)	
						power = 7;
					_motors.setPower(_selectedMotors, power);
				}
				break;


			case OP_BRAKE:
				//Serial.println("---brake---");
				_motors.setBrake(_selectedMotors, MotorBase::BRAKE_ON);
				break;

			case OP_ON:
				//Serial.println("---on---");
				_motors.on(_selectedMotors);
				break;

			case OP_ONFOR:
				{
					//Serial.print("onfor");
					uint16_t tenths;
					popUint16(_stack, &tenths);
					_motors.on(_selectedMotors);
					delay(100 * tenths);
					_motors.off(_selectedMotors);
				}
				break;

			case OP_OFF:
				//Serial.println("---off---");
				_motors.off(_selectedMotors);
				break;
			

			case OP_SENSOR1:
			case OP_SENSOR2:
			case OP_SENSOR3:
			case OP_SENSOR4:
			case OP_SENSOR5:
			case OP_SENSOR6:
			case OP_SENSOR7:
			case OP_SENSOR8:
				//Serial.print("sensor ");
				//Serial.print(_regs.opCode - OP_SENSOR1);
				//Serial.print(" ");
				pushUint16(_stack, (uint16_t)readAnalog(_regs.opCode - OP_SENSOR1));
				break;

			case OP_AIN:
				{
					//Serial.print("ain ");
					uint8_t input;
					popUint8(_stack, &input);
					pushUint16(_stack, (uint16_t)readAnalog(input));
				}
				break;

			case OP_AOUT:
				{
					//Serial.print("aout ");
					uint8_t output;
					uint8_t value;
					popUint8(_stack, &output);
					popUint8(_stack, &value);
					writeAnalog(output, value);
				}
				break;

			case OP_SWITCH1:
			case OP_SWITCH2:
			case OP_SWITCH3:
			case OP_SWITCH4:
			case OP_SWITCH5:
			case OP_SWITCH6:
			case OP_SWITCH7:
			case OP_SWITCH8:
				{
					//Serial.print("switch ");
					//Serial.print(_regs.opCode - OP_SWITCH1);
					//Serial.print(" ");
					int16_t val = readAnalog(_regs.opCode - OP_SWITCH1);
					if (val < 0)
						pushUint8(_stack, (uint8_t)false);
					else
						pushUint8(_stack, (uint8_t)!!(val >> 7));
				}
				break;
			
			case OP_NOT:
				break;
			
			case OP_AND:
				break;

			case OP_OR:
				break;

			case OP_XOR:
				break;

			case OP_DIN:
				{
					//Serial.print("din ");
					uint8_t input;
					popUint8(_stack, &input);
					pushUint8(_stack, (uint8_t)readDigital(input));
				}
				break;

			case OP_DOUT:
				{
					//Serial.print("dout ");
					uint8_t output;
					bool value;
					popUint8(_stack, &output);
					popUint8(_stack, (uint8_t*)&value);
					writeDigital(output, value);
				}
				break;
			
			case OP_BTOS:
				{
					int8_t value;
					popUint8(_stack, (uint8_t*)&value);
					pushUint16(_stack,(uint16_t)value);
				}
				break;
			case OP_UBTOS:
				{
					uint8_t value;
					popUint8(_stack, &value);
					pushUint16(_stack,(uint16_t)value);
				}
				break;
			case OP_STOB:	// and OP_USTOB
				{
					//Serial.print("stob: ");
					uint16_t value;
					popUint16(_stack, (uint16_t*)&value);
					//Serial.println(value);
					pushUint8(_stack, (uint8_t)value);
					
				}
				break;
#ifdef SUPPORT_32BIT
			case OP_BTOI:
				{
					int8_t value;
					popUint8(_stack, (uint8_t*)&value);
					pushUint32(_stack,(uint32_t)value);
				}
				break;
			case OP_UBTOI:
				{
					uint8_t value;
					popUint8(_stack, &value);
					pushUint32(_stack,(uint32_t)value);
				}
				break;
			case OP_STOI:
				{
					int16_t value;
					popUint16(_stack, (uint16_t*)&value);
					pushUint32(_stack,(uint32_t)value);
				}
				break;
			case OP_USTOI:
				{
					uint16_t value;
					popUint16(_stack, &value);
					pushUint32(_stack,(uint32_t)value);
				}
				break;
			case OP_ITOB: // and OP_UITOB
				{
					int32_t value;
					popUint32(_stack, (uint32_t*)&value);
					pushUint8(_stack, (uint8_t)value);
				}
				break;
			case OP_ITOS: //and OP_UITOS

				{
					int32_t value;
					popUint32(_stack, (uint32_t*)&value);
					pushUint16(_stack, (uint16_t)value);
				}
				break;
#endif
#ifdef SUPPORT_FLOAT
			case OP_BTOF:
				{
					int8_t value;
					popUint8(_stack, (uint8_t*)&value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_UBTOF:
				{
					uint8_t value;
					popUint8(_stack, &value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_STOF:
				{
					int16_t value;
					popUint16(_stack, (uint16_t*)&value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_USTOF:
				{
					uint16_t value;
					popUint16(_stack, &value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_FTOB:
				{
					float value;
					popFloat(_stack, &value);
					pushUint8(_stack, (uint8_t)value);
				}
				break;
			case OP_FTOS:
				{
					float value;
					popFloat(_stack, &value);
					pushUint16(_stack, (uint16_t)value);
				}
				break;
#endif
#ifdef SUPPORT_DOUBLE
			case OP_BTOD:
				{
					int8_t value;
					popUint8(_stack, (uint8_t*)&value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_UBTOD:
				{
					uint8_t value;
					popUint8(_stack, &value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_STOD:
				{
					int16_t value;
					popUint16(_stack, (uint16_t*)&value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_USTOD:
				{
					uint16_t value;
					popUint8(_stack, (uint8_t*)&value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_DTOB:
				{
					double value;
					popDouble(_stack, &value);
					pushUint8(_stack, (uint8_t)value);
				}
				break;
			case OP_DTOS:
				{
					double value;
					popDouble(_stack, &value);
					pushUint16(_stack, (uint16_t)value);
				}
				break;
#endif
#if defined(SUPPORT_DOUBLE) && defined(SUPPORT_32BIT)
			case OP_ITOD:
				{
					int32_t value;
					popUint32(_stack, (uint32_t*)&value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_UITOD:
				{
					uint32_t value;
					popUint32(_stack, &value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_DTOI:
				{
					double value;
					popDouble(_stack, &value);
					pushUint32(_stack, (uint32_t)value);
				}
				break;
#endif
#if defined(SUPPORT_DOUBLE) && defined(SUPPORT_FLOAT)
			case OP_FTOD:
				{
					float value;
					popFloat(_stack, &value);
					pushDouble(_stack, (double)value);
				}
				break;
			case OP_DTOF:
				{
					double value;
					popDouble(_stack, &value);
					pushFloat(_stack, (float)value);
				}
				break;
#endif
#if defined(SUPPORT_FLOAT) && defined(SUPPORT_32BIT)			
			case OP_ITOF:
				{
					int32_t value;
					popUint32(_stack, (uint32_t*)&value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_UITOF:
				{
					uint32_t value;
					popUint32(_stack, &value);
					pushFloat(_stack, (float)value);
				}
				break;
			case OP_FTOI:
				{
					float value;
					popFloat(_stack, &value);
					pushUint32(_stack, (uint32_t)value);
				}
				break;
#endif			

			case OP_I2CSTART:
				i2cStart();
				break;

			case OP_I2CSTOP:
				i2cStop();
				break;

			case OP_I2CTXRX:
				{
					uint16_t i2cAddr;
					uint16_t txBuffOffset;
					uint8_t  txBuffLen;
					uint16_t rxBuffOffset;
					uint8_t  rxBuffLen;
					uint16_t timeout;
					popUint16(_stack, &i2cAddr);
					popUint16(_stack, &txBuffOffset);
					popUint8(_stack, &txBuffLen);
					popUint16(_stack, &rxBuffOffset);
					popUint8(_stack, &rxBuffLen);
					popUint16(_stack, &timeout);
					i2cTxRx(i2cAddr, 
							(uint8_t*)getStackAddress(_stack, txBuffOffset), 
							txBuffLen,
							(uint8_t*)getStackAddress(_stack, rxBuffOffset), 
							rxBuffLen,
							timeout);
				}
				break;

			case OP_I2CRX:
				{
					uint16_t addr;
					uint16_t rxBuffOffset;
					uint8_t  rxBuffLen;
					uint16_t timeout;
					popUint16(_stack, &addr);
					popUint16(_stack, &rxBuffOffset);
					popUint8(_stack, &rxBuffLen);
					popUint16(_stack, &timeout);
					i2cRx(addr, (uint8_t*)getStackAddress(_stack, rxBuffOffset), rxBuffLen, timeout);
				}
				break;
#ifdef SUPPORT_32BIT
			case OP_I2CERR:
				{
					//Serial.println("---i2cerr---");
					uint32_t errors = i2cErrors();
					pushUint32(_stack, errors);
				}
				break;
#endif
			case OP_WAITUNTIL:
			case OP_RECORD:
			case OP_RECALL:
			case OP_RESETDP:
			case OP_SETDP:
			case OP_ERASE:
			case OP_SETSVH:
			case OP_SVR:
			case OP_SVL:
					// TODO!!!
				break;
				
			default:
					// All of the type specific codes are dealt with here
				if (!withCurrentType())
				{
					//beep();	// Just an indication for now.
					Serial.print("unrecognised opcode: ");
					Serial.println(_regs.opCode);
				}
				break;

		}
	}
}

void    
Babuino::pushRegisters()
{
	pushStackState(_stack, &_regs.localFrame); 
	pushStackState(_stack, &_regs.checkPoint);
	pushUint8(_stack, _regs.blockDepthMask);
	pushUint8(_stack, _regs.blocksExecuted);
}

void    
Babuino::popRegisters()
{
	popUint8(_stack, &_regs.blocksExecuted);
	popUint8(_stack, &_regs.blockDepthMask);
	popStackState(_stack, &_regs.checkPoint);
	popStackState(_stack, &_regs.localFrame);
}

STACKPTR 
Babuino::getArgsLocation()
{
	return _regs.localFrame.top 
			- sizeof(uint8_t) * 2	//Block states
			- sizeof(STACKSTATE)	// Saved checkpoint from outer context
			- sizeof(STACKSTATE)	// Saved localFrame from outer context
			- sizeof(PROGPTR);	// Return address
}

bool 
Babuino::withConfig()
{
	//Serial.println("withConfig()");
	_regs.pc = _storage.readByte(_regs.pc, _regs.opCode);

	switch (_regs.opCode)
	{
	case OP_CONFIG_AIN:
		//Serial.println("config.ain");
		return true;

	case OP_CONFIG_AOUT:
		//Serial.println("config.aout");
		return true;

	case OP_CONFIG_DIN:
		//Serial.println("config.din");
		setPinDirections(INPUT);
		return true;

	case OP_CONFIG_DOUT:
		//Serial.println("config.dout");
		setPinDirections(OUTPUT);
		return true;

	case OP_CONFIG_SERIAL:
		//Serial.println("config.serial");
		configSerial();
		return true;

	case OP_CONFIG_SEND:
		//Serial.println("config.send");
		return true;

	}
	return false;
}

void 
Babuino::setPinDirections(int dir)
{
	uint8_t count;
	popUint8(_stack, &count);
	while (count--)
	{
		uint8_t pin;
		popUint8(_stack, &pin);
		pinMode((int)pin, dir);
	}
}

void 
Babuino::configSerial()
{
	union
	{
		uint8_t       paramsByte;
		_SerialParams params;
	};
	uint32_t baud;
	uint8_t  port;
	popUint8(_stack, &paramsByte);
#ifdef SUPPORT_32BIT
	popUint32(_stack, &baud);	
#else
	uint16_t baudBits;
	popUint16(_stack, &baudBits);	// Low 16 bits
	baud = (uint32_t)baudBits;
	popUint16(_stack, &baudBits);	// High 16 bits
	baud |= (baudBits << 16);
#endif
	popUint8(_stack, &port);
		// Use a knowledge of the defines in HardwareSerial.h
		// to build the same numbers with our parameters.
	//uint8_t databits = (params >> 4) & 0x0F;
	//uint8_t parity = (params >> 2) & 0x03;
	//uint8_t stopbits = params & 0x03;

	uint8_t config = 0;	// PARITY_NONE
	if (params.parity == PARITY_EVEN)
		config = 0x20;
	else if (params.parity == PARITY_ODD)
		config = 0x30;

		// Databits
	config += (params.databits - 5) << 1;

		//Stopbits
	if (params.stopbits == 2)
		config += 8;
/*
	Serial.print("Baud: ");
	Serial.println(baud);
	Serial.print("Params as byte: ");
	Serial.println(paramsByte);
	Serial.print("Databits: ");
	Serial.println(params.databits);
	Serial.print("Parity: ");
	Serial.println(params.parity);
	Serial.print("Stopbits: ");
	Serial.println(params.stopbits);
	Serial.print("Params: ");
	Serial.println(config);
*/

	if (port == 4)
#ifdef Serial3
		Serial3.begin(baud, config);
#else
		beep();
#endif

	if (port == 3)
#ifdef Serial2
		Serial2.begin(baud, config);
#else
		beep();
#endif

	if (port == 2)
#ifdef Serial1
		Serial1.begin(baud, config);
#else
		beep();
#endif

	if (port == 1)
#ifdef Serial
		Serial.begin(baud, config);
#else
		beep();
#endif

}

void 
Babuino::configSend()
{
	uint8_t  transport;
	popUint8(_stack, &transport);
	if (transport == TRANSPORT_SERIAL)
		configSendSerial();	
	else if (transport == TRANSPORT_ETHERNET)
		configSendEthernet();	
}

void 
Babuino::configSendSerial()
{
	uint8_t  port;
	popUint8(_stack, &port);
	switch (port)
	{
	case 1:
#ifdef Serial
		_defaultStream = &Serial;
#else
		beep();
#endif
		break;

	case 2:
#ifdef Serial1
		_defaultStream = &Serial1;
#else
		beep();
#endif		break;

	case 3:
#ifdef Serial2
		_defaultStream = &Serial2;
#else
		beep();
#endif		break;

	case 4:
#ifdef Serial3
		_defaultStream = &Serial3;
#else
		beep();
#endif		break;

	default:
		beep();
		break;
	}
}

void 
Babuino::configSendEthernet()
{
	uint8_t  port;
	popUint8(_stack, &port);
		// TODO: implement ethernet selection
	beep();
}

bool 
Babuino::withMath()
{
	//Serial.println("withMath()");
	_regs.pc = _storage.readByte(_regs.pc, _regs.opCode);
	return withCurrentType();	
}

void 
Babuino::descendBlock()
{
/*	
	char buf[9];

	Serial.print("descendBlock: (");
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.print(" -> ");
*/	
	if (_regs.blockDepthMask == 0)
		_regs.blockDepthMask = 1;
	else
		_regs.blockDepthMask <<= 1;
/*	
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);	
	Serial.println(")");
*/		
}

void 
Babuino::ascendBlock()
{
/*	
	char buf[9];
	Serial.print("ascendBlock: (");
	utoa(_regs.blocksExecuted, buf, 2);
	Serial.write(buf);
	Serial.print(" &= ~");
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.print(" -> ");
*/	
	_regs.blocksExecuted &= ~_regs.blockDepthMask; // Clear the executed flag
	_regs.blockDepthMask >>= 1; // Back to the next block outwards
/*

	utoa(_regs.blocksExecuted, buf, 2);
	Serial.write(buf);
	Serial.print(":");
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.println(")");
*/
}

void 
Babuino::setBlockExecuted()
{
/*
	char buf[9];
	Serial.print("setBlockExecuted: (");
	utoa(_regs.blocksExecuted, buf, 2);
	Serial.write(buf);
	Serial.print(" |= ");
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.print(" -> ");
*/
	_regs.blocksExecuted |= _regs.blockDepthMask;
/*
	utoa(_regs.blocksExecuted, buf, 2);
	Serial.write(buf);
	Serial.println(")");
*/
}

bool 
Babuino::hasBlockExecuted()
{
/*
	char buf[9];
	Serial.print("hasBlockExecuted: (");
	utoa(_regs.blocksExecuted, buf, 2);
	Serial.write(buf);
	Serial.print(" & ");
	utoa(_regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.print(" = ");
	utoa(_regs.blocksExecuted & _regs.blockDepthMask, buf, 2);
	Serial.write(buf);
	Serial.println(")");
*/
	return (_regs.blocksExecuted & _regs.blockDepthMask) == _regs.blockDepthMask;
}

int16_t  
Babuino::readAnalog(uint8_t i)
{
	if (i < NUM_ANALOG_INPUTS)	// defined in pins_arduino.h
		return analogRead(analogInputToDigitalPin(i));
	return -1;
}

bool 
Babuino::readDigital(uint8_t i)
{
	if (i < NUM_DIGITAL_PINS)	// defined in pins_arduino.h
		return digitalRead(i) == HIGH;
	return false;	
}

bool 
Babuino::writeAnalog(uint8_t i, uint8_t value)
{
	if (!digitalPinHasPWM(i))	// defined in pins_arduino.hexpected primary-expression before ‘>’ token
		return false;
	
	analogWrite(i, value);
	return true;
}

bool 
Babuino::writeDigital(uint8_t i, bool value)
{
	if (i > NUM_DIGITAL_PINS)	// defined in pins_arduino.h
		return false;
	
	digitalWrite(i, value ? HIGH : LOW);
	return true;
}

void     
Babuino::i2cStart()
{
	//Serial.println("i2cstart");	
	// TODO
}

void     
Babuino::i2cStop()
{
	//Serial.println("i2cstop");	
	// TODO
}

void     
Babuino::i2cTxRx(uint16_t addr, uint8_t* txbuff, uint8_t txbufflen, uint8_t* rxbuff, uint8_t rxbufflen, uint16_t timeout)
{
	// TODO
	//Serial.println("---i2ctxrx---");
		// Plug some values to test the round trip
	int length = min(txbufflen, rxbufflen);
	for (int i = 0; i < length; i++)
	{
		rxbuff[i] = txbuff[i] * 10;
	}
}

void     
Babuino::i2cRx(uint16_t addr, uint8_t* rxbuff, uint8_t rxbufflen, uint16_t timeout)
{
	//Serial.println("i2crx");
	// TODO
			// Plug some values to test the round trip
	for (int i = 0; i < rxbufflen; i++)
		rxbuff[i] = i * 10;
}

uint32_t 
Babuino::i2cErrors()
{
	// TODO
	return 0;
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
void 
Babuino::beep() const
{
	piezoBeeper(127);
	delay(50);
	piezoBeeper(0);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
void 
Babuino::double_beep() const
{
	beep();
	delay(50);
	beep();
}

bool 
Babuino::withCurrentType()
{
	switch (_regs.withCode)
	{
	case OP_WITHINT8:	return withInt8();
	case OP_WITHUINT8:	return withUint8();
	case OP_WITHINT16:	return withInt16();
	case OP_WITHUINT16:	return withUint16();
	case OP_WITHBOOL:	return withBool();
	case OP_WITHPTR:	return withStackPtr();
#ifdef SUPPORT_32BIT
	case OP_WITHINT32:	return withInt32();
	case OP_WITHUINT32:	return withUint32();
#endif
#ifdef SUPPORT_FLOAT
	case OP_WITHFLOAT:	return withFloat();
#endif
#ifdef SUPPORT_DOUBLE
	case OP_WITHDOUBLE:	return withDouble();
#endif
#ifdef SUPPORT_STRING
	case OP_WITHSTRING:	return withString();
#endif
	
	}
	return false;
}
#include "./TypeHandlers/Uint8.cpp"
#include "./TypeHandlers/Int8.cpp"
#include "./TypeHandlers/Uint16.cpp"
#include "./TypeHandlers/Int16.cpp"
#include "./TypeHandlers/Bool.cpp"
#include "./TypeHandlers/StackPtr.cpp"
#ifdef SUPPORT_32BIT
#include "./TypeHandlers/Uint32.cpp"
#include "./TypeHandlers/Int32.cpp"
#endif
#ifdef SUPPORT_FLOAT
#include "./TypeHandlers/Float.cpp"
#endif 
#ifdef SUPPORT_DOUBLE
#include "./TypeHandlers/Double.cpp"
#endif
#ifdef SUPPORT_STRING
#include "./TypeHandlers/String.cpp"
#endif

