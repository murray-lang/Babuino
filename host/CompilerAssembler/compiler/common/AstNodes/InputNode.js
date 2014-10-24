CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');
ImmediateNode = require("./ImmediateNode").ImmediateNode;

var InputNodeKind =
{
    "slot":         { toString: function () { return "slot"; } },
    "repcount":     { toString: function () { return "repcount"; } },
    "timer":        { toString: function () { return "timer"; } },
    "random":       { toString: function () { return "random"; } },
    "recall":       { toString: function () { return "recall"; } },
    "serial":       { toString: function () { return "serial"; } },
    "newserial":    { toString: function () { return "newserial"; } },
    "digitalin":    { toString: function () { return "digitalin"; } },
    "analogin":     { toString: function () { return "analogin"; } },
    "sensor":       { toString: function () { return "sensor"; } },
    "switch":       { toString: function () { return "switch"; } },
    "i2cerr":       { toString: function () { return "i2cerr"; } }
};

function InputNode(kind, token, resultType, children)
{
    this.nodeType   = CompileNodeType.input;
    this.token      = token;
    this.resultType = resultType;
    this.kind       = kind;
    this.children   = [];

    if (kind == InputNodeKind.sensor || kind == InputNodeKind.switch)
    {
        this.children.push(new ImmediateNode([Types.int16], arguments[3]));
    }
    else
    {
        for (var i = 3; i < arguments.length; i++)
            this.children.push(arguments[i]);
    }
}

module.exports.InputNodeKind = InputNodeKind;
module.exports.InputNode = InputNode;