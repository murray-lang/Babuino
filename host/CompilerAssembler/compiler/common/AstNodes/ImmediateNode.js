CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

function ImmediateNode(resultType, token)
{
    this.nodeType    = CompileNodeType.immediate;
    this.resultType  = resultType;
    if (token !== undefined)
    {
        this.token = token;
        this.value = this.token.value;
    }
    else
    {
        this.token = null;
        this.value = null;  // Needs to be provided later
    }
}

function createStringLiteralNode(str)
{
    // We need to calculate the length of the string with escapes unescaped,
    // but still keep the literal escape strings to pass onto the assembler.
    var escaped = str.value.replace("\\r", "\r");
    escaped = escaped.replace("\\n", "\n");
    escaped = escaped.replace("\\t", "\t");
    return new ImmediateNode([Types.string(escaped.length)], str);
}

module.exports.ImmediateNode           = ImmediateNode;
module.exports.createStringLiteralNode = createStringLiteralNode;