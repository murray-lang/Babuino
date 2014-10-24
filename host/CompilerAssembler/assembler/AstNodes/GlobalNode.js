AssembleNodeType = require('./NodeType');

function GlobalNode(token)
{
    this.nodeType = AssembleNodeType.global;
    this.token    = token;
    this.symbol   = token.value;
}

module.exports = GlobalNode;