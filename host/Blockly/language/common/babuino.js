/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview babuino blocks for Blockly.
 * @author murray.lang62@gmail.com (Murray Lang)
 */
'use strict';

goog.provide('Blockly.Language.babuino');

goog.require('Blockly.Language');

Blockly.Language.babuino_motor_cmd = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("motor");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["a", "a"], ["b", "b"], ["ab", "ab"], ["c", "c"], ["ac", "ac"], ["bc", "bc"], ["abc", "abc"], ["d", "d"], ["ad", "ad"], ["bd", "bd"], ["abd", "abd"], ["cd", "cd"], ["acd", "acd"], ["bcd", "bcd"], ["abcd", "abcd"]]), "SEL_MOTOR");
    this.appendDummyInput()
        .appendTitle(" ");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["On", "on"], ["Off", "off"], ["This way", "thisway"], ["That way", "thatway"], ["Reverse Direction", "rd"], ["Brake", "brake"]]), "SEL_COMMAND");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_motor_setpower = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("motor");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["a", "a"], ["b", "b"], ["ab", "ab"], ["c", "c"], ["ac", "ac"], ["bc", "bc"], ["abc", "abc"], ["d", "d"], ["ad", "ad"], ["bd", "bd"], ["abd", "abd"], ["cd", "cd"], ["acd", "acd"], ["bcd", "bcd"], ["abcd", "abcd"]]), "SEL_MOTOR");
	this.appendValueInput("SEL_POWER")
        .setCheck(Number)
        .appendTitle("set power to");
	/*		
    this.appendDummyInput()
        .appendTitle("Set Power");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "SEL_POWER");
	*/	
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_motor_onfor = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("motor");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["a", "a"], ["b", "b"], ["ab", "ab"], ["c", "c"], ["ac", "ac"], ["bc", "bc"], ["abc", "abc"], ["d", "d"], ["ad", "ad"], ["bd", "bd"], ["abd", "abd"], ["cd", "cd"], ["acd", "acd"], ["bcd", "bcd"], ["abcd", "abcd"]]), "SEL_MOTOR");
    this.appendDummyInput()
        .appendTitle("on for");
    this.appendValueInput("VAR_PERIOD")
        .setCheck(Number);
    this.appendDummyInput()
        .appendTitle("tenths of a second");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_switch = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("switch");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"] ]), "SEL_SWITCH");
    this.setInputsInline(true);
    this.setOutput(true, Boolean);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_sensor = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("sensor");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"] ]), "SEL_SENSOR");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_setsvh = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("set servo heading");
	this.appendValueInput("VAR_HEADING")
        .setCheck(Number);
    //this.appendDummyInput()
    //    .appendTitle(new Blockly.FieldAngle("90"), "VAR_HEADING");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_servo = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("servo");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["left", "l"], ["right", "r"]]), "SEL_DIR");
    this.appendValueInput("VAR_STEPS")
        .setCheck(Number);
    this.appendDummyInput()
        .appendTitle("steps");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};
/*
Blockly.Language.babuino_svr = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("Servo right");
    this.appendValueInput("VAR_STEPS")
        .setCheck(Number);
    this.appendDummyInput()
        .appendTitle("steps");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_svl = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendTitle("Servo left");
    this.appendValueInput("VAR_STEPS")
        .setCheck(Number);
    this.appendDummyInput()
        .appendTitle("steps");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};
*/
Blockly.Language.babuino_timer = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle("get timer");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_reset_timer = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle("reset timer");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_wait = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle("wait for");
    this.appendValueInput("VAR_TENTHS")
        .setCheck(Number);
	this.appendDummyInput()
        .appendTitle("tenths of a second");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_wait_until = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(120);
    this.appendValueInput("VAR_CONDITION")
        .setCheck(Boolean)
        .appendTitle("wait until");
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_beep = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendTitle("beep");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_led = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendTitle("LED");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "SEL_ONOFF");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_random = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendTitle("random number (0 - 32767)");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_serial = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendTitle("serial port");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"] ]), "SEL_PORT");
    this.appendDummyInput()
        .appendTitle("data");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_serial_available = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendTitle("serial port");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"] ]), "SEL_PORT");
    this.appendDummyInput()
        .appendTitle("data available?");
    this.setInputsInline(true);
    this.setOutput(true, Boolean);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_serial_send = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendTitle("send");
	this.appendValueInput("VAR_DATA")
        .setCheck(null);
	this.appendDummyInput()
        .appendTitle("to serial port");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"] ]), "SEL_PORT");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_digitalin = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("digital input");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]  ]), "SEL_BIT");
    this.setInputsInline(true);
    this.setOutput(true, Boolean);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_digitalout = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("digital output");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"] ]), "SEL_BIT");
	this.appendDummyInput()
        .appendTitle("<-");
    this.appendValueInput("VAR_VALUE")
        .setCheck(Boolean);
    
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_analogin = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("analog input");
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "SEL_INPUT");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip('');
  }
};

Blockly.Language.babuino_analogout = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle("analog output");
	this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown([["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]]), "SEL_OUTPUT");
	this.appendDummyInput()
        .appendTitle("<-");
    this.appendValueInput("VAR_VALUE")
        .setCheck(Number);
    
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

