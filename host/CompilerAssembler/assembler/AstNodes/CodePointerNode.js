AssembleNodeType = require('./NodeType');

function CodePointerNode(token, symbolToken)
{
    this.nodeType    = AssembleNodeType.codeptr;
    this.token       = token;
    this.symbolToken = symbolToken;
    this.symbol      = symbolToken.value;
}

module.exports = CodePointerNode;
