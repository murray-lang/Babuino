AssembleNodeType = require('./NodeType');

function SetNode(token, symbol, value)
{
    this.nodeType = AssembleNodeType.set;
    this.token    = token;
    this.symbol   = symbol; // ie. its token
    this.value    = value;  // ie. its token
}

module.exports = SetNode;