AssembleNodeType = require('./NodeType');

function InstructionNode(token, children)
{
    this.nodeType    = AssembleNodeType.instruction;
    this.token       = token;
    this.instruction = token.value;
    this.children    = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

module.exports = InstructionNode;

