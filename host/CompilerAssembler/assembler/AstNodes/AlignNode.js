AssembleNodeType = require('./NodeType');

function AlignNode(token, value)
{
    this.nodeType = AssembleNodeType.align;
    this.token    = token;
    this.value    = value;
}

module.exports = AlignNode;

