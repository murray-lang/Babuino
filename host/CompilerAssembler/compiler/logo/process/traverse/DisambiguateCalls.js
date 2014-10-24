var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
CompileNodeType                 = require('../../../common/AstNodes/NodeType');

function DisambiguateCalls(formatter)
{
    this.formatter = formatter;
}
DisambiguateCalls.prototype = new AstTraverser();
DisambiguateCalls.prototype.constructor = DisambiguateCalls;

DisambiguateCalls.prototype[CompileNodeType.call] =
    function (node, procDefs, remainders)
    {
        if (!(node.name in procDefs))
        {
            this.formatter.error(false, node.token, "Call to undefined procedure %s", node.name);
            return;
        }
        if (node.argsNode != undefined && node.argsNode != null)
        {
            if (node.argsNode.children != undefined && node.argsNode.children != null && node.argsNode.children.length > 0)
            {
                var required = procDefs[node.name].numParameters;
                var diff = node.argsNode.children.length - required;

                // If there's an argument that's a procedure call then it
                // will always be the last argument, because any arguments
                // that follow in the source code will be attached to that
                // call.
                var lastArg = node.argsNode.children[node.argsNode.children.length - 1];
                if (lastArg.nodeType == CompileNodeType.call)
                {
                    var followingRemainders = [];
                    this.traverse(lastArg, procDefs, followingRemainders);
                    var ourRemainders = [];
                    if (diff < 0)
                    {
                        if (-diff > followingRemainders.length)
                        {
                            this.formatter.error(false, node.token, "Not enough arguments available for %s",  node.name);
                            return;
                        }
                        var stolen = followingRemainders.splice(0, -diff);
                        node.argsNode.children = node.argsNode.children.concat(stolen);
                    }
                    else if (diff > 0)
                    {
                        ourRemainders = node.argsNode.children.splice(required, diff);
                    }
                    remainders.push.apply(remainders, ourRemainders);
                    remainders.push.apply(remainders, followingRemainders);
                }
                else
                {
                    // Remove any excess parameters and pass them back
                    if (required < node.argsNode.children.length)
                    {
                        var numRemainders = node.argsNode.children.length - required;
                        var excess = node.argsNode.children.splice(required,  numRemainders);
                        remainders.push.apply(remainders, excess);
                    }
                }
            }
        }
    };

DisambiguateCalls.prototype.default =
    function (node, procDefs, remainders)
    {
        this.traverseChildren(node, procDefs, remainders);
    };

module.exports = DisambiguateCalls;