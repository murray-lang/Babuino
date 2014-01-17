#ifndef __GOGOHANDLER__
#define __GOGOHANDLER__
/* -----------------------------------------------------------------------------
   Copyright 2014 Murray Lang

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   -----------------------------------------------------------------------------
 */
enum eGogoCommands
{
	gogoHeader0			= 0x54,
	gogoHeader1			= 0xFE,
	gogoAck0			= 0x55,
	gogoAck1			= 0xFF,
	gogoMotorControl	= 2,
	gogoSetMotorControl	= 3,
	gogoTalkToMotor		= 4,
	gogoSetBurstMode	= 5,
	gogoMiscControls	= 6,
	gogoExtendedCmd		= 7
};

enum eGogoMotorParms
{
	gogoMotorOn			= 0,
	gogoMotorOff		= 1,
	gogoMotorReverse	= 2,
	gogoMotorThisWay	= 3,
	gogoMotorThatWay	= 4,
	gogoMotorCoast		= 5
};


#endif //__GOGOHANDLER__