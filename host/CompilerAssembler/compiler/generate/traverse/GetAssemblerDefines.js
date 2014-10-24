var AstTraverser  = require('../../../common/AstTraverser');

function GetAssemblerDefines(formatter)
{
    this.formatter = formatter;
    this.defaultReturnValue = "";
}

GetAssemblerDefines.prototype = new AstTraverser();
GetAssemblerDefines.prototype.constructor = GetAssemblerDefines;

GetAssemblerDefines.prototype.default =
    function (node, indent)
    {
        var result = "";
        if (node.defines !== undefined)
            result = this.definesToString(node.defines, indent);

        result += this.traverseChildren(node, indent);

        return result;
    };
GetAssemblerDefines.prototype.combineChildResults =
    function (childResults)
    {
        var result = "";

        for (var i = 0; i < childResults.length; i++)
        {
            if (childResults[i].length > 0)
                result += childResults[i];
        }
        return result;
    };

GetAssemblerDefines.prototype.definesToString =
    function (defines, indent)
    {
        var result = "";
        for (var define in defines)
        {
            result += indent + ".set " + define + ", " + defines[define] + "\n";
        }
        return result;
    };

module.exports = GetAssemblerDefines;