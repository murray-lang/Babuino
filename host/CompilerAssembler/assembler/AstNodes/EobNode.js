AssembleNodeType = require('./NodeType');

function EobNode(token)
{
    this.nodeType    = AssembleNodeType.eob;
    this.token    = token;
}

module.exports = EobNode;