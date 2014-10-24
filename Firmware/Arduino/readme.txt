This is a version of Babuino developed as an Arduino Sketch.

Though the structure of the code has changed considerably, it owes its 
existence to the the Babuino project AVR source code v033 by:
           Adeilton Cavalcante de Oliveira Jr
Furthermore the core handshaking, uploading and interpreter code is much as 
Adeilton wrote it (though I accept full responsibility for any introduced
bugs).

I wanted a pure Arduino sketch version of Babuino so that...

* it can run with no (or little) modification on any Arduino board that I find suitable at a particular time for reasons of economics and/or features.
* I can take maximum advantage of libraries and shields that have been developed by third parties for Arduino.
* It's easy for users to program their Arduino with the firmware.
 
To this end I have avoided direct port manipulation and reprogramming of timers. It will be less efficient than the original code, but I'm prepared to wear that until it presents practical problems.

Despite all this, I now hope to remove the dependency on Arduino and make the firmware sources as portable as possible.

How to use:
-----------
Copy the Babuino folder into the libraries folder in your Arduino directory.
Copy babuino.ino into your chosen directory (which is required by the IDE to be named 'babuino').
Compile and upload as usual using the Arduino IDE

Random notes:
-------------
* The code is a work-in-progress. If you find a bug, then please post to the Babuino Yahoo group.
* floats, doubles and strings are now supported, but you won't fit them all onto an ATMega328 (sadly).
* The user LED does not currently flash at different rates like the original.
* The beeper takes advantage of the default 500Hz PWM signal that the Arduino system sets up for the PWM pins. There is no user timer programming required.
* Code documentation is currently sub-standard. I would like to improve it and add Doxygen (or similar) tags to generate HTML documentation.


Good luck, and please post on the Babuino Yahoo message board it you have any questions or difficulties.

Murray
