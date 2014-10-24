var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
CompileNodeType                 = require('../../../common/AstNodes/NodeType');

/*******************************************************************************
 * Since Logo has no statement delimiter, nor a delimiter for arguments to a
 * procedure, the parser alone cannot possibly distinguish what's what when
 * the arguments to a procedure are themselves procedures (functions). The
 * parser will treat everything following a procedure call as an argument until
 * it reaches a token that it knows not to be a procedure or value expression.
 *
 * Note that therefore any procedure found in the argument list must be the last
 * argument for the previous procedure because all following arguments are
 * associated with the latter as far as the parser is concerned.
 * This of course continues down the line. So, arguments for one procedure might
 * be found in child node of another procedure node further out in the tree.
 *
 * The other problem is that a procedure that the parser thinks to be an
 * argument might in fact be an unrelated statement that's meant to follow the
 * previous procedure.
 *
 * To unravel all of this ambiguity requires information about the procedure
 * definitions to be gathered first. This way we can determine how many
 * arguments the procedure is supposed to have and whether it returns a value.
 * The latter is useful because a void function is unlikely to be an argument
 * and is surely meant to follow the current function at hand.
 ******************************************************************************/

function SeparateStatementsFromArgs(formatter)
    {
        this.formatter = formatter;
    }
SeparateStatementsFromArgs.prototype = new AstTraverser();
SeparateStatementsFromArgs.prototype.constructor = SeparateStatementsFromArgs;

SeparateStatementsFromArgs.prototype[CompileNodeType.call] =
    function (node, procDefs, stmts)
    {
        if (node.argsNode != undefined && node.argsNode != null)
        {
            if (   node.argsNode.children != undefined
                && node.argsNode.children != null
                && node.argsNode.children.length > 0)
            {
                // If there's an argument that's a procedure call then it
                // will always be the last argument, because any arguments
                // that follow in the source code will be attached to that
                // call.
                var lastArg = node.argsNode.children[node.argsNode.children.length - 1];
                if (lastArg.nodeType == CompileNodeType.call)
                {
                    this.traverse(lastArg, procDefs, stmts);
                    if (Types.isVoid(lastArg.resultType))
                    {
                        node.argsNode.children.pop(); // Remove lastArg from this call...
                        stmts.unshift(lastArg);       //...and add it to the statements to come later
                        lastArg.returnValueExpected = false;
                    }
                }
            }
        }
    };

SeparateStatementsFromArgs.prototype.default =
    function (node, procDefs)
    {
        if (node.children != undefined && node.children != null)
        {
            for (var i = 0; i < node.children.length; i++)
            {
                var localStmts = [];
                this.traverse(node.children[i], procDefs, localStmts);
                if (localStmts.length > 0)
                {
                    if (i == node.children.length - 1)
                    {
                        node.children = node.children.concat(localStmts);
                    }
                    else
                    {
                        for (var j = 0; j < localStmts.length; j++)
                            node.children.splice(i + 1 + j, 0, localStmts[j]);
                    }
                }
            }
        }
    };

module.exports = SeparateStatementsFromArgs;