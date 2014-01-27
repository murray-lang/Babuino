This folder contains an implementation of Blockly (https://code.google.com/p/blockly/) that has Logo code generation and Babuino programming capability.

The serial port communications used to program the Babuino are possible because I have modified Blockly (Only the "Code" part) to run as a Chrome Packaged Application (http://developer.chrome.com/apps/about_apps.html). This was complicated by Blockly's use of a number practices that are prohibited by packaged applications for security reasons. Unfortunately, all of the experimentation to get around these restrictions has resulted in an ugly mess. My hope is to eventually incorporate the changes neatly into the standard Blockly distribution so that enhancements to Blockly are immediately available to Chrome Packaged Applications.

To get started with Blockly/babuino:

 1) If you haven't done so already, download and install the Chrome browser.
 2) Git my Blockly folder and all of its contents to an appropriate location on your system.
 3) Start Chrome.
 4) Click on the venetian blinds at the top right to open the menu.
 5) Select Tools->Extensions.
 6) Click the "Load unpacked extension..." button
 7) Browse to the Blockly folder on your system and click OK.
 8) The "Blockly Babuino" app should now appear in the list on the extensions page.
 9) Close the extensions page (optional).
10) Still in Chrome, click on the little empty grey tab at the right hand end of the tabs.
11) Click on "Apps" in the menu bar.
12) A single click on the "Blockly Babuino" icon will start it.

A user guide is on its way, but for now you can look at the Blockly documentation, and also get clues from the tool tips that appear when you hover over the buttons.

When you save your block assemblages, they are stored as XML rather than Logo.

Some known Problems:

There is currently a bug whereby the tabs and buttons are occasionally way off to the right and out of sight. I've found that after a few tries (restarting Chrome) the tabs and buttons appear where they belong. Please be patient while I find the time to sort this out. Alternatively, if you have the skills, maybe you would like to debug it. I tmight be due to changes I've made to get it working as a packaged app.

The serial programming code is currently not very robust, and will not recover cleanly from errors. If a serial programming error occurs, you might have to restart Chrome to make the serial port available again. I plan to add exception handling as part of the solution to this.

Compiler and assembler error reporting is very crude. This is partially are reflection of the capabilities built into JS/CC, but I believe there is scope for a lot of improvement nonetheless.

Please provide any feedback to the Babuino Yahoo group (http://groups.yahoo.com/neo/groups/babuinoproject/info)





