AssembleNodeType = require('./NodeType');

function LocalsNode(token, children)
{
    this.nodeType = AssembleNodeType.locals;
    this.token    = token;
    this.children = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

LocalsNode.prototype.getTable =
    function ()
    {
        var tableInOrder = [];
        var declarations = this.children[0];
        for (var i = 0; i < declarations.children.length; i++)
        {
            if (declarations.children[i].nodeType == AssembleNodeType.declaration)
            {
                var entry = declarations.children[i].getTableInfo();
                tableInOrder.push(entry);
            }
        }
        var table = {};
        var offset = 0;
        for (var i = 0; i < tableInOrder.length; i++)
        {
            table[tableInOrder[i].label] = offset;
            offset += tableInOrder[i].size;
        }
        return table;
    };

LocalsNode.prototype.hasNonZeroValues =
    function ()
    {
        for (var i = 0; i < this.children.length; i++)
        {
            if (this.children[i].hasNonZeroValues())
                return true;
        }
        return false;
    };

module.exports = LocalsNode;