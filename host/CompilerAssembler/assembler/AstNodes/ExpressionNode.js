AssembleNodeType = require('./NodeType');

function ExpressionNode(token, children)
{
    this.nodeType   = AssembleNodeType.expression;
    this.token      = token;
    this.operator   = token.value;
    this.children   = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

module.exports = ExpressionNode;