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
 * @fileoverview Generating Logo for variable blocks.
 * @author murray.lang@westnet.com.au (Murray Lang)
 */
'use strict';

goog.provide('Blockly.Logo.variables');

goog.require('Blockly.Logo');

Blockly.Logo.variables_get = function() {
  // Variable getter.
  var code = Blockly.Logo.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [":" + code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.Logo.valueToCode(this, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '0';
  var varName = Blockly.Logo.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return "make \"" + varName + ' ' + argument0 + '\n';
};

Blockly.Logo.babuino_declare_array = function() {
    // Variable setter.
    var argument0 = Blockly.Logo.valueToCode(this, 'SIZE',
        Blockly.Logo.ORDER_NONE) || '0';
    var varName = Blockly.Logo.variableDB_.getName(
        this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'array [' + varName + ' ' + argument0 + ']\n';
};

Blockly.Logo.babuino_declare_typed_array = function() {
    // Variable setter.
    var size = Blockly.Logo.valueToCode(this, 'SIZE',
        Blockly.Logo.ORDER_NONE) || '0';
    var varName = Blockly.Logo.variableDB_.getName(
        this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
    var dropdown_sel_type = this.getTitleValue('SEL_TYPE');
    var code = 'array [' + varName;
    switch (dropdown_sel_type)
    {
    case "byte":
        code = 'bytearray [' + varName + ' ';
        break;
    case "short":
        code += '% ';
        break;
    case "int":
        code += '& ';
        break;
    case "float":
        code += '! ';
        break;
    case "double":
        code += '# ';
        break;
    }
    code += size + ']\n';
    return code;
};

Blockly.Logo.babuino_set_array = function() {
    var item = Blockly.Logo.valueToCode(this, 'ITEM', Blockly.Logo.ORDER_NONE);
    var name = Blockly.Logo.variableDB_.getName(this.getTitleValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    var value = Blockly.Logo.valueToCode(this, 'VALUE', Blockly.Logo.ORDER_NONE) || '0';
    if (this.getTitleValue('SEL_DEREFERENCE') == "true")
        name = '(thing :' + name + ')';
    else
        name = ':' + name;

    return 'aset ' + name + ' ' + item + ' ' + value + '\n';
};

Blockly.Logo.babuino_get_array = function() {
    var item = Blockly.Logo.valueToCode(this, 'ITEM', Blockly.Logo.ORDER_NONE);
    var name = Blockly.Logo.variableDB_.getName(this.getTitleValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    if (this.getTitleValue('SEL_DEREFERENCE') == "true")
        name = '(thing :' + name + ')';
    else
        name = ':' + name;
    var code = 'aget ' + name + ' ' + item + '\n';
    return [code, Blockly.Logo.ORDER_ASSIGNMENT];
};

Blockly.Logo.babuino_reference_to = function() {
    var code = Blockly.Logo.variableDB_.getName(this.getTitleValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return ['"' + code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.babuino_dereference = function() {
    var rhs = Blockly.Logo.valueToCode(this, 'VAR_VALUE',
        Blockly.Logo.ORDER_NONE) || '0';
    return ['(thing ' + rhs + ')', Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.babuino_set_referenced_by = function() {
    var argument0 = Blockly.Logo.valueToCode(this, 'VALUE',
        Blockly.Logo.ORDER_NONE) || '0';
    var varName = Blockly.Logo.variableDB_.getName(this.getTitleValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return 'make :' + varName + ' ' + argument0 + '\n';
};



