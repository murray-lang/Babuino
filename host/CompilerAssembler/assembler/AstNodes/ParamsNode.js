AssembleNodeType = require('./NodeType');

function ParamsNode(token, children)
{
    this.nodeType = AssembleNodeType.params;
    this.token    = token;
    this.children = [];

    for( var i = 1; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}
/**
 * getTable()
 * Create the lookup table for procedure parameters.
 *
 * @returns an object with parameter names as attributes and their offsets as
 *          values.
 */
ParamsNode.prototype.getTable =
    function ()
    {
        var tableInOrder = [];
        // The first child will always be a GenericNode containing the
        // declarations as its children
        var decls = this.children[0];
        for (var i = 0; i < decls.children.length; i++)
        {
            if (decls.children[i].nodeType == AssembleNodeType.declaration)
            {
                var entry = decls.children[i].getTableInfo();
                tableInOrder.push(entry);
            }
        }
        var table = {};
        var offset = 0;
        for (var i = 0; i < tableInOrder.length; i++)
        {
            offset += tableInOrder[i].size;
            table[tableInOrder[i].label] = offset;
        }
        return table;
    };

module.exports = ParamsNode;