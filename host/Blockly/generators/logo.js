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
 * @fileoverview Helper functions for generating Logo for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Logo');

goog.require('Blockly.CodeGenerator');

Blockly.Logo = Blockly.Generator.get('Logo');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Logo.addReservedWords(
    'to','end','output','repeat','if','ifelse','beep','while','waituntil',
    'loop','forever','wait','stop','reset','send','make', 'resetdp','record',
    'erase','on','onfor','off','thisway','thatway','rd','brake','setsvh','svr',
    'svl','setpower','ledon','ledoff',	'i2c_start','i2c_stop','i2c_read',
    'i2c_write','show','and','or','xor','not','timer','serial','newir?',
    'random','recall',	'sensor1','sensor2','sensor3','sensor4','sensor5',
    'sensor6','sensor7','sensor8','switch1','switch2','switch3','switch4',
    'switch5','switch6','switch7','switch8', 'highbyte','lowbyte','bsend',
    'bsr','when','whenoff','setdp','fastsend', 'item', 'error'
);

/**
 * Order of operation ENUMs.
 * http://docs.python.org/reference/expressions.html#summary
 */

Blockly.Logo.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Logo.ORDER_MEMBER = 1;         // . []
Blockly.Logo.ORDER_NEW = 1;            // new
Blockly.Logo.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.Logo.ORDER_INCREMENT = 3;      // ++
Blockly.Logo.ORDER_DECREMENT = 3;      // --
Blockly.Logo.ORDER_LOGICAL_NOT = 4;    // !
Blockly.Logo.ORDER_BITWISE_NOT = 4;    // ~
Blockly.Logo.ORDER_UNARY_PLUS = 4;     // +
Blockly.Logo.ORDER_UNARY_NEGATION = 4; // -
Blockly.Logo.ORDER_TYPEOF = 4;         // typeof
Blockly.Logo.ORDER_VOID = 4;           // void
Blockly.Logo.ORDER_DELETE = 4;         // delete
Blockly.Logo.ORDER_MULTIPLICATION = 5; // *
Blockly.Logo.ORDER_DIVISION = 5;       // /
Blockly.Logo.ORDER_MODULUS = 5;        // %
Blockly.Logo.ORDER_ADDITION = 6;       // +
Blockly.Logo.ORDER_SUBTRACTION = 6;    // -
Blockly.Logo.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Blockly.Logo.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.Logo.ORDER_IN = 8;             // in
Blockly.Logo.ORDER_INSTANCEOF = 8;     // instanceof
Blockly.Logo.ORDER_EQUALITY = 9;       // == != === !==
Blockly.Logo.ORDER_BITWISE_AND = 10;   // &
Blockly.Logo.ORDER_BITWISE_XOR = 11;   // ^
Blockly.Logo.ORDER_BITWISE_OR = 12;    // |
Blockly.Logo.ORDER_LOGICAL_AND = 13;   // &&
Blockly.Logo.ORDER_LOGICAL_OR = 14;    // ||
Blockly.Logo.ORDER_CONDITIONAL = 15;   // ?:
Blockly.Logo.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
Blockly.Logo.ORDER_COMMA = 17;         // ,
Blockly.Logo.ORDER_NONE = 99;          // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1)\n'
 * @type ?string
 */
Blockly.Logo.INFINITE_LOOP_TRAP = null;

/**
 * Initialise the database of variable names.
 */
Blockly.Logo.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Logo.definitions_ = {};

  if (Blockly.Variables) {
    if (!Blockly.Logo.variableDB_) {
      Blockly.Logo.variableDB_ =
          new Blockly.Names(Blockly.Logo.RESERVED_WORDS_);
    } else {
      Blockly.Logo.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = Blockly.Logo.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' = None';
    }
    Blockly.Logo.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Logo.finish = function(code) {
  // Convert the definitions dictionary into a list.
  /*
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Logo.definitions_) {
    var def = Blockly.Logo.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
  */
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Logo.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Logo string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Logo string.
 * @private
 */
Blockly.Logo.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  /*
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  */
    string = string.replace(/\%/g, '\\%')
                   .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Logo from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Logo code created for this block.
 * @return {string} Logo code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Logo.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Generator.prefixLines(comment, '; ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Generator.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
