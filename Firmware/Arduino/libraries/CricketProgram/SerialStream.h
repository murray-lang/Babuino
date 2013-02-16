#ifndef __SERIALSTREAM_H__
#define __SERIALSTREAM_H__

#define DECLARE_SERIAL_STREAM(strm)				\
	inline byte serialAvailable()				\
	{											\
		return strm.available();				\
	}											\
												\
	inline char serialRead()					\
	{											\
		char buf[1];							\
		char rc = strm.readBytes(buf, 1);		\
		if (rc > 0)								\
			return buf[0];						\
		return -1;								\
	}											\
												\
	inline char serialWrite(char val)			\
	{											\
		return strm.write(val);					\
	}

#endif // __SERIALSTREAM_H__