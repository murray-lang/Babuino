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
 * @fileoverview Generating Logo for list blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo.lists');

goog.require('Blockly.Logo');

Blockly.Logo.lists_create_empty = function() {
  // Create an empty list.
  return ['[]', Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Logo.valueToCode(this, 'ADD' + n,
        Blockly.Logo.ORDER_COMMA) || 'null';
  }
  code = '[' + code.join(', ') + ']';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo.lists_repeat = function() {
  // Create a list with one element repeated.
  if (!Blockly.Logo.definitions_['lists_repeat']) {
    // Function copied from Closure's goog.array.repeat.
    var functionName = Blockly.Logo.variableDB_.getDistinctName(
        'lists_repeat', Blockly.Generator.NAME_TYPE);
    Blockly.Logo.lists_repeat.repeat = functionName;
    var func = [];
    func.push('function ' + functionName + '(value, n) {');
    func.push('  var array = [];');
    func.push('  for (var i = 0; i < n; i++) {');
    func.push('    array[i] = value;');
    func.push('  }');
    func.push('  return array;');
    func.push('}');
    Blockly.Logo.definitions_['lists_repeat'] = func.join('\n');
  }
  var argument0 = Blockly.Logo.valueToCode(this, 'ITEM',
      Blockly.Logo.ORDER_COMMA) || 'null';
  var argument1 = Blockly.Logo.valueToCode(this, 'NUM',
      Blockly.Logo.ORDER_COMMA) || '0';
  var code = Blockly.Logo.lists_repeat.repeat +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};

Blockly.Logo.lists_length = function() {
  // List length.
  var argument0 = Blockly.Logo.valueToCode(this, 'VALUE',
      Blockly.Logo.ORDER_FUNCTION_CALL) || '\'\'';
  return [argument0 + '.length', Blockly.Logo.ORDER_MEMBER];
};

Blockly.Logo.lists_isEmpty = function() {
  // Is the list empty?
  var argument0 = Blockly.Logo.valueToCode(this, 'VALUE',
      Blockly.Logo.ORDER_MEMBER) || '[]';
  return ['!' + argument0 + '.length', Blockly.Logo.ORDER_LOGICAL_NOT];
};

Blockly.Logo.lists_indexOf = function() {
  // Find an item in the list.
  var operator = this.getTitleValue('END') == 'FIRST' ?
      'indexOf' : 'lastIndexOf';
  var argument0 = Blockly.Logo.valueToCode(this, 'FIND',
      Blockly.Logo.ORDER_NONE) || '\'\'';
  var argument1 = Blockly.Logo.valueToCode(this, 'VALUE',
      Blockly.Logo.ORDER_MEMBER) || '[]';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.Logo.ORDER_MEMBER];
};

Blockly.Logo.lists_getIndex = function() {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Logo.valueToCode(this, 'AT',
      Blockly.Logo.ORDER_UNARY_NEGATION) || '1';
  var list = Blockly.Logo.valueToCode(this, 'VALUE',
      Blockly.Logo.ORDER_MEMBER) || '[]';

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '[0]';
      return [code, Blockly.Logo.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.shift()';
      return [code, Blockly.Logo.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.shift();\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '.slice(-1)[0]';
      return [code, Blockly.Logo.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.pop()';
      return [code, Blockly.Logo.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.pop();\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (at.match(/^-?\d+$/)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at += ' - 1';
    }
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.Logo.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.splice(' + at + ', 1)[0]';
      return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
    } else if (mode == 'REMOVE') {
      return list + '.splice(' + at + ', 1);\n';
    }
  } else if (where == 'FROM_END') {
    if (mode == 'GET') {
      var code = list + '.slice(-' + at + ')[0]';
      return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
    } else if (mode == 'GET_REMOVE' || mode == 'REMOVE') {
      if (!Blockly.Logo.definitions_['lists_remove_from_end']) {
        var functionName = Blockly.Logo.variableDB_.getDistinctName(
            'lists_remove_from_end', Blockly.Generator.NAME_TYPE);
        Blockly.Logo.lists_getIndex.lists_remove_from_end = functionName;
        var func = [];
        func.push('function ' + functionName + '(list, x) {');
        func.push('  x = list.length - x;');
        func.push('  return list.splice(x, 1)[0];');
        func.push('}');
        Blockly.Logo.definitions_['lists_remove_from_end'] =
            func.join('\n');
      }
      code = Blockly.Logo.lists_getIndex.lists_remove_from_end +
          '(' + list + ', ' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + ';\n';
      }
    }
  } else if (where == 'RANDOM') {
    if (!Blockly.Logo.definitions_['lists_get_random_item']) {
      var functionName = Blockly.Logo.variableDB_.getDistinctName(
          'lists_get_random_item', Blockly.Generator.NAME_TYPE);
      Blockly.Logo.lists_getIndex.random = functionName;
      var func = [];
      func.push('function ' + functionName + '(list, remove) {');
      func.push('  var x = Math.floor(Math.random() * list.length);');
      func.push('  if (remove) {');
      func.push('    return list.splice(x, 1)[0];');
      func.push('  } else {');
      func.push('    return list[x];');
      func.push('  }');
      func.push('}');
      Blockly.Logo.definitions_['lists_get_random_item'] =
          func.join('\n');
    }
    code = Blockly.Logo.lists_getIndex.random +
        '(' + list + ', ' + (mode != 'GET') + ')';
    if (mode == 'GET' || mode == 'GET_REMOVE') {
      return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
    } else if (mode == 'REMOVE') {
      return code + ';\n';
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};

Blockly.Logo.lists_setIndex = function() {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.Logo.valueToCode(this, 'LIST',
      Blockly.Logo.ORDER_MEMBER) || '[]';
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Logo.valueToCode(this, 'AT',
      Blockly.Logo.ORDER_NONE) || '1';
  var value = Blockly.Logo.valueToCode(this, 'TO',
      Blockly.Logo.ORDER_ASSIGNMENT) || 'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.Logo.variableDB_.getDistinctName(
        'tmp_list', Blockly.Variables.NAME_TYPE);
    var code = 'var ' + listVar + ' = ' + list + ';\n';
    list = listVar;
    return code;
  }
  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.unshift(' + value + ');\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      var code = cacheList();
      code += list + '[' + list + '.length - 1] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      return list + '.push(' + value + ');\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (at.match(/^\d+$/)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at += ' - 1';
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.splice(' + at + ', 0, ' + value + ');\n';
    }
  } else if (where == 'FROM_END') {
    var code = cacheList();
    if (mode == 'SET') {
      code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
          ');\n';
      return code;
    }
  } else if (where == 'RANDOM') {
    var code = cacheList();
    var xVar = Blockly.Logo.variableDB_.getDistinctName(
        'tmp_x', Blockly.Variables.NAME_TYPE);
    code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
        '.length);\n';
    if (mode == 'SET') {
      code += list + '[' + xVar + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
      return code;
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};
