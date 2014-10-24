/**
 * This file provides a console-based wrapper around
 * @module BabuinoLogoMain
 * @type {BabuinoLogo|exports}
 * @requires BabuinoLogo, MessageFormatter
 *
 */
BabuinoLogo       = require('./BabuinoLogo')
var fs            = require('fs');
MessageFormatter  = require('../../common/MessageFormatter');

var basmText = "";

function outputHandler(str)
{
    basmText += str;
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

if( process.argv.length > 2 )
{
    var logo;
    var logoFileName = process.argv[2];
    var basmFileName = process.argv[3];

    try
    {
        logo = fs.readFileSync( logoFileName, { encoding: 'utf8' });
    }
    catch (e)
    {
        formatter.rawError("Error reading file %s: %s", logoFileName, e.message);
        process.exit(1);
    }
    formatter.rawInfo("Compiling file %s", logoFileName);
    var bl = new BabuinoLogo(outputHandler, formatter);
    try
    {
        bl.compile(logo);
    }
    catch(e)
    {
        formatter.rawError("Error compiling file %s: %s", logoFileName, e.message);
        process.exit(1);
    }
    formatter.rawInfo("Writing basm to file %s", basmFileName);
    try
    {
        fs.writeFileSync(basmFileName, basmText, { encoding: 'utf8' });
    }
    catch (e)
    {
        formatter.rawError("Error writing basm file %s: %s", basmFileName, e.message);
        process.exit(1);
    }
    process.exit(0);
}
else
{
    formatter.rawError("usage: BabuinoLogo.js <logo file in> <basm file out>");
    process.exit(1);
}