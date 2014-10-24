AssembleNodeType = require('./NodeType');

function ReturnNode(token)
{
    this.nodeType = AssembleNodeType.return;
    this.token    = token;
}

module.exports = ReturnNode;