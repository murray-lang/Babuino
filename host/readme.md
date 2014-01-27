This folder contains the host-side applications for Babuino.

The Blockly folder contains a version of Google Blockly (http://code.google.com/p/blockly/) that generates Logo, compiles it and programs a Babuino board via a serial port. Though Blockly is a web app, it is implemented in Javascript and runs entirely in the browser.  The ability to access hardware has been achieved by modifying Blockly to run as a Chrome "packaged application" (http://developer.chrome.com/apps/about_apps.html)

The CompilerAssembler folder contains a Logo compiler implemented in JavaScript so that it can be incorporated into Blockly. This compiler generates an "assembly" language based on the byte codes used in the Babuino Virtual Machine firmware. A separate assembler, also written in JavaScript, compiles this assembly output and generates the stream of binary codes that is used to program the Babuino.

The compiler and assembler have both been implemented using the excellent JS/CC (http://jscc.phorward-software.com/)


