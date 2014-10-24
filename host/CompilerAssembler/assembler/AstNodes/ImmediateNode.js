AssembleNodeType = require('./NodeType');

function ImmediateNode(token)
{
    this.nodeType = AssembleNodeType.immediate;
    this.token    = token;
    this.value    = token.value;
}

module.exports = ImmediateNode;