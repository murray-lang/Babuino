AstTraverser     = require('../../../common/AstTraverser');
AssembleNodeType = require('../../AstNodes/NodeType');
TypeMap          = require('../../AstNodes/TypeMap');

function GetSize(formatter)
    {
        this.formatter = formatter;
    }
GetSize.prototype = new AstTraverser();
GetSize.prototype.constructor = GetSize;

GetSize.prototype[AssembleNodeType.declaration] =
    function (node)
    {
        // The first child is the label.
        return this.traverse(node.children[1]);
    };

GetSize.prototype[AssembleNodeType.basetype] =
    function (node)
    {
        var size = TypeMap[node.type].size;
        return size * node.children.length;
    };

GetSize.prototype[AssembleNodeType.repeat] =
    function (node)
    {
        var count = node.children[0].value;
        var size = 0;
        for (var i = 0; i < count; i++)
            for (var j = 1; j < node.children.length; j++)
                size += this.traverse(node.children[j]);
        return size;
    };

GetSize.prototype.combineChildResults =
    function (childResults)
    {
        var size = 0;
        for (var i = 0; i < childResults.length; i++)
        {
            if (childResults[i] !== undefined)
                size += childResults[i];
        }
        return size;
    };

GetSize.prototype.default =
    function (node)
    {
        return this.traverseChildren(node);
    };

module.exports = GetSize;