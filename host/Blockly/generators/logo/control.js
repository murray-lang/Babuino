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
 * @fileoverview Generating Logo for control blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo.control');

goog.require('Blockly.Logo');

Blockly.Logo.controls_if = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Logo.valueToCode(this, 'IF' + n,
      Blockly.Logo.ORDER_NONE) || 'false';
  var branch = Blockly.Logo.statementToCode(this, 'DO' + n);
  var code;
  if (this.elseCount_ || this.elseifCount_)
	code = 'ifelse ';
  else
    code = 'if ';
  code += argument + '\n[\n' + branch + '\n]\n';
	// repeatedly nest if statements within else blocks to implement
	// the else if construct
  for (n = 1; n <= this.elseifCount_; n++) {
	code += '[\n';	// in another else block now
    argument = Blockly.Logo.valueToCode(this, 'IF' + n,
        Blockly.Logo.ORDER_NONE) || 'false';
    branch = Blockly.Logo.statementToCode(this, 'DO' + n);
		// firstly deal with the next if 
		// (but we first have to predict whether it's an if of ifelse in logo)
	if (n == this.elseifCount_ && this.elseCount_ == 0)
		code += 'if ';
	else
		code += 'ifelse ';
    code += argument + '\n[\n' + branch + '\n]\n';	// the if part
		// The else block will be commenced at the top of the loop if required
  }
  if (this.elseCount_) {
    branch = Blockly.Logo.statementToCode(this, 'ELSE');
    code += '[\n' + branch + '\n]\n';
  }
	// Now close off any nested else blocks
  for (n = 1; n <= this.elseifCount_; n++) {
	code += 'n]\n';
  }
  return code + '\n';
};

Blockly.Logo.controls_loop = function() {
  // Repeat n times.
  var branch = Blockly.Logo.statementToCode(this, 'DO');
  var code = 'loop\n[\n' + branch + ']\n';
  return code;
};

Blockly.Logo.controls_repeat = function() {
  // Repeat n times.
  var repeats = Number(this.getTitleValue('TIMES'));
  var branch = Blockly.Logo.statementToCode(this, 'DO');
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  //var loopVar = Blockly.Logo.variableDB_.getDistinctName(
  //    'count', Blockly.Variables.NAME_TYPE);
  var code = 'repeat ' + repeats + '\n[\n' + branch + ']\n';
  return code;
};

Blockly.Logo.controls_repeat_var = function() {
  // Repeat n times.
  var order = Blockly.Logo.ORDER_NONE;
  var repeats = Blockly.Logo.valueToCode(this, 'TIMES', order) || '0';
  var branch = Blockly.Logo.statementToCode(this, 'DO');
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  //var loopVar = Blockly.Logo.variableDB_.getDistinctName(
  //    'count', Blockly.Variables.NAME_TYPE);
  var code = 'repeat :' + repeats + '\n[\n' + branch + ']\n';
  return code;
};

Blockly.Logo.controls_whileUntil = function() {
  // Do while/until loop.

  var until = this.getTitleValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Logo.valueToCode(this, 'BOOL',
      until ? Blockly.Logo.ORDER_LOGICAL_NOT :
      Blockly.Logo.ORDER_NONE) || 'false';
  var branch = Blockly.Logo.statementToCode(this, 'DO');
	// Will restore this INFINITE_LOOP_TRAP stuff when I understand it and
	// how it pertains to the Logo language.
  //if (Blockly.Logo.INFINITE_LOOP_TRAP) {
  //  branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
  //      '\'' + this.id + '\'') + branch;
  //}
  var code;
  if (until) {
	code ="do.while "; 
  } else {
	code ="while ";
  }
  code += argument0 + "\n[\n" + branch + "]\n";
  
  return code;
};

Blockly.Logo.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argFrom = Blockly.Logo.valueToCode(this, 'FROM',
      Blockly.Logo.ORDER_ASSIGNMENT) || '0';
  var argTo = Blockly.Logo.valueToCode(this, 'TO',
      Blockly.Logo.ORDER_ASSIGNMENT) || '0';
  var argBy = Blockly.Logo.valueToCode(this, 'BY',
      Blockly.Logo.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.Logo.statementToCode(this, 'DO');
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var code;
  //----------------------------------------------------------------------------
  // Using Logo for structure from Berkley spec
  //----------------------------------------------------------------------------
  code = 'for [' + variable0 + ' ' + argFrom + ' ' + argTo + ' ' + argBy + ']\n';
  code += '[\n' + branch + ']\n';
  return code;
};


// Following not implemented for Logo yet
Blockly.Logo.controls_forEach = function() {
  // For each loop.
  var variable0 = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Logo.valueToCode(this, 'LIST',
      Blockly.Logo.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Logo.statementToCode(this, 'DO');
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var code;
  //var indexVar = Blockly.Logo.variableDB_.getDistinctName(
  //        variable0, Blockly.Variables.NAME_TYPE);
      //variable0 + '_index', Blockly.Variables.NAME_TYPE);
 // if (argument0.match(/^\w+$/)) {
    //branch = '  ' + variable0 + ' = ' + argument0 + '[' + indexVar + '];\n' +
    //    branch;
    code = 'foreach ' + variable0 + ' ' + argument0 + '\n' +
            '[\n' + branch + '\n]\n';
  //} else {
    // The list appears to be more complicated than a simple variable.
    // Cache it to a variable to prevent repeated look-ups.
  //  var listVar = Blockly.Logo.variableDB_.getDistinctName(
  //      variable0 + '_list', Blockly.Variables.NAME_TYPE);
  //  branch = '  ' + variable0 + ' = ' + listVar + '[' + indexVar + '];\n' +
  //      branch;
  //  code = 'var ' + listVar + ' = ' + argument0 + ';\n' +
  //      'for (var ' + indexVar + ' in ' + listVar + ') {\n' +
  //      branch + '}\n';
 // }
  return code;
};

// Following not implemented for Logo yet
Blockly.Logo.controls_flow_statements = function() {
  // Flow statements: continue, break.
  switch (this.getTitleValue('FLOW')) {
    case 'BREAK':
      return 'stop\n';
    case 'CONTINUE':
      throw 'No "continue" statement in Logo.';
  }
  throw 'Unknown flow statement.';
};
