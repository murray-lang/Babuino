AssembleNodeType = require('./NodeType');

function ConfigsNode(token, args)
{
    this.nodeType    = AssembleNodeType.configs;
    this.token     = token;
    // Argument is a GenericNode with the configuration commands as its
    // children. Unpack them.
    this.children  = [];

    if (args !== undefined)
        for( var i = 1; i < args.children.length; i++ )
            this.children.push( args.children[i] );
}

module.exports = ConfigsNode;