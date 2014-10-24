Babuino
=======
Files related to the Babuino Project - a low cost robotics platform based on 
[Arduino](http://www.arduino.cc/) hardware. 

Summary
-------

**Current Features**

* A bytecode interpreter (virtual machine) implemented as an Arduino sketch
* A Logo compiler, an assembler and a serial programmer, all written in Javascript
* A graphical, drag-and-drop environment based on [Google Blockly](http://code.google.com/p/blockly/), but implemented as a [Chrome "Packaged Application"](https://developer.chrome.com/apps/about_apps) to facilitate access to files and the serial port.

Using the Blockly Chrome packaged application is the path of least resistance, as it should work on all platforms that support such apps.

**Issues**

Using the JavaScript tools separately is currently much easier on Linux than Windows. 
I originally developed them on Windows, but moved to Linux because it simplified many aspects of development.
I haven't yet got around to returning to the Windows environment to make sure everything still hangs together.
There is no reason why it shouldn't, but I know that node-serial port can be a bit fiddly to install on Windows.

With the addition of floating point and string support, the size of the binary compiled in Arduino is too
large to fit on an ATMega328, as used by Babuino. I suspect that this could be rectified by compiler 
optimisations, but the Arduino environment switches off all optimisations. Support for floating point
and strings can be turned off by C defines, and this brings the size down to fit on a 328. The Arduino
Mega board has no problems with everything turned on.

**Goals**

* Provide documentation! I think this is the biggest barrier to adoption.
* Port the virtual machine implementation to a wide range of platforms. (Take 'uino' out of the name!)
* Improve language and VM implementations to remove as many barriers to programming as possible.
* Allow VM features to be turned on or off through C defines to minimise resource usage.
* Provide support for additional high-level languages (Likely candidates are Python and Basic).
* Develop a web-based virtual machine for emulation and testing.

Dependencies
------------

**To use the Blockly-based GUI environment:**

* [Chrome](https://www.google.com/chrome/browser/)

**To use the commandline tools**

* [node.js](http://nodejs.org/)
* [JSCC-NODE](https://github.com/badlee/JSCC-NODE)
* [node-serialport](https://github.com/voodootikigod/node-serialport)
* [locale-js](https://github.com/chleck/locale-js)

**To deploy compiler/assembler changes in Blockly:**

* [Browserify](http://browserify.org/)


This Repository
---------------

There are currently three parts to this repository:

1. **A Logo compiler and assembler**  
These are implemented in JavaScript using the [JSCC-NODE](https://github.com/badlee/JSCC-NODE) parser tool. 
The variant of Logo is based on [Cricket Logo](http://www.gogoboard.org/cricket-logo-command-reference-0), 
but with some significant additions and deviations. There are still a few things missing as well.
The output of the compiler is assembly language text based on the Babuino Virtual Machine (see 3 below). 
It is possible to write a program entirely in this assembly language.
The assembler parses this text and produces a list of numbers corresponding to the Babuino Virtual Machine 
binary code. These are programmed into the EEPROM of the Arduino board, and are a superset of the codes used 
by the Handy Cricket and Gogo boards.
 
2. **A custom version of Google Blockly**  
[Google Blockly](http://code.google.com/p/blockly/) is a project that provides a pictorial drag-and-drop interface for generating programming code. The version here has a code generator for Logo, and invokes the above compiler and 
assembler on the generated code. The reason for this custom version is that
it has been modified to run as a [Chrome "Packaged Application"](https://developer.chrome.com/apps/about_apps). Chrome 
Packaged Apps are able, amongst other things, to read and write to the file
system, and to access serial ports. The latter has been employed to implement
a programmer for the Babuino board (and which should theoretically program
Gogo boards and Handy Cricket boards as well, though these haven't been 
tested yet).
    
3. **An Arduino sketch implementing the Babuino Virtual Machine**  
While the Babuino project was originally based on Arduino hardware, it wasn't
implemented as an Arduino [Sketch](http://arduino.cc/en/Tutorial/Sketch). I modified the code to run as an 
Arduino sketch so that it would be easier to employ 3rd Party shields and libraries. It is also very easy
for users to program an Arduino board in the Arduino environment when the code is a sketch.
The virtual machine originally only supported Cricket Logo, but has been 
augmented with new codes as necessary to support the language features added 
to the Logo compiler (and assembler).
 

