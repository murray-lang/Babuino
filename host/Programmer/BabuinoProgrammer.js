/*-----------------------------------------------------------------------------
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
// File: BabuinoProgrammer.js
// Purpose: Provide serial communications and handshaking to program a Babuino
// Author: Murray Lang
// Licensing: Not to be copied by anyone other than Babuino developers until
//            further notice. 
//
// Note: Written to use chrome.serial and to be part of a Chrome "Packaged
//       Application"
//
// The main class (the one that the outside world might be interested in) is
// BabuinoProgrammer.
// 
// The class of most interest if trying to understand the code is Sequence.
// See comments for Sequence below.
//------------------------------------------------------------------------------
var SerialPort = require("serialport").SerialPort;
var fs         = require('fs');

const resetTimeout       = 1500;
const connectTimeout     = 500;
const byteTimeout        = 15;
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
    var buf     = new Buffer(bytes);
    /*
	var buf     = new Buffer(bytes.length);
	var bufView = new Uint8Array(buf);
	
	for (var i = 0; i < bytes.length; i++) 
	{
		bufView[i] = bytes[i];
	}
	*/
	return buf;
};

function ReceiveBuffer()
{
	this.cursor = 0;
	this.availableBytes = 0;
	this.buffers = [];
}

ReceiveBuffer.prototype.addData = 
	function (data)
	{
		var bytes = arrayBufferToBytes(data);
			
		this.buffers.push(bytes);
		this.availableBytes += bytes.length;
	};
/*	
ReceiveBuffer.prototype.availableBytes = 
	function ()
	{
		var result = 0;
		for (var i = 0; i < this.buffers.length; i++)
			result += this.buffers[i].length;
		return result;
	};
*/	
ReceiveBuffer.prototype.getData = 
	function (requiredBytes)
	{
		if (requiredBytes > this.availableBytes)
			throw new Error("Trying to get more bytes than are available in the receive buffer.");
		var retrievedBytes = 0;	
		var result = new Uint8Array(requiredBytes);
		var stillRequired = requiredBytes; 
		while (stillRequired > 0)
		{
			var availableFromFirst = this.buffers[0].length - this.cursor;
			var requiredFromRest = stillRequired - availableFromFirst;
			if (requiredFromRest < 0)
			{
					// There will be some left over in the first buffer after
					// the required bytes have been copied.
				result.set(this.buffers[0].subarray(this.cursor, this.cursor + stillRequired), retrievedBytes);
				retrievedBytes += stillRequired;
				this.cursor += stillRequired;
				
			}
			else 
			{
					// All of the available bytes in the first buffer are required.
				result.set(this.buffers[0].subarray(this.cursor), retrievedBytes);
				retrievedBytes += availableFromFirst;
				this.cursor = 0;
				this.buffers.shift();
			}
			stillRequired = requiredBytes - retrievedBytes;
		}
		this.availableBytes -= retrievedBytes;
		return result;
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
function Sequence(sequence, repeat, leave)
{
	this.currentIndex = 0;
	this.sequence     = sequence; // The array of functions to call in sequence
	this.repeat       = repeat;   // True if the sequence is a loop
	//this.leave        = leave.bind(context);	  // The function that gets us out of here
	this.leave        = leave;	  // The function that gets us out of here
}

//------------------------------------------------------------------------------
// Point to the beginning of the sequence
//------------------------------------------------------------------------------
Sequence.prototype.run = 
	function()
	{
		this.currentIndex = 0;
		this.current();
	};

//------------------------------------------------------------------------------
// With this, a function can get a reference to itself!
// Provided for completeness and not actually used at the time of writing.
//------------------------------------------------------------------------------	
Sequence.prototype.getCurrent = 
	function()
	{
		//return this.sequence[this.currentIndex].bind(this.context);
		return this.sequence[this.currentIndex];
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
			this.leave();
			return;
		}
		if (increment)
			this.currentIndex = i;
			
		//return this.sequence[i].bind(this.context);
		return this.sequence[i];
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
function BabuinoProgrammer(device, normalCallback, errorCallback)
{
	this.device = device;
    this.serialPort = null;
	this.normalCallback = normalCallback;
	this.errorCallback = errorCallback;
	
	this.data = null;
	this.connectionId = -1;
	//this.onReadEvent = new chrome.Event(); // For the new serial API
	this.rxBuffer = new ReceiveBuffer();   // ditto
	
		// The Cricket programming sequence
		// Being able to declare the sequence in this way is the reason
		// for the existence of the Sequence class.
	var seq1 = 
	[
		this.connectSerial.bind(this),     
		this.connectSerialCallback.bind(this),

        this.flushReceivedData.bind(this),

		this.wait.bind(this, resetTimeout),	// Wait for the Arduino to reset					

		this.writeCricketCheck.bind(this),	
		this.writeCallback.bind(this), 
		this.wait.bind(this, connectTimeout),
		//this.readCricketAck.bind(this),    
		this.verifyCricketAck.bind(this),
		
		this.writeStartAddress.bind(this),
		this.wait.bind(this, connectTimeout),
		this.verifyStartAddressReply.bind(this),
		
		this.writeByteCount.bind(this),
		this.wait.bind(this, connectTimeout),
		this.verifyByteCountReply.bind(this),
		
		this.transfer.bind(this),// This involves another class using another sequence. See below
		this.transferCallback.bind(this),
		
		this.disconnect.bind(this),
		this.disconnectCallback.bind(this),
        this.done.bind(this)
	];
	this.mainSequence = new Sequence(seq1, false, this.leave);
	
	var seq2 = 
	[
		this.disconnect.bind(this), 
		this.disconnectCallback.bind(this),
        this.done.bind(this)
	];
	this.cleanupSequence = new Sequence(seq2, false, this.leave);
	
	this.sequence = this.mainSequence;
}

BabuinoProgrammer.prototype.setDevice =
	function(device)
	{
		this.device = device;
	};
	
BabuinoProgrammer.prototype.setData =
	function(data)
	{
		var asArray = data.split('\n');
		var asInts = [];
	
			// Now parse the strings into numbers.
		for (var i = 0; i < asArray.length; i++)
		{
			asInts.push(parseInt(asArray[i], 10));
		}
			// Now convert it to an array of bytes
		this.data = new Uint8Array(asInts);
	};
	
BabuinoProgrammer.prototype.run =
	function(data)
	{
        this.setData(data);
		this.sequence.run();
	};


BabuinoProgrammer.prototype.cleanup =
	function(reason)
	{
		this.normalCallback("Cleaning up: " + reason);
		this.errorCallback(reason);
		this.sequence = this.cleanupSequence;
		this.sequence.run();
	};
	
BabuinoProgrammer.prototype.leave =
	function()
	{
		// Do nothing at this stage
	};

// New methods to deal with the change in the serial API
BabuinoProgrammer.prototype.onReceive =
	function(data)
	{
		this.rxBuffer.addData(data);
	};

BabuinoProgrammer.prototype.connectSerial =
	function()
	{
		//log("connectSerial()");
		try
		{
            this.serialPort = new SerialPort(this.device, {baudrate: 9600}, false);
            this.serialPort.open(this.sequence.getNext())
			//serial.connect(this.device, {bitrate: 9600}, this.sequence.getNext());
		}
		catch (err)
		{
			this.cleanup("Error opening serial port - " + err.message);
		}
	}
	
BabuinoProgrammer.prototype.connectSerialCallback =
	function(error)
	{
		//log("connectSerialCallback()");
		//this.connectionId = connectionInfo.connectionId;
        if (error)
        {
            this.errorCallback("Failed to open: " + error) ;
        }
        else
        {
            this.normalCallback("Opened: " + this.device);
            this.serialPort.on("data", this.onReceive.bind(this));
            this.serialPort.on("Error", function(msg) {
                console.log('Serial error: ' + msg);
            });
            this.sequence.next();
        }
	};
BabuinoProgrammer.prototype.flushReceivedData =
    function()
    {
        this.serialPort.flush(this.flushCallback.bind(this));
        this.sequence.next();
    };

BabuinoProgrammer.prototype.flushCallback =
    function(error)
    {
        if (error)
            this.errorCallback("Error flushing received data: " + error);
    };

BabuinoProgrammer.prototype.writeCricketCheck =
	function() 
	{
		//log("writeCricketCheck()");
			// Only works for open serial ports.
		try
		{
			var buf = bytesToArrayBuffer([0x87, 0x00]);
			this.serialPort.write(buf, this.sequence.getNext());
		}
		catch (err)
		{
			this.cleanup("Error writing Cricket check - " + err.message);
		}		
	};

BabuinoProgrammer.prototype.writeCallback =
	function(error)
	{
		if (error)
		{
			this.cleanup("Error writing Cricket check - " + error);
		}
		else
		{
			this.sequence.next();
		}
		//log("writeCallback()");
		//log("wrote:" + writeInfo.bytesWritten);
		//this.sequence.next(); // Replaced due to new serial API
		//this.onReadLine.addListener(this.sequence.getNext());
	};

BabuinoProgrammer.prototype.wait =
	function(timeout) 
	{
		//log("wait()");
		setTimeout(this.sequence.getNext(), timeout);
	};

BabuinoProgrammer.prototype.verifyCricketAck =
	function()
	{
		//log("verifyCricketAck()");
		try
		{
			
			var reply = this.rxBuffer.getData(3);
			if (reply[0] != 0x87 || reply[1] != 0x00 || reply[2] != 0x37)
			{
				this.cleanup("Invalid acknowledgement from cricket device");
				return;
			}
			this.normalCallback("Connection successful!");
		}
		catch (err)
		{
			this.cleanup("Error reading acknowledgement from cricket device: " + err.message);
			return;
		}
		this.sequence.next();
	};

BabuinoProgrammer.prototype.writeStartAddress =
	function() 
	{
		//log("writeStartAddress()");
			try
		{
			var buf = bytesToArrayBuffer([cmdSetStartAddress, (startAddress >> 8) & 0xff , startAddress & 0xff]);
			this.serialPort.write(buf, this.sequence.getNext());
		}
		catch (err)
		{
			this.cleanup("Error writing start address - " + err.message);
		}
	};	

BabuinoProgrammer.prototype.verifyStartAddressReply =
	function()
	{
		//log("readStartAddressReplyCallback()");
		try
		{
			var reply = this.rxBuffer.getData(3);
			if (   reply[0] != cmdSetStartAddress 
				|| reply[1] != (startAddress >> 8) & 0xff 
				|| reply[2] != startAddress & 0xff) 
			{
				this.cleanup("Unexpected reply to start address");
				return;
			}
			this.normalCallback("Start address written successfully!");
		}
		catch(err)
		{
			this.cleanup("Error reading reply to the start address: " + err.message);
			return;
		}
		this.sequence.next();
	};	

BabuinoProgrammer.prototype.writeByteCount =
	function() 
	{
		//log("writeByteCount()");
		try
		{
			var codeLength = this.data.length;
			var buf = bytesToArrayBuffer([cmdWriteBytes, (codeLength >> 8) & 0xff , codeLength & 0xff]);
			this.serialPort.write(buf, this.sequence.getNext());
		}
		catch (err)
		{
			this.cleanup("Error writing byte count - " + err.message);
		}
	};	
	
BabuinoProgrammer.prototype.verifyByteCountReply =
	function()
	{
		//log("readByteCountReplyCallback()");
		try
		{		
			var codeLength = this.data.length;
			var reply = this.rxBuffer.getData(3);
                // Debugging
            var codeLengthHigh = (codeLength >> 8) & 0xff;
            var codeLengthLow  = codeLength & 0xff;
            if (   reply[0] != cmdWriteBytes
				|| reply[1] != codeLengthHigh
				|| reply[2] != codeLengthLow)
			{
				this.cleanup("Unexpected reply from cricket device");
				return;
			}
			this.normalCallback("Byte count written successfully!");
		}
		catch (err)
		{
			this.cleanup("Error reading reply to the byte count: " + err.message);
			return;
		}
		this.sequence.next();
	};

BabuinoProgrammer.prototype.transfer =
	function()
	{
			// Use another class (defined below) to do the transfer.
		var comms = new CricketCodeTransfer(
			this.serialPort,
			this.data,
			this.rxBuffer,
			this.sequence.getNext(),  // When the transfer's finished, go to the next function in the sequence.
			this.normalCallback,
			this.errorCallback);
		comms.run();
	};
	
BabuinoProgrammer.prototype.transferCallback =
	function(success) 
	{
		if (success)
			this.normalCallback("Code transfer successful");
		else
			this.errorCallback("Code transfer failed");
		this.sequence.next();
	};	

BabuinoProgrammer.prototype.disconnect =
	function() 
	{	
		//log("disconnect()");
		try
		{
            this.serialPort.close(this.sequence.getNext());
		}
		catch (err)
		{
			this.errorCallback("Error closing serial port - " + err.message);
		}
	};
	
BabuinoProgrammer.prototype.disconnectCallback =
	function(error)
	{
		//log("disconnectCallback()");
		if (error)
            this.errorCallback("disconnection failed");
		else
            this.normalCallback("disconnection successful");
        this.sequence.next();
	};

BabuinoProgrammer.prototype.done =
    function()
    {
        console.log("Done.");
        process.exit(0);
    };


//------------------------------------------------------------------------------
// This class performs the transfer of the virtual machine code.
// It has its own sequence, which is set up as a loop.
//------------------------------------------------------------------------------	
function CricketCodeTransfer(serialPort, data, rxBuffer, returnFunc, normalCallback, errorCallback)
{
	this.serialPort = serialPort;
	this.data = data;
	this.rxBuffer = rxBuffer;
	this.normalCallback = normalCallback;
	this.errorCallback = errorCallback;
	this.dataIndex = 0;	// A cursor for stepping through the data
	
		//this Sequence loops through the data and sends it
	var loop = 
	[
		this.writeNextCode.bind(this),
		this.wait.bind(this, byteTimeout),
		this.verifyCodeReply.bind(this)
	];
	this.sequence = new Sequence(loop, true, this.leave);
		//The caller wants you to go here when you've finished
	this.returnFunc = returnFunc;
}

CricketCodeTransfer.prototype.run = 
	function()
	{
		this.sequence.run();
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
		try
		{
				// Make an ArrayBuffer out of it so that it can be transmitted.
			var buf = bytesToArrayBuffer([this.data[this.dataIndex]]);
			this.serialPort.write(buf, this.sequence.getNext());
		}
		catch (err)
		{
			this.errorCallback("Error writing code - " + err.message);
			this.returnFunc(false);
		}
	};

CricketCodeTransfer.prototype.wait = 
	function(timeout) 
	{
		setTimeout(this.sequence.getNext(), timeout);
	};	

CricketCodeTransfer.prototype.verifyCodeReply =
	function()
	{
		//log("CricketCodeTransfer.readCodeReplyCallback()");
		try
		{
			// The first thing back is always an echo
			var reply = this.rxBuffer.getData(2);
				// Make sure the echo is (an echo)
			var expected = this.data[this.dataIndex];
			if (reply[0] != expected || reply[1] != (~expected & 0xff))
			{
				this.errorCallback("Unexpected reply to a code byte that was sent.");
				this.returnFunc(false); // Return to the main sequence with failure
				return;
			}
		}
		catch (err)
		{
			this.errorCallback("Error reading reply to code byte:" + err.message);
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

//var data = "0\n3\n9\n85\n1\n10\n16\n86\n1\n10\n16\n4\n15\n7"
//var cricket = new BabuinoProgrammer(device, data);

function normalCallback(str)
{
    console.log(str);
}

function errorCallback(str)
{
    console.error(str);
}

if (process.argv.length > 2)
{
    var codes;
    var codeFileName = process.argv[2];
    var serialPort = process.argv[3];
    try
    {
        codes = fs.readFileSync(codeFileName, { encoding: 'utf8' });
    }
    catch (e)
    {
        console.error("Error reading file " + codeFileName + ": " + e.message);
        process.exit(1);
    }
    console.log("Sending byte codes in file " + codeFileName + " to " + serialPort);

    var bp = new BabuinoProgrammer(serialPort, normalCallback, errorCallback);
    try
    {
        //console.log(codes);
        bp.run(codes);
    }
    catch (e)
    {
        console.error("Programming error: " + e.message);
        process.exit(1);
    }
}
else
{
    console.log("usage: BabuinoProgrammer.js <code file in> <serial port>");
    process.exit(1);
}

	
