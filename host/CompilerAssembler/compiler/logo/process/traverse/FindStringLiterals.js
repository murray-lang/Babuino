var Types              = require('../../../../common/Types');
var AstTraverser       = require('../../../../common/AstTraverser');
CompileNodeType               = require('../../../common/AstNodes/NodeType');

function FindStringLiterals(formatter)
    {
        this.formatter = formatter;
    }
FindStringLiterals.prototype = new AstTraverser();
FindStringLiterals.prototype.constructor = FindStringLiterals;

FindStringLiterals.prototype[CompileNodeType.immediate] =
    function (node, stringLiterals, isBeingAssigned)
    {
        var assigned = isBeingAssigned !== undefined && isBeingAssigned == true;
        if (node.resultType[0].code == "string")
        {
            if (node.value in stringLiterals)
            {
                stringLiterals[node.value].count++;
                stringLiterals[node.value].isAssigned = assigned;
            }
            else
            {
                stringLiterals[node.value] = { count: 1, isAssigned: assigned };
            }
        }
    };

FindStringLiterals.prototype[CompileNodeType.assignment] =
    function (node, stringLiterals)
    {
        this.traverseChildren(node, stringLiterals, true);
    };

FindStringLiterals.prototype[CompileNodeType.call] =
    function (node, stringLiterals)
    {
        this.traverse(node.argsNode, stringLiterals);
    };

FindStringLiterals.prototype.default =
    function (node, stringLiterals)
    {
        this.traverseChildren(node, stringLiterals);
    };

module.exports = FindStringLiterals;