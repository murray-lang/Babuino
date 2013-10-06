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
 * @fileoverview Generating Logo for babuino blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo.babuino');

goog.require('Blockly.Logo');


Blockly.Logo.babuino_motor_cmd = function() {
  var dropdown_sel_motor = this.getTitleValue('SEL_MOTOR');
  var dropdown_sel_command = this.getTitleValue('SEL_COMMAND');
 
  var code = dropdown_sel_motor +', ' + dropdown_sel_command + '\n';
  return code;
};

Blockly.Logo.babuino_motor_setpower = function() {
  var power = Blockly.Logo.valueToCode(this, 'SEL_POWER', Blockly.Logo.ORDER_ASSIGNMENT);
  var motor = this.getTitleValue('SEL_MOTOR');
  
  var code = motor + ', setpower ' + power + '\n';
  return code;
};

Blockly.Logo.babuino_motor_onfor = function() {
  var value_period = Blockly.Logo.valueToCode(this, 'VAR_PERIOD', Blockly.Logo.ORDER_ASSIGNMENT);
  var dropdown_sel_motor = this.getTitleValue('SEL_MOTOR');
  
  var code = dropdown_sel_motor + ', onfor ' + value_period + '\n';
  return code;
};

Blockly.Logo.babuino_switch = function() {
  var dropdown_sel_switch = this.getTitleValue('SEL_SWITCH');
  var code = 'switch' + dropdown_sel_switch + '\n';
  return [code, Blockly.Logo.ORDER_ASSIGNMENT];
};

Blockly.Logo.babuino_sensor = function() {
  var dropdown_sel_sensor = this.getTitleValue('SEL_SENSOR');
  var code = 'sensor' + dropdown_sel_sensor + '\n';
  return [code, Blockly.Logo.ORDER_ASSIGNMENT];
};

Blockly.Logo.babuino_setsvh = function() {
  var angle_name = this.getTitleValue('VAR_HEADING');
  
  var code = 'setsvh ' + angle_name + '\n';
  return code;
};

Blockly.Logo.babuino_servo = function() {
  var dir = this.getTitleValue('SEL_DIR');
  var value_var_steps = Blockly.Logo.valueToCode(this, 'VAR_STEPS', Blockly.Logo.ORDER_ASSIGNMENT);
  var code = 'sv' + dir + ' ' + value_var_steps + '\n';
  return code;
}
/*
Blockly.Logo.babuino_svr = function() {
  var value_var_steps = Blockly.Logo.valueToCode(this, 'VAR_STEPS', Blockly.Logo.ORDER_ASSIGNMENT);
  var code = 'svr ' + value_var_steps + '\n';
  return code;
};

Blockly.Logo.babuino_svl = function() {
  var value_var_steps = Blockly.Logo.valueToCode(this, 'VAR_STEPS', Blockly.Logo.ORDER_ASSIGNMENT);
  var code = 'svl ' + value_var_steps + '\n';
  return code;
};
*/
Blockly.Logo.babuino_timer = function() {
  
  var code = 'timer\n'
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Logo.ORDER_ASSIGNMENT];
};

Blockly.Logo.babuino_reset_timer = function() {
  var code = 'resett\n'
  return code;
};

Blockly.Logo.babuino_wait = function() {
  var value_var_tenths = Blockly.Logo.valueToCode(this, 'VAR_TENTHS', Blockly.Logo.ORDER_ASSIGNMENT);
  var code = 'wait ' + value_var_tenths + '\n';
  return code;
};

Blockly.Logo.babuino_wait_until = function(block) {
  var condition = Blockly.Logo.valueToCode(this, 'VAR_CONDITION', Blockly.Logo.ORDER_CONDITIONAL);
  var code = 'waituntil [' + condition + ']\n';
  return code;
};

Blockly.Logo.babuino_beep = function() {
  var code = 'beep\n';
  return code;
};

Blockly.Logo.babuino_led = function() {
  var dropdown_sel_onoff = this.getTitleValue('SEL_ONOFF');
  var code = 'led' + dropdown_sel_onoff + '\n';
  return code;
};

Blockly.Logo.babuino_random = function() {
  var code = 'random\n';
  return code;
};

Blockly.Logo.babuino_serial = function() {
  var port = this.getTitleValue('SEL_PORT');
  var code = port == '1' ? 'serial' : 'serial ' + port;
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.babuino_serial_available = function() {
  var port = this.getTitleValue('SEL_PORT');
  var code = port == '1' ? 'newserial?' : 'newserial? ' + port;
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.babuino_serial_send = function() {
  var data = Blockly.Logo.valueToCode(this, 'VAR_DATA', Blockly.Logo.ORDER_ASSIGNMENT);
  var port = this.getTitleValue('SEL_PORT');
  var code = 'send ';
  if (port != '1')
	code += port + ' ';
  code += data + '\n';
  
  return code;
};