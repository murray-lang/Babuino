AssembleNodeType = require('./NodeType');

function LabelNode(token)
{
    this.nodeType = AssembleNodeType.label;
    this.token    = token;
    this.label    = token.value;
}
module.exports = LabelNode;