AssembleNodeType = require('./NodeType');

function AddressExpressionNode(operator, children)
{
    this.nodeType   = AssembleNodeType.addrexp;
    this.token      = operator;
    this.operator   = operator.value;
    this.value      = undefined;
    this.children   = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

module.exports = AddressExpressionNode;