#ifndef __PROGRAM_HPP__
#define __PROGRAM_HPP__
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
//------------------------------------------------------------------------------
// This software was written for the Babuino Project
// Author: Murray Lang
// 
// Program base class. A place to put functionality that would be common to
// many programs.   
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

//#include "ProgramStorage.hpp"
//#include <Serial.h>

class Program
{
public:
	Program(int startAddress)
	{
		//_storage = 0;
	}
	
	virtual bool setup() = 0;
	virtual int  run() = 0;
	
protected:
	//ProgramStorage * _storage;
};




#endif // __PROGRAM_HPP__
