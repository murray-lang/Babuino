AssembleNodeType = require('./NodeType');

function SectionNode(token, children)
{
    this.nodeType  = AssembleNodeType.section;
    this.token     = token;
    this.section   = token.value;
    this.children  = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

module.exports = SectionNode;

