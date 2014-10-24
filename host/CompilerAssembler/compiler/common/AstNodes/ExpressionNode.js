CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

var ExpressionNodeKind =
    {
        "logic":    { toString: function () { return "logic"; } },
        "math":     { toString: function () { return "math"; } },
        "convert":  { toString: function () { return "convert"; } }
    };

function ExpressionNode(token, kind, operator, resultType, children)
{
    this.nodeType   = CompileNodeType.expression;
    this.token      = token;
    this.resultType = resultType;
    this.kind		= kind;
    this.operator   = operator;
    this.children   = [];

    for (var i = 4; i < arguments.length; i++)
        this.children.push(arguments[i]);
}

module.exports.ExpressionNode     = ExpressionNode;
module.exports.ExpressionNodeKind = ExpressionNodeKind;
