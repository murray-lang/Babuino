AssembleNodeType = require('./NodeType');

function OriginNode(token, addrExp)
{
    this.nodeType   = AssembleNodeType.origin;
    this.token      = token;
    this.value      = undefined;
    this.children   = [addrExp];

}

module.exports = OriginNode;

