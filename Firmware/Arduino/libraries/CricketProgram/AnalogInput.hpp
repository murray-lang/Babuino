#ifndef __ANALOGINPUT_HPP__
#define __ANALOGINPUT_HPP__
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
// The purpose of this code is to define an analog input pin directly into code
// space, hence avoiding the need to store pin numbers as a class member in RAM.
// 
// All rights in accordance with the Babuino Project. 
//------------------------------------------------------------------------------

#define ANALOG_INPUT(name, pin)		\
	inline int name() const					\
	{										\
		return analogRead(pin);				\
	}

#endif /* __ANALOGINPUT_HPP__ */
