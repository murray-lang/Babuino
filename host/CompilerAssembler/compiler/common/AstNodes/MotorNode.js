CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

var MotorNodeKind =
    {
        "motor":       { toString: function () { return "motor"; } },
        "servo":       { toString: function () { return "servo"; } }
    };

function MotorNode(kind, token)
{
    this.nodeType   = CompileNodeType.motor;
    this.kind       = kind;
    this.resultType = [Types.void];
    this.token      = token;
    this.motors     = token.value;
}

module.exports.MotorNode     = MotorNode;
module.exports.MotorNodeKind = MotorNodeKind;
