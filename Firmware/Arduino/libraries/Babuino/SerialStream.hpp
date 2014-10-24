#ifndef __SERIALSTREAM_H__
#define __SERIALSTREAM_H__
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
#define DECLARE_SERIAL_STREAM(strm)				\
	inline byte serialAvailable()				\
	{											\
		return strm.available();				\
	}											\
												\
	inline bool serialRead(uint8_t* pByte)		\
	{											\
		char buf[1];							\
		char rc = strm.readBytes(buf, 1);		\
		if (rc > 0)								\
		{										\
			*pByte = (uint8_t)buf[0];					\
			return true;						\
		}										\
		return false;							\
	}											\
												\
	inline char serialWrite(uint8_t val)		\
	{											\
		return strm.write(val);					\
	}

#endif // __SERIALSTREAM_H__
