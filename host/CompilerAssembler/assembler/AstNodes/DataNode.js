AssembleNodeType = require('./NodeType');

function DataNode(token, value)
{
    this.nodeType    = AssembleNodeType.data;
    this.token       = token;
    this.instruction = token.value;
    this.children    = [value];
}

module.exports = DataNode;

