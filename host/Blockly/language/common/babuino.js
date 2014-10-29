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

Blockly.Language.babuino_select_motors = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(290);
        this.appendDummyInput()
            .appendTitle("select motors");
        this.appendDummyInput()
            .appendTitle("a")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_A");
        this.appendDummyInput()
            .appendTitle(" b")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_B");
        this.appendDummyInput()
            .appendTitle(" c")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_C");
        this.appendDummyInput()
            .appendTitle(" d")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_D");
        this.appendDummyInput()
            .appendTitle(" e")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_E");
        this.appendDummyInput()
            .appendTitle(" f ")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_F");
        this.appendDummyInput()
            .appendTitle(" g")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_G");
        this.appendDummyInput()
            .appendTitle(" h")
            .appendTitle(new Blockly.FieldCheckbox("FALSE"), "MOTOR_H");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.Language.babuino_motor_cmd = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle("motors");
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
	this.appendValueInput("SEL_POWER")
        .setCheck(Number)
        .appendTitle("set motor power to");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_motor_onfor = {
  helpUrl: 'http://www.example.com/',
  init: function() {
    this.setColour(290);
    this.appendValueInput("VAR_PERIOD")
        .appendTitle("motors on for (10ths s)")
        .setCheck(Number);
    this.setInputsInline(false);
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
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_serial_send_to_port = {
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

Blockly.Language.babuino_digitalin_ext = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(330);
        this.appendDummyInput()
            .appendTitle("digital input");
        this.appendValueInput("VAR_BIT")
            .setCheck(Number);
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
        .appendTitle("=");
    this.appendValueInput("VAR_VALUE")
        .setCheck(Boolean);
    
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_digitalout_ext = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(330);
        this.appendDummyInput()
            .appendTitle("digital output");
        this.appendValueInput("VAR_BIT")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("=");
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

Blockly.Language.babuino_analogin_ext = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(330);
        this.appendDummyInput()
            .appendTitle("analog input");
        this.appendValueInput("VAR_PORT")
            .setCheck(Number);
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
        .appendTitle("=");
    this.appendValueInput("VAR_VALUE")
        .setCheck(Number);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Language.babuino_analogout_ext = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(330);
        this.appendDummyInput()
            .appendTitle("analog output");
        this.appendValueInput("VAR_PORT")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("=");
        this.appendValueInput("VAR_VALUE")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_i2c_start = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("Start I\u00b2C");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_i2c_stop = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("Stop I\u00b2C");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_i2c_error = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("I\u00b2C Error");
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setTooltip('');
    }
};

Blockly.Language.babuino_i2c_txrx = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("I\u00b2C TxRx");
        //this.appendDummyInput()
        //    .appendTitle("I\u00b2C address");
        this.appendValueInput("VAR_I2C_ADDRESS")
            .appendTitle("I\u00b2C address")
            .setCheck(Number);
        this.appendValueInput("VAR_I2C_TXBUF")
            .appendTitle("Tx buffer");
            //.setCheck(Array);
         this.appendValueInput("VAR_I2C_TXBUFLEN")
            .appendTitle("Tx buffer length")
            .setCheck(Number);
         this.appendValueInput("VAR_I2C_RXBUF")
            .appendTitle("Rx buffer");
            //.setCheck(Array);
         this.appendValueInput("VAR_I2C_RXBUFLEN")
            .appendTitle("Rx buffer length")
            .setCheck(Number);
         this.appendValueInput("VAR_I2C_TIMEOUT")
            .appendTitle("timeout (ms)")
            .setCheck(Number);
        this.setInputsInline(false);
        this.setOutput(false);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_i2c_rx = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(120);
        this.appendDummyInput()
            .appendTitle("I\u00b2C Rx");
         this.appendValueInput("VAR_I2C_ADDRESS")
            .appendTitle("I\u00b2C address")
            .setCheck(Number);
        this.appendValueInput("VAR_I2C_RXBUF")
            .appendTitle("Rx buffer")
            .setCheck(Array);
        this.appendValueInput("VAR_I2C_RXBUFLEN")
            .appendTitle("Rx buffer length")
            .setCheck(Number);
        this.appendValueInput("VAR_I2C_TIMEOUT")
            .appendTitle("timeout (ms)")
            .setCheck(Number);
        this.setInputsInline(false);
        this.setOutput(false);
        this.setPreviousStatement(true, "null");
        this.setNextStatement(true, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_string_of_length = {
    // Text value.
    //helpUrl: Blockly.LANG_TEXT_TEXT_HELPURL,
    init: function() {
        this.setColour(160);
         this.appendDummyInput()
            .appendTitle("string of length")
            .appendTitle(new Blockly.FieldTextInput('10',
                Blockly.FieldTextInput.nonnegativeIntegerValidator), 'VAR_STRLEN');
        this.setInputsInline(true);
        this.setOutput(true, String);
        //this.setTooltip(Blockly.LANG_TEXT_TEXT_TOOLTIP);
    }
};

Blockly.Language.babuino_tostring = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(160);
        this.appendDummyInput()
            .appendTitle("convert");
        this.appendValueInput("VAR_VALUE")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("to a string");
        this.setInputsInline(true);
        this.setOutput(true, String);
        this.setTooltip('');
    }
};

Blockly.Language.babuino_stringlength = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(160);
        this.appendDummyInput()
            .appendTitle("length of");
        this.appendValueInput("VAR_VALUE")
            .setCheck(String);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setTooltip('');
    }
};

Blockly.Language.babuino_math_atan2 = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("atan2");
        this.appendValueInput("VAR_ARG1")
            .setCheck(Number);
        this.appendValueInput("VAR_ARG2")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setPreviousStatement(false, "null");
        this.setNextStatement(false, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_math_hypot = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("Hypotenuse");
        this.appendValueInput("VAR_ARG1")
            .setCheck(Number);
        this.appendValueInput("VAR_ARG2")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setPreviousStatement(false, "null");
        this.setNextStatement(false, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_math_pow = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(230);

        this.appendValueInput("VAR_ARG1")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("to the power of");
        this.appendValueInput("VAR_ARG2")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setPreviousStatement(false, "null");
        this.setNextStatement(false, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_math_min = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("minimum of");
        this.appendValueInput("VAR_ARG1")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("and");
        this.appendValueInput("VAR_ARG2")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setPreviousStatement(false, "null");
        this.setNextStatement(false, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_math_max = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(230);
        this.appendDummyInput()
            .appendTitle("maximum of");
        this.appendValueInput("VAR_ARG1")
            .setCheck(Number);
        this.appendDummyInput()
            .appendTitle("and");
        this.appendValueInput("VAR_ARG2")
            .setCheck(Number);
        this.setInputsInline(true);
        this.setOutput(true, Number);
        this.setPreviousStatement(false, "null");
        this.setNextStatement(false, "null");
        this.setTooltip('');
    }
};

Blockly.Language.babuino_declare_array = {
    // Variable setter.
    category: null,  // Variables are handled specially.
    helpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendValueInput('SIZE')
            .appendTitle("Array")
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_SET_ITEM), 'VAR')
            .appendTitle("of size:");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Provide the size of the array");
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_SET_CREATE_GET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_get', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_declare_typed_array = {
    // Variable setter.
    elpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendValueInput('SIZE')
            .appendTitle("Array")
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_SET_ITEM), 'VAR')
            .appendTitle("of")
            .appendTitle(new Blockly.FieldDropdown(
                [
                    ["Byte", "byte"],
                    ["Int16", "short"],
                    ["Int32", "int"],
                    ["Float", "float"],
                    ["Double", "double"]
                ]),
            "SEL_TYPE")
            .appendTitle("Size:");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Provide the size of the array");
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_SET_CREATE_GET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_get', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_get_array = {
    // Variable getter.
    helpUrl: Blockly.LANG_VARIABLES_GET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendValueInput('ITEM')
            .setCheck(Number)
            .appendTitle(Blockly.LANG_ARRAY_GET_ITEM);
        this.appendDummyInput()
            .appendTitle(new Blockly.FieldDropdown(
                [
                    ["in array", "false"],
                    ["in array referenced by", "true"]
                ]),
            "SEL_DEREFERENCE")
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_GET_ITEM), 'VAR');
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setTooltip(Blockly.LANG_ARRAY_GET_INDEX_TOOLTIP);
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_GET_CREATE_SET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_set', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_set_array = {
    // Variable setter.
    helpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendValueInput('ITEM')
            .setCheck(Number)
            .appendTitle(Blockly.LANG_ARRAY_SET_ITEM);
        this.appendValueInput('VALUE')
            .appendTitle(new Blockly.FieldDropdown(
                [
                    ["in array", "false"],
                    ["in array referenced by", "true"]
                ]),
            "SEL_DEREFERENCE")
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_SET_ITEM), 'VAR')
            .appendTitle('to');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.LANG_VARIABLES_SET_TOOLTIP);
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_SET_CREATE_GET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_get', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_reference_to = {
    // Variable getter.
    helpUrl: Blockly.LANG_VARIABLES_GET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendDummyInput()
            .appendTitle('reference to')
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_GET_ITEM), 'VAR');
        this.setOutput(true, null);
        this.setTooltip('Get a reference to the given variable');
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_GET_CREATE_SET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_set', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_dereference = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(330);
        this.appendValueInput("VAR_VALUE")
            .appendTitle("dereference");
        //this.setInputsInline(true);
        this.setOutput(true, null);
        this.setTooltip('Dereference the given variable reference');
    }
};

Blockly.Language.babuino_set_referenced_by = {
    // Variable setter.
    category: null,  // Variables are handled specially.
    helpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
    init: function() {
        this.setColour(330);
        this.appendValueInput('VALUE')
            .appendTitle("set variable referenced by")
            .appendTitle(new Blockly.FieldVariable(
                Blockly.LANG_VARIABLES_SET_ITEM), 'VAR');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Set the value of the variable referenced (pointed to) by this variable.");
    },
    getVars: function() {
        return [this.getTitleValue('VAR')];
    },
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    },
    customContextMenu: function(options) {
        var option = {enabled: true};
        var name = this.getTitleValue('VAR');
        option.text = Blockly.LANG_VARIABLES_SET_CREATE_GET.replace('%1', name);
        option.callback = Blockly.ContextMenu.callbackFactory(this,
            'variables_get', 'VAR', name);
        options.push(option);
    }
};

Blockly.Language.babuino_config_digitalin = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(0);
        this.appendValueInput('LIST')
            .setCheck(Array)
            .appendTitle("set digital inputs");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Supply the digital ports that should be inputs');
    }
};

Blockly.Language.babuino_config_digitalout = {
    helpUrl: 'http://www.example.com/',
    init: function() {
        this.setColour(0);
        this.appendValueInput('LIST')
            .setCheck(Array)
            .appendTitle("set digital outputs");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Supply the digital ports that should be outputs');
    }
};

