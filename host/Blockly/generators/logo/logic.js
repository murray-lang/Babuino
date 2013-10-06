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
 * @fileoverview Generating Logo for logic blocks.
 * @author murray.lang@westnet.com.au (Murray Lang)
 */
'use strict';

goog.provide('Blockly.Logo.logic');

goog.require('Blockly.Logo');

Blockly.Logo.logic_compare = function() {
  // Comparison operator.
  // Logo uses a mixture of prefix and infix operators
  var mode = this.getTitleValue('OP');
  var operator = Blockly.Logo.logic_compare.OPERATORS[mode];
  var order = Blockly.Logo.ORDER_RELATIONAL;
  var argument0 = Blockly.Logo.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Logo.valueToCode(this, 'B', order) || '0';
  var code = ((mode == 'NEQ') ? 'not ' : '') + argument0 + ' ' + operator + ' ' + argument1;
  
  return [code, order];
};

Blockly.Logo.logic_compare.OPERATORS = {
  EQ: '=',
  NEQ: '=',   // No NEQ operator in logo. Uses "not" prefix eg: not foo = bar
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

Blockly.Logo.logic_operation = function() {
  // Operations 'and', 'or' or 'xor'.
  var operator;
  var op = this.getTitleValue('OP');
  if (op == 'AND') {
	operator = 'and';
  } else if (op == 'OR') {
    operator = 'or';
  } else {
    operator = 'xor';
  }
  var order = (operator == 'and') ? Blockly.Logo.ORDER_LOGICAL_AND :
      Blockly.Logo.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Logo.valueToCode(this, 'A', order) || 'false';
  var argument1 = Blockly.Logo.valueToCode(this, 'B', order) || 'false';
	// and and or are prefix in Logo
  var code = operator + ' ' + argument0 + ' ' + argument1;
  return [code, order];
};

Blockly.Logo.logic_negate = function() {
  // Negation.
  var argument0 = Blockly.Logo.valueToCode(this, 'BOOL',
      Blockly.Logo.ORDER_LOGICAL_NOT) || 'false';
  var code = 'not ' + argument0;
  return [code, Blockly.Logo.ORDER_LOGICAL_NOT];
};

Blockly.Logo.logic_boolean = function() {
  // Boolean values true and false.
  var code = (this.getTitleValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.logic_null = function() {
  // Null data type.
  return ['None', Blockly.Logo.ORDER_ATOMIC];	// I don't know that Logo has this concept. Leave it for now.
};

	// There's no ternery operator in Logo AFAIK. Not sure what to do at this stage.
Blockly.Logo.logic_ternary = function() {
  var value_if = Blockly.Logo.valueToCode(this, 'IF',
      Blockly.Logo.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Logo.valueToCode(this, 'THEN',
      Blockly.Logo.ORDER_CONDITIONAL) || 'None';
  var value_else = Blockly.Logo.valueToCode(this, 'ELSE',
      Blockly.Logo.ORDER_CONDITIONAL) || 'None';
	// This is wrong. It's not a ternery operator
  var code = 'ifelse ' + value_if + ' [' + value_then + '] [' + value_else + ']';	
  return [code, Blockly.Logo.ORDER_CONDITIONAL];
};
