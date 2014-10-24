/*
        Default driver template for JS/CC generated parsers for V8
        
        Features:
        - Parser trace messages
        - Step-by-step parsing
        - Integrated panic-mode error recovery
        - Pseudo-graphical parse tree generation
        
        Written 2007 by Jan Max Meyer, J.M.K S.F. Software Technologies
        Modified 2008 from driver.js_ to support V8 by Louis P.Santillan
                        <lpsantil@gmail.com>
        
        This is in the public domain.
*/


//--------------------------------------------------------------------------
// My stuff

var parser                = require('./BasmParser');
var AssemblerAstProcessor = require('./process/AssemblerAstProcessor');
var BvmGenerator          = require('./generate/BvmGenerator');

function BabuinoAssembler(output, messageFormatter)
{
    this.output    = output;
    this.formatter = messageFormatter;
    parser.ast.setFormatter(messageFormatter);
}

BabuinoAssembler.prototype.parse =
    function (text)
    {
        var error_off	= [];
        var error_la	= [];

        //LogoCC_dbg_withparsetree = true;
        //LogoCC_dbg_withtrace = true;
        var error_cnt = parser.parse( text, error_off, error_la );
        if( error_cnt > 0 )
        {
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

BabuinoAssembler.prototype.assemble =
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

        //output("AST before processing:\n");
        //output(ast.toString());

        var processor = new AssemblerAstProcessor(formatter);

        processor.process(parser.ast);

        //output("AST after processing:\n");
        //output(ast.toString());

        var gen = new BvmGenerator(this.output, formatter);
        gen.generate(parser.ast);

        return error_cnt;
    };

module.exports = BabuinoAssembler;

