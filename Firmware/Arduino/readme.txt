This is a privately developed, fully Arduino version of Babuino with no 
official status.

Though the structure of the code has changed considerably, it owes its 
existence to the the Babuino project AVR source code v033 by:
           Adeilton Cavalcante de Oliveira Jr
Furthermore the core handshaking, uploading and interpreter code is much as 
Adeilton wrote it (though I accept full responsibility for any introduced
bugs).

I wanted a pure Arduino sketch version of Babuino so that...

* it can run with no (or little) modification on any Arduino board that I find suitable at a particular time for reasons of economics and/or features.

* I can take maximum advantage of libraries and shields that have been developed by third parties for Arduino.
 
To this end I have avoided direct port manipulation and reprogramming of timers. It will be less efficient than the original code, but I'm prepared to wear that until it presents practical problems.

How to use:
-----------
Copy the CricketProgram folder into the libraries folder in your Arduino directory.
Copy babuino.ino into your chosen directory.
Compile and upload as usual using the Arduino IDE

Random notes:
-------------
* The code is a work-in-progress and still contains the vestiges of some half baked ideas. If you find a bug, or something you consider silly, then please post your thoughts to the Babuino Yahoo group.
* Logo user procedures have not yet been tested.
* The code has now been modified to run on the Babuino board, however this has not been tested because I haven't built one. I'm hoping that somebody might volunteer to test it for me.
* The user LED does not currently flash at different rates like the original.
* The beeper takes advantage of the default 500Hz PWM signal that the Arduino system sets up for the PWM pins. There is no user timer programming required.
* Code documentation is currently sub-standard. I want to improve it and add Doxygen (or similar) tags to generate HTML documentation.

Interpreting Cricket Motor commands:
------------------------------------
This version reads a motor selection parameter from the code stream for all motor commands. I'm not sure whether all versions of Blocos push this parameter into the code stream because v033 of the firmware doesn't appear to expect it.
Anyway, if there is a mismatch between Blocos and the firmware in this regard, then the firmware will crash when interpreting the motor commands. If this version of the Babuino firmware appears to go west on motor commands, then try getting the latest version of Blocos.
Please post comments and experiences to the Babuino Yahoo group.

Use of Macros to define some classes:
-------------------------------------
Some might object to my use of macros to define many of the classes. This approach is the culmination of my attempts to conserve precious RAM by storing constant configuration information (such as pin numbers etc.) in code space. Some processors allow you to address code space as easily as data, so you can save RAM and protect constant data by declaring it in code space. The AVR is not like that - reading data out of code space is procedural and it has to be read into RAM anyway in order to make use of it.
 
When designing classes for, say, pin I/O, you would normally put pin number information into member variables. On the AVR these will always go into RAM and can easily add up to a significant amount. This is crazy given that it's constant data. The only way I could see of getting the compiler to put this information into code space was to actually treat code itself as a declaration.
For example:

#define ANALOG_INPUT(name, pin)  \
    inline int name() const      \
    {				 \
        return analogRead(pin);  \
    }
 
This might result in greater code space usage than having a single member function that uses a member variable to select the pin. However, with space optimisation the difference would not be much and there aren't that many pins on the smaller Arduinos anyway. Actually, some of the macros, particulary relating to debouncing digital inputs, are starting to look a bit over-the-top.

Finally:
--------
I hope that some people find this version of Babuino useful. I am excited about the possibilities for future enhancements if there is sufficient interest.
For example:
* Interpret tethered mode GoGo board commands so that Babuino can be used with Scratch and the other tools that use GoGo boards.
* Implementing FORWARD, BACKWARD, LEFT and RIGHT Logo commands, so that graphics code developed on a PC can be used to control Babuino. I see this feature employing an I2C gyro and accelerometer board.

Good luck, and please post on the Babuino Yahoo message board it you have any questions or difficulties.

Murray
