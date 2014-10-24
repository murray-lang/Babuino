AstTraverser   = require('../../../common/AstTraverser');
AssembleNodeType       = require('../../AstNodes/NodeType');

function GatherDefines(formatter)
{
    this.formatter      = formatter;
}
GatherDefines.prototype = new AstTraverser();
GatherDefines.prototype.constructor = GatherDefines;

GatherDefines.prototype[AssembleNodeType.set] =
    function (node, defines)
    {
            // (Replace any existing definition)
        defines[node.symbol.value] = node.value.value;
    };

GatherDefines.prototype.default =
    function (node, defines)
    {
        return this.traverseChildren(node, defines);
    };

module.exports = GatherDefines;