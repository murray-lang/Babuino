//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// Though the structure of the code has changed considerably, it owes its 
// existence to the the Babuino project AVR source code v033 by:
//           Adeilton Cavalcante de Oliveira Jr
// ...and the core code is much as Adeilton wrote it.
// 
// This version of the firmware was developed to run as a pure Arduino sketch.
// The reasons for this effort were:
//		* so that it can run with no (or little) modification on any Arduino
//			board, AVR, PIC, ARM or otherwise (assuming code space).
//		* so that developers can take maximum advantage of the available 
//			libraries and shields.
// 
// To this end I have avoided direct port manipulation and reprogramming of
// timers.
// 
// All rights to my portions of this code are in accordance with the Babuino 
// Project. 
//------------------------------------------------------------------------------

#include "CricketProgram.h"

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
bool 
CricketProgram::setup()
{
	Serial.begin(9600);
	eepromWriteByte(0x01F0,0);	// Starting address should be 0 for now.
	eepromWriteByte(0x01F1,0);
	
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
CricketProgram::loop()
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
			_address.highByte = eepromReadByte(0x01F0); // TO DO: get this EEPROM address in a portable way
			_address.lowByte = eepromReadByte(0x01F1); // TO DO: get this EEPROM address in a portable way
			_stack.reset();
			//_lstack.reset();
			code_exec();
				// Turn Motors off
			_motors.off();
			_states.setMachineState(READY);
			break;
		}
}

//------------------------------------------------------------------------------
// This is for running the object outside of the Arduino environment.
//------------------------------------------------------------------------------
int
CricketProgram::run()
{
	while (true)
	{
		loop();
	}
	return 0;
}
/*
void 
CricketProgram::print_stack() 
{
	Serial.println("--stack--");
	for (int i = 0; i < _stack._top; i++)
	{
		Serial.println(_stack.get(i));
	}
	Serial.println("--end stack--");
}
*/
//------------------------------------------------------------------------------
// An adaptation of a function of the same name in the original Babuino code.
//------------------------------------------------------------------------------
void
CricketProgram::doComm()
{
	byte				cmd = 0;
	byte				remainingChars = 0;
	ShortUnion2Bytes	byte_count = {0};

	_states.setWaitingCmd(true); 		// set the waiting flag
	_states.setCommState(COMM_STARTED);

	while (_states.getCommState() != COMM_FINISHED)
	{
			// The Cricket host expects all characters to be echoed, because
			// this was done by the infrared device used for communication
			// with the Cricket robot.
		char temp;
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
					_address.highByte = temp;
				}
				else
				{
					remainingChars--;
					_address.lowByte = (unsigned char)temp;
					_states.setCommState(COMM_FINISHED);
				}
				break;

			case cmdWriteBytes:
				if (remainingChars == 2)
				{
					remainingChars--;
					byte_count.highByte = temp;
				}
				else if (remainingChars == 1)
				{
					remainingChars--;
					byte_count.lowByte = (unsigned char)temp;
				}
				else
				{
					serialWrite(~temp);
					eepromWriteByte((int)_address, temp);
					++_address;
					--byte_count;
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
					byte_count.highByte = temp;
				}
				else if (remainingChars == 1)
				{
					remainingChars--;
					byte_count.lowByte = (unsigned char)temp;
						// Once byte_count is received, start sending characters.
					while (byte_count > 0)
					{
						serialWrite(eepromReadByte((int)_address));
						++_address;
						--byte_count;
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
CricketProgram::code_exec()
{
	int  temp1, temp2, temp3, temp4, temp5, temp6;
	char chTemp;
	int  localFlag = 0;		// currently used only for WAITUNTIL
							// 0 => initial entry
	char opcode = 0;
	int  argsLocation = -1;
	int  localsLocation = -1;
	
	while (_states.getRunRequest() == RUNNING)
	{
		opcode = eepromReadByte((int)_address);
		
			// Using prefix operator because of arcane C++ problems with 
			// overloading the postfix ++ operator in ShortUnion2Bytes.
		++_address; 

		switch (opcode)
		{
			case OP_BYTE:
				temp1 = eepromReadByte((int)_address);
				//Serial.println("b");
				//Serial.println(temp1);
				_stack.push(temp1);
				++_address;
				break;

			case OP_NUMBER:
				temp1 = eepromReadByte((int)_address);  // MSB
				++_address;
				temp2 = eepromReadByte((int)_address);  // LSB
				++_address;
				temp3 = (temp1<<8) + (temp2&255);
				_stack.push(temp3);
				break;
				
			case OP_BLOCK:
				_stack.push((int)_address + 1);
				temp1 = eepromReadByte((int)_address);
				_address += temp1;
				break;
				
			case OP_DO:
				// OP_DO is like OP_BLOCK except that execution falls through to
				// the top of the block of code unconditionally rather than jump 
				// to the end where some condition is tested.
				_stack.push((int)_address + 1); // As per OP_LIST
				 
				break;

			case OP_EOB:
//	20090919	address++;
				break;

			case OP_EOLR:
//				address++;
				break;

			case OP_LTHING:
				//_stack.push(_lstack.get((int)eepromReadByte((int)_address)));
				++_address;
				break;
				
			case OP_PUSH:
				temp1 = _stack.pop();	// Amount to allocate
				_stack.pushn(temp1);	//Allocate it
				break;
			
			case OP_POP:
				//Serial.println("-pop-");
				//Serial.println(_address.asShort);
				//Serial.println(_stack._top);
				temp1 = _stack.pop();	// Amount to clear
				_stack.popn(temp1);		//Clear the stack
				//Serial.println(temp1);
				//Serial.println(_stack._top);
				break;
				
			case OP_ENTER:
				temp1 = _stack.pop();	// Amount to allocate for locals
				_stack.push(localsLocation); // Save locals location for calling function
				localsLocation = _stack._top;
				_stack.pushn(temp1);	//Allocate space for locals
				break;
			
			case OP_LEAVE:
					//Unwind the stack to before the local variables that were added
				_stack._top = localsLocation;
				localsLocation = _stack.pop();	// Restore the caller's locals location
				break;
				
			case OP_CALL:
				//Serial.println("-call-");
				//print_stack();
				//Serial.println(_address.asShort);
				//Serial.println(_stack._top);
				temp1 = _stack.pop();			// Get the function location 
				_stack.push(argsLocation);		// Save the args location used by the calling function
				argsLocation = _stack._top - 1;	// Set the args location for use by the called function
				//Serial.println(argsLocation);
				_stack.push(_address.asShort);	// Save the current code location for the return
				_address.asShort = temp1;		// Now jump to the function
				//Serial.println(temp1);
				break;

			case OP_STOP:	// ie. return
				//Serial.println("-return-");
				//print_stack();
				//Serial.println(_address.asShort);
				//Serial.println(_stack._top);
				_address.asShort = _stack.pop();	// Get the return address
				//Serial.println(_address.asShort);
				argsLocation = _stack.pop();		// Restore the param location for the calling function
				//_lstack.reset();
				if (_address < 0)	// stack has underflowed
					_states.setRunRequest(STOPPED);
				break;

			case OP_OUTPUT:
					// Space should have been allocated on the stack at the
					// end of the argument list for the return value. (This
					// means that the return value is lower on the stack)
					// If the number of arguments is zero, then the argsLocation
					// place on the stack has actually been taken by the return
					// value placeholder (and the zero it its initial value).
				//Serial.println("-output-");
				//print_stack();
				//Serial.println(_stack._top);
				temp1 = _stack.pop();	// temp1 = the return value
				temp2 = _stack.get(argsLocation); // temp2 = number of args
				//Serial.println(temp1);
				//Serial.println(temp2);
				//Serial.println(argsLocation);
					// if the number of args is greater than zero, then the
					// numArgs location is real and needs to be stepped past.
				if (temp2 > 0)
					temp2++;
				_stack.set(argsLocation - temp2, temp1);
				break;
				
			case OP_GETPARAM:
				//Serial.println("-getparam-");
				//Serial.println(_address.asShort);
				//Serial.println(_stack._top);
				//Serial.println(argsLocation);
				temp1 = _stack.pop();	// Arg index
					// Index backwards through the stack (skipping the arg count)
				temp2 = _stack.get(argsLocation - (1+temp1)); // Get the param
				//Serial.println(temp1);
				//Serial.println(temp2);
				_stack.push(temp2);
				break;
			
			case OP_WHILE:
				temp1 = _stack.pop(); // result of condition expression
				if (temp1) // if true then get the block start address
					_address.asShort = _stack.top();	
				else
					_stack.pop();	// else dispose of the block start address
				break;
				
			case OP_REPEAT:
				temp1 = _stack.pop(); // temp1 = list initial address
				temp2 = _stack.pop(); // temp2 = argument to test
				if (temp2)
				{
					_address.asShort = temp1;
					temp2--;
					_stack.push(temp2);
					_stack.push(temp1);
				}
				break;
				
			case OP_FOR:
				{
					//Serial.println("--");
					//Serial.println(_stack._top);
					temp1 = _stack.pop(); // temp1 = Address of top of block
					temp2 = _stack.pop(); // temp2 = step 
					temp3 = _stack.pop(); // temp3 = to
					temp4 = _stack.pop(); // temp4 = from
					temp5 = _stack.pop(); // temp5 = index of counter variable
					
					//Serial.println(temp1);
					//Serial.println(temp2); 
					//Serial.println(temp3); 
					//Serial.println(temp4);
					//Serial.println(temp5);
						// Test msb of counter index to see if this is the
						// first iteration.
					bool firstTime = (temp5 & 128) == 128;	
					if (firstTime)
					{
						temp5 &= ~128;
						temp6 = temp4;	// Counter = from
					}
					else
					{	
						temp6 = _temporaries[temp5];
						temp6 += temp2; // Increment counter
					}
					_temporaries[temp5] = temp6;
					//Serial.println(temp6);
					//Serial.println(",");
					//Serial.println(temp1);
					//Serial.println(temp2); 
					//Serial.println(temp3); 
					//Serial.println(temp4); 
					//Serial.println(temp5);
						// If step > 0 then assume from < to else assume from > to
					bool keepGoing = (temp2 > 0) ? (temp6 <= temp3) : (temp6 >= temp3);
					if (keepGoing || firstTime)
					{
						_address.asShort = temp1; // reiterate
						_stack.push(temp5);
						_stack.push(temp4);
						_stack.push(temp3);
						_stack.push(temp2);
						_stack.push(temp1);
						
					}
					//Serial.println(_stack._top);
					//Serial.println("--");
				}
				
				break;


			case OP_IF:
				temp1 = _stack.pop(); // temp1 = list initial address
				temp2 = _stack.pop(); // temp2 = argument to test
				if (temp2)
				{
					_address.asShort = temp1;
					temp2--;
					_stack.push(temp2);
					_stack.push(temp1);
				}
				break;

// IFELSE starts with address of THEN and ELSE lists (and CONDITIONAL)
//  on the stack. CONDITIONAL is tested and appropriate list is run. The
//	DONE flag (0x0fff) is pushed instead of THEN list address. When IFELSE
//  is again encountered, DONE is detected and execution falls thru.

			case OP_IFELSE:
				temp1 = _stack.pop(); // temp1 = ELSE list start
				temp2 = _stack.pop(); // temp2 = THEN list start
				temp3 = _stack.pop(); // temp3 = argument to test
				if (temp2 != 0x0fff)	// check for done flag
				{
					if (temp3)
					{
						_address.asShort = temp2; // the "THEN" list
						temp2 = 0x0fff;	// set the done flag
						_stack.push(temp3);
						_stack.push(temp2);
// No need to push temp1 here since it will be pushed when ELSE list is
//	encountered after THEN runs.
					}
					else
					{
						_address.asShort = temp1;	// the "ELSE" list
						temp2 = 0x0fff;	// set the done flag
						_stack.push(temp3);
						_stack.push(temp2);
						_stack.push(temp1);
					}
				}
				break;


			case OP_BEEP:
				//lcd.print("Beep!          ");
				//Serial.println("-beep-");
				//Serial.println(_address.asShort);
				beep();
				break;

//==================== Modded 1/11/10 ===============================
			// localFlag must be 0 on initial entry (and on exit)
			// It is initialized on entry to code_exec.
			case OP_WAITUNTIL:
				temp1 = _stack.pop(); // temp1 = address of test clause (first time)
								 // temp1 = truth value of conditional (subsequent times)
				if (localFlag == 0x01ff)	// all times but the first
				{
					temp2 = _stack.pop(); // temp2 = address of test clause
					if (!temp1)
					{
						_address.asShort = temp2;		// the test clause
						_stack.push(temp2); 			// save the test clause
					}
					else
					{
						localFlag = 0;	// done, clean up and continue
					}
				}
				else		// come here first time only
				{
					localFlag = 0x01ff;				// set the flag to test conditional
					_address.asShort = temp1;		// the test clause
					_stack.push(temp1); 			// save the test clause
				}
				break;
//====================End of Mod ===================================

			case OP_LOOP:
				temp1 = _stack.pop(); // temp1 = list initial address
				_address.asShort = temp1;
				_stack.push(temp1);
				break;


			case OP_WAIT:
				delay(100*_stack.pop());
				break;

//==================== Added 1/11/10 ===============================
			case OP_TIMER:
				
				_stack.push(_timerCount);
				break;

			case OP_RESETT:
				_timerCount = 0;
				break;
//====================End of Add ===================================

			case OP_SEND:
				serialWrite(_stack.pop());
				delay(100);
				break;

// ================== BEGIN UPDATE 20100519 ========================
			case OP_IR:
				if (serialRead(&chTemp))
					_stack.push((int)chTemp);
				else
					_stack.push(-1);	// Hmmm... not satisfactory
				delay(100);
				break;

			case OP_NEWIR:
				temp1 = serialAvailable();
				_stack.push(temp1);
				delay(100);
				break;

// ==================== END UPDATE 20100519 ========================

			case OP_RANDOM:
				_stack.push(temp1 = rand());
				break;

			case OP_PLUS:
				_stack.push(temp1 = _stack.pop()+_stack.pop());
				break;

			case OP_MINUS:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push(temp1 -= temp2);
				break;

			case OP_MUL:
				_stack.push(temp1 = _stack.pop()*_stack.pop());
				break;

			case OP_DIV:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push(temp1 = temp1/temp2);
				break;

			case OP_REMAIN_DIV:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push(temp1 = temp1 % temp2);
				break;


			case OP_EQUAL:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 == temp2));
				break;


			case OP_GREATER_THAN:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 > temp2));
				break;


			case OP_LESS_THAN:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 < temp2));
				break;


			case OP_AND:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 & temp2));
				break;


			case OP_OR:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 | temp2));
				break;


			case OP_XOR:
				temp2 = _stack.pop();
				temp1 = _stack.pop();
				_stack.push((temp1 ^ temp2));
				break;

			case OP_NOT:
				_stack.push(temp1 = !_stack.pop());
				break;

			case OP_SETGLOBAL:
				temp1 = _stack.pop();	// Location of variable
				temp2 = _stack.pop();	// Value of variable
				_globals[temp1] = temp2;
				break;

			case OP_GLOBAL:
				_stack.push(_globals[_stack.pop()]);
				break;
				
			case OP_SETTEMP:
				temp1 = _stack.pop();	// Location of variable
				temp2 = _stack.pop();	// Value of variable
				_temporaries[temp1] = temp2;
				break;

			case OP_GETTEMP:
				_stack.push(_temporaries[_stack.pop()]);
				break;
/*
			case RECORD:
				local_temp = pop16();
				modbus_memory[modbus_data_ptr] = local_temp;
				modbus_data_ptr++;
			break;


			case RECALL:
				local_temp = modbus_memory[modbus_data_ptr];
				push16(local_temp);
				modbus_data_ptr++;
			break;


			case RESETDP:
				modbus_data_ptr = 0;
			break;


			case SETDP:
				local_temp = pop16();
				modbus_data_ptr = local_temp;
			break;


			case ERASE:
				local_temp = 0;
				modbus_memory[modbus_data_ptr] = local_temp;
				modbus_data_ptr++;
			break;

*/
			case OP_TALK_TO_MOTORS:
				temp1 = _stack.pop();
				_selectedMotors = (Motors::Selected)temp1;
				break;
				
			case OP_SEL_A:
				_selectedMotors = Motors::MOTOR_A;
				break;
			case OP_SEL_B:
				_selectedMotors = Motors::MOTOR_B;
				break;
			case OP_SEL_AB:
				_selectedMotors = Motors::MOTOR_AB;
				break;


			case OP_THISWAY:
				_motors.setDirection(_selectedMotors, MotorBase::THIS_WAY);
				break;


			case OP_THATWAY:
				_motors.setDirection(_selectedMotors, MotorBase::THAT_WAY);
				break;

			case OP_RD:
				_motors.reverseDirection(_selectedMotors);
				break;
				
			case OP_SETPOWER:
				temp1 = _stack.pop();
				if (temp1 > 7)	
					temp1 = 7;
				_motors.setPower(_selectedMotors, (byte)temp1);
				break;


			case OP_BRAKE:
				_motors.setBrake(_selectedMotors, MotorBase::BRAKE_ON);
				break;

			case OP_ON:
				_motors.on(_selectedMotors);
				break;

			case OP_ONFOR:
				_motors.on(_selectedMotors);
				delay(100*_stack.pop());
				_motors.off(_selectedMotors);
				break;

			case OP_OFF:
				_motors.off(_selectedMotors);
				break;
			
/* Only two motors supported at present unfortunately
			case SEL_C:
				motorMask = motorMask_C;
			break;
			case SEL_D:
				motorMask = motorMask_D;
			break;
			case SEL_CD:
				motorMask = motorMask_C;
				motorMask |= motorMask_D;
			break;
			case SEL_ABCD:
				motorMask = motorMask_A;
				motorMask |= motorMask_B;
				motorMask |= motorMask_C;
				motorMask |= motorMask_D;
			break;
*/



			case OP_SENSORB:
				_stack.push(_sensors.B());
				break;


/*
			case SENSORA:	// SENSOR x FOR INEX MODE
				temp2 = INEX_MODE;
				if (interpreter_mode == temp2)
				{
					temp1 = pop16();
				}
				else
				{
					temp1 = 0;
				}
				push16(adc_read(temp1));
			break;
*/
			case OP_SENSORA:
				_stack.push(_sensors.A());
				break;


		/*
			case SWITCHA:
				temp2 = INEX_MODE;
				if (interpreter_mode == temp2)
				{
					temp1 = pop16();
				}
				else
				{
					temp1 = 0;
				}
				push16(adc_read(0)>>7);
			break;
			*/
			case OP_SWITCHA:
				_stack.push(_sensors.A()>>7);
				break;


			case OP_SWITCHB:
				_stack.push(_sensors.B()>>7);
				break;

			case OP_STOP1:
				_states.setRunRequest(STOPPED);
				break;

/*
			case BABUINO_01:
				beep();
				break;


			case BABUINO_02:
				beep();
				beep();
				break;


			case BABUINO_03:
				beep();
				beep();
				beep();
				break;
			*/
			case OP_SENSORC:
				_stack.push(_sensors.C());
				break;

			case OP_SENSORD:
				_stack.push(_sensors.D());
				break;

			case OP_SWITCHC:
				_stack.push(_sensors.C()>>7); //push16(adc_read(2)>>7);
				break;

			case OP_SWITCHD:
				_stack.push(_sensors.D()>>7); //push16(adc_read(3)>>7);
				break;

			case OP_LEDON:
				userLed(true);	// set the correct bit
				break;

			case OP_LEDOFF:
				userLed(false);
				break;
				
			default:
				beep();	// let's get an indication for now.
				break;

		}
	}
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
void 
CricketProgram::beep() const
{
	piezoBeeper(127);
	delay(50);
	piezoBeeper(0);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
void 
CricketProgram::double_beep() const
{
	beep();
	delay(50);
	beep();
}

