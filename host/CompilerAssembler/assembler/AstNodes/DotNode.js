AssembleNodeType = require('./NodeType');

function DotNode(token)
{
    this.nodeType = AssembleNodeType.dot;
    this.token    = token;
    this.value    = undefined;
}

module.exports = DotNode;