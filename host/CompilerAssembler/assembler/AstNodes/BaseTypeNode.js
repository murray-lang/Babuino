AssembleNodeType = require('./NodeType');
TypeMap  = require('./TypeMap');

function BaseTypeNode(token, values)
    {
        this.nodeType = AssembleNodeType.basetype;
        this.token    = token;
        this.type     = token.value;
        this.children   = [];

        for( var i = 1; i < arguments.length; i++ )
            this.children.push( arguments[i] );
    }

BaseTypeNode.prototype.getSize =
    function ()
    {
        var size = TypeMap[this.type].size;
        return size * this.children.length;
    };

module.exports = BaseTypeNode;