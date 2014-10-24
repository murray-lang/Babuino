CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

function CallNode(name, args)
{
    this.nodeType   = CompileNodeType.call;
    this.token      = name;
    this.name       = this.token.value;
    // The following will need to be updated when more is known about the
    // procedure being called.
    this.resultType = [Types.unknown];
    this.returnValueExpected = undefined; // Updated later
    this.argsNode = args;
        // Give the arguments node the token for the procedure definition that
        // it relates to.
    if (this.argsNode !== undefined)
        this.argsNode.token = this.token;
}

module.exports = CallNode;