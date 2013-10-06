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
 * @fileoverview Generating Logo for colour blocks.
 * @author murray.lang@westnet.com.au (Murray Lang)
 */
'use strict';

goog.provide('Blockly.Logo.colour');

goog.require('Blockly.Logo');

Blockly.Logo.colour_picker = function() {
  // Colour picker.
  var code = '\'' + this.getTitleValue('COLOUR') + '\'';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.colour_rgb = function() {
  // Compose a colour from RGB components.
  var red = Blockly.Logo.valueToCode(this, 'RED',
      Blockly.Logo.ORDER_COMMA) || 0;
  var green = Blockly.Logo.valueToCode(this, 'GREEN',
      Blockly.Logo.ORDER_COMMA) || 0;
  var blue = Blockly.Logo.valueToCode(this, 'BLUE',
      Blockly.Logo.ORDER_COMMA) || 0;

  if (!Blockly.Logo.definitions_['colour_rgb']) {
    var functionName = Blockly.Logo.variableDB_.getDistinctName(
        'colour_rgb', Blockly.Generator.NAME_TYPE);
    Blockly.Logo.colour_rgb.functionName = functionName;
    var func = [];
	func.push('to ' + functionName + ' :r :g :b');
	func.push('  if \"r > 255 [make \"r 255]');
	func.push('  if \"r < 0 [make \"r 0]');
	func.push('  if \"g > 255 [make \"g 255]');
	func.push('  if \"g < 0 [make \"g 0]');
	func.push('  if \"b > 255 [make \"b 255]');
	func.push('  if \"b < 0 [make \"b 0]');
	func.push('  output [:r :g :b]');	
    func.push('end');
	
    Blockly.Logo.definitions_['colour_rgb'] = func.join('\n');
  }
  var code = Blockly.Logo.colour_rgb.functionName +
      ' ' + red + ' ' + green + ' ' + blue;
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};

Blockly.Logo.colour_blend = function() {
  // Blend two colours together.
  var c1 = Blockly.Logo.valueToCode(this, 'COLOUR1',
      Blockly.Logo.ORDER_COMMA) || '\'0\'';
  var c2 = Blockly.Logo.valueToCode(this, 'COLOUR2',
      Blockly.Logo.ORDER_COMMA) || '\'0\'';
  var ratio = Blockly.Logo.valueToCode(this, 'RATIO',
      Blockly.Logo.ORDER_COMMA) || 0.5;

  if (!Blockly.Logo.definitions_['colour_blend']) {
    var functionName = Blockly.Logo.variableDB_.getDistinctName(
        'colour_blend', Blockly.Generator.NAME_TYPE);
    Blockly.Logo.colour_blend.functionName = functionName;
    var func = [];
    func.push('function ' + functionName + ' :c1 :c2 :ratio');
	//func.push('  if \"ratio > 1 [make \"ratio 1]');
	//func.push('  if \"ratio < 0 [make \"ratio 0]');
	
    func.push('  ratio = Math.max(Math.min(Number(ratio), 1), 0);');
    func.push('  var r1 = parseInt(c1.substring(1, 3), 16);');
    func.push('  var g1 = parseInt(c1.substring(3, 5), 16);');
    func.push('  var b1 = parseInt(c1.substring(5, 7), 16);');
    func.push('  var r2 = parseInt(c2.substring(1, 3), 16);');
    func.push('  var g2 = parseInt(c2.substring(3, 5), 16);');
    func.push('  var b2 = parseInt(c2.substring(5, 7), 16);');
    func.push('  var r = Math.round(r1 * (1 - ratio) + r2 * ratio);');
    func.push('  var g = Math.round(g1 * (1 - ratio) + g2 * ratio);');
    func.push('  var b = Math.round(b1 * (1 - ratio) + b2 * ratio);');
    func.push('  r = (\'0\' + (r || 0).toString(16)).slice(-2);');
    func.push('  g = (\'0\' + (g || 0).toString(16)).slice(-2);');
    func.push('  b = (\'0\' + (b || 0).toString(16)).slice(-2);');
    func.push('  return \'#\' + r + g + b;');
    func.push('}');
    Blockly.Logo.definitions_['colour_blend'] = func.join('\n');
  }
  var code = Blockly.Logo.colour_blend.functionName +
      '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};
