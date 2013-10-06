//------------------------------------------------------------------------------
// File: CricketCommunication.js
// Purpose: Provide serial communications and handshaking to program a Babuino
// Author: Murray Lang
// Licensing: Not to be copied by anyone other than Babuino developers until
//            further notice. 
//
// Note: Written to use chrome.serial and to be part of a Chrome "Packaged
//       Application"
//
// The main class (the one that the outside world might be interested in) is
// CricketProgrammer.
// 
// The class of most interest if trying to understand the code is Sequence.
// See comments for Sequence below.
//------------------------------------------------------------------------------ 
const device = 'COM9';	// Hard-wired for now - sorry
const serial = chrome.serial;
const resetTimeout       = 1500;
const connectTimeout     = 500;
const byteTimeout        = 50;
const startAddress       = 0;
const cmdSetStartAddress = 131;
const cmdWriteBytes      = 133;


function arrayBufferToString(buf) 
{
	var byteArray = new Uint8Array(buf);
	var str = String.fromCharCode.apply(null, byteArray);
	return str;
};

function arrayBufferToBytes(buf) 
{
	var byteArray = new Uint8Array(buf);
	return byteArray;
};

function stringToArrayBuffer(str) 
{
	var buf=new ArrayBuffer(str.length);
	var bufView=new Uint8Array(buf);
	for (var i=0; i<str.length; i++) 
	{
		bufView[i]=str.charCodeAt(i);
	}
	return buf;
};

function bytesToArrayBuffer(bytes) 
{
	var buf     = new ArrayBuffer(bytes.length);
	var bufView = new Uint8Array(buf);
	
	for (var i = 0; i < bytes.length; i++) 
	{
		bufView[i] = bytes[i];
	}
	return buf;
};

//------------------------------------------------------------------------------
// class: Sequence
// I/O in JavaScript employs an asynchronous paradigm, in which API calls
// might return before the required action is completed. These calls all expect
// a callback function to be provided as a parameter. This is fine, and it means
// that a JavaScript page/application can remain responsive to user input events
// etc. while performing the I/O.
//
// The problem with this approach when applied to serial communication is that
// the sequence of calls involved in a handshaking protocol is not written on 
// the page. Another programmer trying to understand the sequence of function
// calls has to follow the trail of callbacks and keep the sequence in his/her 
// head. The authoring programmer doesn't have a much easier time of it.
//
// The other problem is when you are developing the code and trying things out.
// It requires lots of stitching and unstitching to splice another function call
// into a handshaking sequence.
//
// To deal with this I have come up with the Sequence class, which accepts an
// array of references to functions to be called in sequence. The way that it
// works requires that those functions have knowledge of being in one of these
// sequences, but they don't have to know their place in that sequence. 
//------------------------------------------------------------------------------
function Sequence(context, sequence, repeat, leave)
{
	this.context      = context; // The class of which the functions are members
	this.currentIndex = 0;
	this.sequence     = sequence; // The array of functions to call in sequence
	this.repeat       = repeat;   // True if the sequence is a loop
	this.leave        = leave;	  // The function that gets us out of here
}

//------------------------------------------------------------------------------
// Point to the beginning of the sequence
//------------------------------------------------------------------------------
Sequence.prototype.start = 
	function()
	{
		this.currentIndex = 0;
		this.current();
	}

//------------------------------------------------------------------------------
// With this, a function can get a reference to itself!
// Provided for completeness and not actually used at the time of writing.
//------------------------------------------------------------------------------	
Sequence.prototype.getCurrent = 
	function()
	{
		return this.sequence[this.currentIndex].bind(this.context);
	};
	
//------------------------------------------------------------------------------
// Get a reference to the next function in the sequence after yourself.
// The caller typically gives the result as a callback parameter to an
// asynchronous function.
//------------------------------------------------------------------------------	
Sequence.prototype.getNext = 
	function(increment)
	{
			// Default behaviour is to automatically post-increment
		if (increment === undefined)
			increment = true;
		var i = this.getNextIndex();
			// If we've reached the end then call the leave() function
		if (i == -1)
		{	
			this.leave.bind(this.context);
			return;
		}
		if (increment)
			this.currentIndex = i;
			
		return this.sequence[i].bind(this.context);
	};

//------------------------------------------------------------------------------
// Calculates the next index in the sequence. It's a calculation because the
// sequence might be a loop.
//------------------------------------------------------------------------------
Sequence.prototype.getNextIndex = 
	function()
	{
			// Already reached the end?
		if (this.currentIndex == this.sequence.length - 1)
		{
				// Is it a loop?
			if (this.repeat)
				return 0; // Yes, loop back to the start
			else
				return -1; // Flag that it's the end
		}
		else
		{
			return this.currentIndex + 1; // Just point to the next one
		}
		
	};

//------------------------------------------------------------------------------
// Makes the calling code slightly neater
//------------------------------------------------------------------------------	
Sequence.prototype.current = 
	function()
	{
		this.getCurrent()();
	};

//------------------------------------------------------------------------------
// Makes the calling code slightly neater
//------------------------------------------------------------------------------	
Sequence.prototype.next = 
	function()
	{
		this.getNext()();
	};

//------------------------------------------------------------------------------
// The main class in this file.
// This is what the outside world instantiates to get Cricket comms
//------------------------------------------------------------------------------
function CricketProgrammer(device, normalCallback, errorCallback)
{
	this.device = device;
	this.normalCallback = normalCallback;
	this.errorCallback = errorCallback;
	
	this.data = null;
	this.connectionId = -1;
	
		// The Cricket programming sequence
		// Being able to declare the sequence in this way is the reason
		// for the existence of the Sequence class.
	var seq1 = 
	[
		this.connectSerial,	    
		this.connectSerialCallback,
		
		this.waitForArduinoReset,						

		this.writeCricketCheck,	
		this.writeCallback, 
		this.wait,
		this.readCricketAck,    
		this.verifyCricketAck,
		
		this.writeStartAddress,
		this.writeCallback,
		this.wait,
		this.readStartAddressReply,
		this.readStartAddressReplyCallback,
		
		this.writeByteCount,
		this.writeCallback,
		this.wait,
		this.readByteCountReply,
		this.readByteCountReplyCallback,
		
		this.transfer,	// This involves another class using another sequence. See below
		this.transferCallback,
		
		this.disconnect,
		this.disconnectCallback
	];
	this.mainSequence = new Sequence(this, seq1, false, this.leave);
	
	var seq2 = 
	[
		this.disconnect,
		this.disconnectCallback
	];
	this.cleanupSequence = new Sequence(this, seq2, false, this.leave);
	
	this.sequence = this.mainSequence;
}

CricketProgrammer.prototype.setDevice =
	function(device)
	{
		this.device = device;
	};
	
CricketProgrammer.prototype.setData =
	function(data)
	{
		var asArray = data.split('\n');
	
			// Now parse the strings into numbers.
		for (var i = 0; i < data.length; i++)
		{
			asArray[i] = parseInt(asArray[i], 10);
		}
			// Now convert it to an array of bytes
		this.data = new Uint8Array(asArray);
	};
	
CricketProgrammer.prototype.start = 
	function(data)
	{
		this.sequence.start();
	};


CricketProgrammer.prototype.cleanup = 
	function(reason)
	{
		this.normalCallback("Cleaning up: " + reason);
		this.errorCallback(reason);
		this.sequence = this.cleanupSequence;
		this.sequence.start();
	};

CricketProgrammer.prototype.connectSerial = 
	function()
	{
		//log("connectSerial()");
		serial.open(this.device, {bitrate: 9600}, this.sequence.getNext());
	}
	
CricketProgrammer.prototype.connectSerialCallback = 
	function(connectionInfo)
	{
		//log("connectSerialCallback()");
		this.connectionId = connectionInfo.connectionId;
		this.normalCallback("Opened: " + this.device);
		this.sequence.next();
	}

CricketProgrammer.prototype.writeCricketCheck = 
	function() 
	{
		//log("writeCricketCheck()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		var buf = bytesToArrayBuffer([0x87, 0x00]);
		serial.write(this.connectionId, buf, this.sequence.getNext());
	};

CricketProgrammer.prototype.writeCallback = 
	function(writeInfo) 
	{
		//log("writeCallback()");
		//log("wrote:" + writeInfo.bytesWritten);
		this.sequence.next();
	};

CricketProgrammer.prototype.waitForArduinoReset = 
	function() 
	{
		//log("wait()");
		setTimeout(this.sequence.getNext(), resetTimeout);
	};
	
CricketProgrammer.prototype.wait = 
	function() 
	{
		//log("wait()");
		setTimeout(this.sequence.getNext(), connectTimeout);
	};
	
CricketProgrammer.prototype.readCricketAck =
	function() 
	{
		//log("readCricketAck()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		serial.read(this.connectionId, 3, this.sequence.getNext());
	};

CricketProgrammer.prototype.verifyCricketAck =
	function(readInfo) 
	{
		//log("verifyCricketAck()");
		if (readInfo.bytesRead < 3)
		{
			this.cleanup("No acknowledgement from cricket device");
			return;
		}
		var reply = arrayBufferToBytes(readInfo.data);
		
		if (reply[0] != 0x87 || reply[1] != 0x00 || reply[2] != 0x37) 
		{
			this.cleanup("Invalid acknowledgement from cricket device");
			return;
		}
		this.normalCallback("Connection successful!");
		this.sequence.next();
	};

CricketProgrammer.prototype.writeStartAddress = 
	function() 
	{
		//log("writeStartAddress()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		var buf = bytesToArrayBuffer([cmdSetStartAddress, (startAddress >> 8) & 0xff , startAddress & 0xff]);
		serial.write(this.connectionId, buf, this.sequence.getNext());
	};	
	
CricketProgrammer.prototype.readStartAddressReply =
	function() 
	{
		//log("readStartAddressReply()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		serial.read(this.connectionId, 3, this.sequence.getNext());
	};

CricketProgrammer.prototype.readStartAddressReplyCallback =
	function(readInfo) 
	{
		//log("readStartAddressReplyCallback()");
		if (readInfo.bytesRead < 3)
		{
			this.cleanup("Not enough reply bytes");
			return;
		}
		var reply = arrayBufferToBytes(readInfo.data);
		
		if (   reply[0] != cmdSetStartAddress 
			|| reply[1] != (startAddress >> 8) & 0xff 
			|| reply[2] != startAddress & 0xff) 
		{
			this.cleanup("Unexpected reply from cricket device");
			return;
		}
		this.normalCallback("Start address written successfully!");
		this.sequence.next();
	};	

CricketProgrammer.prototype.writeByteCount = 
	function() 
	{
		//log("writeByteCount()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		var codeLength = this.data.length;
		var buf = bytesToArrayBuffer([cmdWriteBytes, (codeLength >> 8) & 0xff , codeLength & 0xff]);
		serial.write(this.connectionId, buf, this.sequence.getNext());
	};	
	
CricketProgrammer.prototype.readByteCountReply =
	function() 
	{
		//log("readByteCountReply()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		serial.read(this.connectionId, 3, this.sequence.getNext());
	};

CricketProgrammer.prototype.readByteCountReplyCallback =
	function(readInfo) 
	{
		//log("readByteCountReplyCallback()");
		if (readInfo.bytesRead < 3)
		{
			this.cleanup("Not enough reply bytes");
			return;
		}
		
		var codeLength = this.data.length;
		var reply = arrayBufferToBytes(readInfo.data);
		
		if (   reply[0] != cmdWriteBytes 
			|| reply[1] != (codeLength >> 8) & 0xff 
			|| reply[2] != codeLength & 0xff) 
		{
			this.cleanup("Unexpected reply from cricket device");
			return;
		}
		this.normalCallback("Byte count written successfully!");
		this.sequence.next();
	};

CricketProgrammer.prototype.transfer =
	function()
	{
			// Use another class (defined below) to do the transfer.
		var comms = new CricketCodeTransfer(
			this.connectionId, 
			this.data, 
			this.sequence.getNext(),
			this.normalCallback,
			this.errorCallback);
		comms.start();
	};
	
CricketProgrammer.prototype.transferCallback = 
	function(success) 
	{
		if (success)
			this.normalCallback("Code transfer successful");
		else
			this.errorCallback("Code transfer failed");
		this.sequence.next();
	};	

CricketProgrammer.prototype.disconnect =
	function() 
	{	
		//log("disconnect()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
		serial.close(this.connectionId, this.sequence.getNext());
		this.connectionId = -1;
	};
	
CricketProgrammer.prototype.disconnectCallback =
	function(result) 
	{
		//log("disconnectCallback()");
		if (result)
			this.normalCallback("disconnection successful");
		else
			this.errorCallback("disconnection failed");
	}


//------------------------------------------------------------------------------
// This class performs the transfer of the virtual machine code.
// It has its own sequence, which is set up as a loop.
//------------------------------------------------------------------------------	
function CricketCodeTransfer(connectionId, data, returnFunc, normalCallback, errorCallback)
{
	this.connectionId = connectionId;
	this.data = data;
	this.normalCallback = normalCallback;
	this.errorCallback = errorCallback;
	this.dataIndex = 0;	// A cursor for stepping through the data
	
		//this Sequence loops through the data and sends it
	var loop = 
	[
		this.writeNextCode,
		this.writeCallback,
		this.wait,
		this.readCodeReply,
		this.readCodeReplyCallback
	];
	this.sequence = new Sequence(this, loop, true, this.leave);
		//The caller wants you to go here when you've finished
	this.returnFunc = returnFunc;
}

CricketCodeTransfer.prototype.start = 
	function()
	{
		this.sequence.start();
	};

CricketCodeTransfer.prototype.leave = 
	function()
	{
		this.returnFunc(true);
	};
	
CricketCodeTransfer.prototype.writeNextCode = 
	function()
	{
		//log("CricketCodeTransfer.writeNextCode()");
			// Only works for open serial ports.
		if (this.connectionId < 0) 
		{
			this.errorCallback("Invalid connection");
			return;
		}
			// Make an ArrayBuffer out of it so that it can be transmitted.
		var buf = bytesToArrayBuffer([this.data[this.dataIndex]]);
		serial.write(this.connectionId, buf, this.sequence.getNext());
	};

CricketCodeTransfer.prototype.writeCallback = 
	function(writeInfo) 
	{
		this.sequence.next();
	};
	
CricketCodeTransfer.prototype.wait = 
	function() 
	{
		setTimeout(this.sequence.getNext(), byteTimeout);
	};	

CricketCodeTransfer.prototype.readCodeReply = 
	function() 
	{
			//Reply is two bytes: an echo followed by its bitwise complement
		serial.read(this.connectionId, 2, this.sequence.getNext());
	};

CricketCodeTransfer.prototype.readCodeReplyCallback =
	function(readInfo) 
	{
		//log("CricketCodeTransfer.readCodeReplyCallback()");
		if (readInfo.bytesRead < 2)
		{
			this.errorCallback("Not enough reply bytes from cricket device");
			this.returnFunc(false); // Return to the main sequence with failure
			return;
		}
			// The first thing back is always an echo
		var reply = arrayBufferToBytes(readInfo.data);
			// Make sure the echo is (an echo)
		var expected = this.data[this.dataIndex];
		if (reply[0] != expected || reply[1] != (~expected & 0xff))
		{
			this.errorCallback("Unexpected reply to a code byte that was sent.");
			this.returnFunc(false); // Return to the main sequence with failure
			return;
		}
		if (this.dataIndex == this.data.length - 1)
		{
				// Reached the end of the data. Return to the main sequence
				// with success.
			this.returnFunc(true);
			return;
		}
		this.dataIndex++;	// Move to the next byte
		this.sequence.next();
	};		

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// This is test code only
/*
var data = "0\n3\n9\n85\n1\n10\n16\n86\n1\n10\n16\n4\n15\n7"
var cricket = new CricketProgrammer(device, data);

log("Hello there!");


document.querySelector('button').addEventListener(
	'click', 
	function() 
	{
		cricket.start();
	}
);
*/
	
