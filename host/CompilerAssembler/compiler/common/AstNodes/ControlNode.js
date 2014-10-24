CompileNodeType             = require("./NodeType");
var Types            = require("../../../common/Types");
var VariableNodeKind = require('./VariableNode').VariableNodeKind;
var VariableNode     = require('./VariableNode').VariableNode;

var ControlNodeKind =
{
    "if":        { toString: function () { return "if"; } },
    "ifelse":    { toString: function () { return "ifelse"; } },
    "repeat":    { toString: function () { return "repeat"; } },
    "foreach":   { toString: function () { return "foreach"; } },
    "forever":   { toString: function () { return "forever"; } },
    "for":       { toString: function () { return "for"; } },
    "while":     { toString: function () { return "while"; } },
    "dowhile":   { toString: function () { return "dowhile"; } },
    "tag":       { toString: function () { return "tag"; } },
    "goto":      { toString: function () { return "goto"; } },
    "output":    { toString: function () { return "output"; } },
    "return":    { toString: function () { return "return"; } },
    "wait":      { toString: function () { return "wait"; } },
    "waituntil": { toString: function () { return "waituntil"; } }
};

function ControlNode(kind, token, children)
{
    this.nodeType   = CompileNodeType.control;
    this.token      = token;
    this.resultType = kind == ControlNodeKind.output ? [Types.unknown] : [Types.void];
    this.kind       = kind;
    this.children   = [];

    if (kind == ControlNodeKind.for)
    {
        this.children.push(new VariableNode(arguments[2], VariableNodeKind.nameof, [Types.int16]));
        for (var i = 3; i < arguments.length; i++)
            this.children.push(arguments[i]);
    }
    else if (kind == ControlNodeKind.foreach)
    {
        var iterator = new VariableNode(
            arguments[2],
            VariableNodeKind.iterator,
            [Types.unknown]
        );
        this.children.push(iterator);
        for (var i = 3; i < arguments.length; i++)
            this.children.push(arguments[i]);
    }
    else
    {
        for (var i = 2; i < arguments.length; i++)
            this.children.push(arguments[i]);
    }
}

module.exports.ControlNode     = ControlNode;
module.exports.ControlNodeKind = ControlNodeKind;