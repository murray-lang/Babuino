AssembleNodeType = require('./NodeType');

function VariablePointerNode(token, symbolToken)
{
    this.nodeType = AssembleNodeType.varptr;
    this.token       = token;
    this.scope    = token.value;
    this.symbolToken = symbolToken;
    this.symbol   = symbolToken.value;
}

module.exports = VariablePointerNode;