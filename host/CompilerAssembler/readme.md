Logo compiler and Babuino assembler implemented in JavaScript using JS/CC (http://jscc.phorward-software.com/)

The compiler initially supported only Cricket Logo, but I am steadily adding language features from the Berkley Standard. At this stage the only data type supported is integers, but I intend to add support for floats and possibly strings. I also wish to add support for arrays and possibly lists. The latter would facilitate the inclusion of some interesting Logo language features.
   
The output of the compiler is assembly language text based on the Babuino Virtual Machine.
   
The assembler parses this text and produces a list of numbers corresponding to the Babuino Virtual Machine binary code. These are programmed into the EEPROM of the Babuino board, and are a superset of the codes used by the Handy Cricket and Gogo boards.

Some batch files have been created to simplify the build process:

compilecompiler.cmd
-------------------
This invokes JSCC to build BabuinoLogo.js from BabuinoLogo.par. Because I develop in Windows, it uses the JSCC "driver" file for JScript, but you can replace that with a driver for your system (See the JSCC documentation). This batch file takes no arguments.


compilecompiler_chrome.cmd
--------------------------
This is the same as compilecompiler.cmd, but it uses a JSCC driver file for V8, that I have modified to remove code that Chrome disallows in packaged apps. This is what you want to use to modify the compiler used with Blockly babuino.


compileassembler.cmd
--------------------
This invokes JSCC to build BabuinoAssembler.js from BabuinoAssembler.par. Because I develop in Windows, it uses the JSCC "driver" file for JScript, but you can replace that with a driver for your system (See the JSCC documentation). This batch file takes no arguments.

compileassembler_chrome.cmd
---------------------------
This is the same as compileassembler.cmd, but it uses a JSCC driver file for V8, that I have modified to remove code that Chrome disallows in packaged apps. This is what you want to use to modify the compiler used with Blockly babuino.

copytoblockly.cmd
copycompilertoblockly.cmd
copyassemblertoblockly.cmd
--------------------------
I use these batch files to copy my generated compiler and assembler files to my Blockly folder