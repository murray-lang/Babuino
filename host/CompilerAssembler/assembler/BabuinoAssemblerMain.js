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

BabuinoAssembler = require('./BabuinoAssembler');
var fs           = require('fs');
MessageFormatter = require('../common/MessageFormatter');

var vmCodes = "";

function outputHandler(codes)
{
    vmCodes += codes;
}

function debugHandler(str)
    {
        console.log(str);
    }

function infoHandler(str)
    {
        console.log(str);
    }

function warningHandler(str)
{
    console.warn(str);
}

function errorHandler(str)
{
    console.error(str);
}

// This code will be called when the generated script is run
var formatter = new MessageFormatter('./i18n', 'es', debugHandler, infoHandler, warningHandler, errorHandler);
    // The assembler AST requires a formatter to output messages
//parser.ast.setFormatter(formatter);

if( process.argv.length > 2 )
{
    var basm;
    var basmFileName = process.argv[2];
    var outFileName = process.argv[3];
    try
    {

        basm = fs.readFileSync( basmFileName, { encoding: 'utf8' });
    }
    catch (e)
    {
        formatter.rawError("Error reading file %s: %s", basmFileName, e.message);
        process.exit(1);
    }
    formatter.rawInfo("Assembling file %s", basmFileName);
    var ba = new BabuinoAssembler(outputHandler, formatter);
    try
    {
        ba.assemble(basm);
    }
    catch(e)
    {
        formatter.rawError("Error assembling file %s: %s", basmFileName, e.message);
        process.exit(1);
    }
    formatter.rawInfo("Writing byte codes to file %s", outFileName);
    try
    {
        fs.writeFileSync(outFileName, vmCodes, { encoding: 'utf8' });
    }
    catch (e)
    {
        formatter.rawError("Error writing output file %s: %s", outFileName, e.message);
        process.exit(1);
    }
    process.exit(0);
}
else
{
    formatter.rawError("usage: BabuinoAssembler.js <basm file in> <byte code file out>" );
    process.exit(1);
}

