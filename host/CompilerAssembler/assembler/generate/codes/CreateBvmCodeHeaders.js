var bvmCodes = require('./BvmCodes')
var fs       = require('fs');

// Running this file will output the codes in a C enum format

function listCodes(libs, libName)
{
    var initData      = libs[libName].initData;
    var isBase        = libName == "base";
    var libPrefix     = isBase ? "" : libName.toUpperCase() + "_";
        // For base codes we're interested only in the first code, otherwise
        // we're only interested in the second.
    var codeIndex     = isBase ? 0 : 1;
        // Don't even consider base codes unless they have only one, because
        // compound codes in the base library are all self referential
        // anyway (ie. they are already declared)
    var codeLength = isBase ? 1 : 2;
    var result = "";
    var libCodes = libs[libName].codes;
    for (var i = 0; i < initData.length; i++)
    {
        var name  = initData[i].asm;
        var codes = libCodes[name];

        if (codes.length == codeLength)
        {
            var thisCode = codes[codeIndex];
            result += "\tOP_" + libPrefix + name.toUpperCase() + "\t\t= " + thisCode;
            if (thisCode < 255)
                result += ",";
            result += "\n";
        }
    }
    return result;
}

function camelCase(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function createHeader(libs, libName)
{
    var Libname  = camelCase(libName);
    var fileBase = "Bvm" + Libname + "Codes";
    var filePath = "./" + fileBase + ".h";
    var enumName = "e" + fileBase;
    var define   = "__" + fileBase.toUpperCase() + "_H__"

    var text =   "#ifndef __" + define + "\n"
               + "#define " + define +"\n\n"
               + "enum " + enumName
               + "\n{\n";

    text += listCodes(libs, libName);
    text += "};\n\n#endif";

    try
    {
        fs.writeFileSync(filePath, text, { encoding: 'utf8' });
    }
    catch (e)
    {
        console.error("Error writing header file " + filePath + ": " + e.message);
    }
}

bvmCodes.init();

for (var libName in bvmCodes)
{
    createHeader(bvmCodes, libName);
}

