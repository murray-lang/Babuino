AstTraverser     = require('../../../common/AstTraverser');
AssembleNodeType = require('../../AstNodes/NodeType');

function HasNonZeroValues(formatter)
{
    this.formatter = formatter;
}
HasNonZeroValues.prototype = new AstTraverser();
HasNonZeroValues.prototype.constructor = HasNonZeroValues;

HasNonZeroValues.prototype[AssembleNodeType.declaration] =
    function (node)
    {
        // The first child is the label. Skip it.
        for (var i = 1; i < node.children.length; i++)
        {
            if (this.traverse(node.children[i]))
                return true;
        }
        return false;
    };

HasNonZeroValues.prototype[AssembleNodeType.basetype] =
    function (node)
    {
        for (var i = 0; i < node.children.length; i++)
        {
            var isNumber = typeof node.children[i].value == "number";
            var isString = typeof node.children[i].value == "string";
            if (   (isNumber && node.children[i].value != 0)
                || (isString && node.children[i].value.length > 0))
                return true;
        }
        return false;
    };

HasNonZeroValues.prototype[AssembleNodeType.repeat] =
    function (node)
    {
        // First child is the count. Skip it.
        for (var i = 1; i < node.children.length; i++)
        {
            if (this.traverse(node.children[i]))
                return true;
        }
        return false;
    };

HasNonZeroValues.prototype.combineChildResults =
    function (childResults)
    {
        for (var i = 0; i < childResults.length; i++)
        {
            if (childResults[i] === undefined)
                continue;
            if (childResults[i] == true)
                return true;
        }
        return false;
    }

HasNonZeroValues.prototype.default =
    function (node)
    {
        return this.traverseChildren(node);
    };

module.exports = HasNonZeroValues;