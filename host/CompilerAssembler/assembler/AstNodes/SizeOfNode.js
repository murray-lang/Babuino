AssembleNodeType = require('./NodeType');

function SizeOfNode(token, type)
{
    this.nodeType   = AssembleNodeType.sizeof;
    this.token      = token;
    this.type       = type;
}

module.exports = SizeOfNode;