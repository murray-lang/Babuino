Babuino
=======
Files related to the Babuino Project - a low cost robotics platform based on 
[Arduino](http://www.arduino.cc/) hardware.

There are currently three parts to this repository:

1. **A Logo compiler and assembler**  
   These are implemented in JavaScript using the [JS/CC](http://jscc.phorward-software.com/) parser tool. The compiler
   initially supported only [Cricket Logo](http://www.gogoboard.org/cricket-logo-command-reference-0), but I am steadily adding language 
   features from the [Berkley Standard](http://www.cs.berkeley.edu/~bh/docs/usermanual.pdf). At this stage the only data type 
   supported is integers, but I intend to add support for floats and possibly 
   strings. I also wish to add support for arrays and possibly lists. The latter
   would facilitate the inclusion of some interesting Logo language features.
   
   The output of the compiler is assembly language text based on the Babuino
   Virtual Machine (see 3 below).
   
   The assembler parses this text and produces a list of numbers corresponding
   to the Babuino Virtual Machine binary code. These are programmed into the 
   EEPROM of the Babuino board, and are a superset of the codes used by the 
   Handy Cricket and Gogo boards.
   
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
   implemented as an Arduino [Sketch](http://arduino.cc/en/Tutorial/Sketch). I modified the code to run as an Arduino 
   sketch so that it would be easier to employ 3rd Party shields and libraries.
   The virtual machine originally only supported Cricket Logo, but has been 
   augmented with new codes as necessary to support the language features added 
   to the Logo compiler (and assembler).
 


The aim is to create a tool that is simple for users to install and use. Unfortunately that is not yet the case.
See readme files in the subdirectories for more information.
