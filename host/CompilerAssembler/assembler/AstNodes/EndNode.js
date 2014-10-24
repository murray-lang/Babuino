AssembleNodeType = require('./NodeType');

function EndNode(token)
{
    this.nodeType = AssembleNodeType.end;
    this.token     = token;
}

module.exports = EndNode;