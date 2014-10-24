AstTraverser = require('../../../common/AstTraverser');
AssembleNodeType     = require('../../AstNodes/NodeType');
TypeMap      = require('../../AstNodes/TypeMap');

function ResolveExpressions(formatter)
{
    this.formatter = formatter;
}
ResolveExpressions.prototype = new AstTraverser();
ResolveExpressions.prototype.constructor = ResolveExpressions;

ResolveExpressions.prototype[AssembleNodeType.expression] =
    function (node, defines)
    {
        var lhs = this.traverse(node.children[0], defines);
        var rhs = this.traverse(node.children[1], defines);

        switch (node.operator)
        {
        case "+":
            node.value = lhs + rhs;
            break;

        case "-":
            node.value = lhs - rhs;
            break;

        case "*":
            node.value = lhs * rhs;
            break;

        case "/":
            node.value = lhs / rhs;
            break;

        case "%":
            node.value = lhs % rhs;
            break;

        case "|":
            node.value = lhs | rhs;
            break;

        case "&":
            node.value = lhs & rhs;
            break;
        }
        return node.value;
    };

ResolveExpressions.prototype[AssembleNodeType.immediate] =
    function (node, defines)
    {
        if (node.value in defines)
            return defines[node.value];

        return node.value;
    };

ResolveExpressions.prototype[AssembleNodeType.sizeof] =
    function (node)
    {
        var type = node.type.type;
        node.value = TypeMap[type].size;
        return node.value;
    };

ResolveExpressions.prototype.default =
    function (node, defines)
    {
        this.traverseChildren(node, defines);
    };

module.exports = ResolveExpressions;