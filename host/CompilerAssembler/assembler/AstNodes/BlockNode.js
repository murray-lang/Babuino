AssembleNodeType = require('./NodeType');

function BlockNode(token)
{
    this.nodeType = AssembleNodeType.block;
    this.token    = token;
    this.length    = 0;
}

module.exports = BlockNode;