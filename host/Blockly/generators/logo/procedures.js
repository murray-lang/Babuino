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
 * @fileoverview Generating Logo for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo.procedures');

goog.require('Blockly.Logo');

Blockly.Logo.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Logo.statementToCode(this, 'STACK');
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    branch = Blockly.Logo.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var returnValue = Blockly.Logo.valueToCode(this, 'RETURN',
      Blockly.Logo.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Logo.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.Logo.scrub_(this, code);
  Blockly.Logo.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Logo.procedures_defnoreturn =
    Blockly.Logo.procedures_defreturn;

Blockly.Logo.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Logo.valueToCode(this, 'ARG' + x,
        Blockly.Logo.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};

Blockly.Logo.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Logo.valueToCode(this, 'ARG' + x,
        Blockly.Logo.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.Logo.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.Logo.valueToCode(this, 'CONDITION',
      Blockly.Logo.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (this.hasReturnValue_) {
    var value = Blockly.Logo.valueToCode(this, 'VALUE',
        Blockly.Logo.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
