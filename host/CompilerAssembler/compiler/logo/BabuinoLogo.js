/**
 * This module is the primary interface to the Babuino Logo compiler
 *
 * @module BabuinoLogo
 * @type {exports}
 */

var parser        = require('./LogoParser');
var LogoAstFixups = require('./process/LogoAstFixups');
var BasmGenerator = require('../generate/BasmGenerator');

/**
 * This is the main class for generating Babuino Virtual Machine assembly
 * language from a variant of Cricket Logo.
 * @class BabuinoLogo
 * @param {function} output A function that does something with assembly language text
 * @param {MessageFormatter} messageFormatter Formats messages (debug, info, warning error)
 * @constructor
 */
function BabuinoLogo(output, messageFormatter)
{
    this.output     = output;
    this.formatter  = messageFormatter;
}

/**
 * Invokes the JS/CC LALR parser over the given text.
 * Not intended to be invoked from the outside.
 *
 * @method parse
 * @param text {String} The Logo source text to parse
 * @returns {Number} The number of errors encountered by the parser (not the compiler as a whole)
 */
BabuinoLogo.prototype.parse =
	function (text)
	{
		var error_off	= [];
		var error_la	= [];
	
		var error_cnt = parser.parse( text, error_off, error_la );
		if( error_cnt > 0 )
		{
			var i;
			for( var i = 0; i < error_cnt; i++ )
			{

                this.formatter.rawError(
                    "Parse error near >%s<, expecting '%s'",
                    text.substr( error_off[i], 30 ),
                    error_la[i].join()
                );

			}
	
		}
		return error_cnt;
	};

/**
 * Call this method to invoke the entire compile process on the given Logo source text.
 *
 * @method compile
 * @param {String} text The Logo source text
 * @returns {Number|*} The number of errors (At this stage it only returns the number
 * of errors encountered by the parser, not the compiler as a whole)
 */
BabuinoLogo.prototype.compile =
	function (text)
	{
            // Wrap the formatter such that each call has the source text
            // prepended to the arguments.
        var formatter =
            {
                debug: this.formatter.debug.bind(this.formatter, text),
                info:  this.formatter.info.bind(this.formatter, text),
                warn:  this.formatter.warn.bind(this.formatter, text),
                error: this.formatter.error.bind(this.formatter, text)
            };
        parser.ast.init();
		var error_cnt = this.parse(text);
		if (error_cnt != 0)
			return error_cnt;

        var globals = {};
        var procDefs = {};
        var stringLiterals = {};
        var fixup = new LogoAstFixups (
            globals,
            stringLiterals,
            procDefs,
            this.output,
            formatter
        );

        fixup.process(parser.ast.nodes);

        var gen = new BasmGenerator (
            globals,
            procDefs,
            stringLiterals,
            this.output,
            formatter
        );
        gen.generate(parser.ast.nodes);

        return error_cnt;
       };

module.exports = BabuinoLogo;

