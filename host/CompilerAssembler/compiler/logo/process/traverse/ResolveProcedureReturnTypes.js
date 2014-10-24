var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
CompileNodeType                 = require('../../../common/AstNodes/NodeType');
FindProcedureOutputNodes = require('./FindProcedureOutputNodes');

/*******************************************************************************
 * This traversal cannot operate on its own. It is intended to be used by
 * FixTypesAndBuildVariableTable, which mixes in its own handlers for nodes
 * other than procedure and call
 * @constructor
 ******************************************************************************/
function ResolveProcedureReturnTypes(formatter)
    {
        this.formatter = formatter;
        this.defaultReturnValue = [Types.void];
        // This is set to true if failure is acceptable
        this.relax = false;
    }
ResolveProcedureReturnTypes.prototype = new AstTraverser();
ResolveProcedureReturnTypes.prototype.constructor = ResolveProcedureReturnTypes;

ResolveProcedureReturnTypes.prototype[CompileNodeType.procedure] =
    function (node, procDefs, variables, calls, relax)
    {
        if (!Types.isUnknown(node.resultType))
            return node.resultType;

        // If the code being compiled is recursive, then we could enter an
        // infinite loop trying to resolve the return type. The procedure
        // itself should have a return path that doesn't involve recursion,
        // so for the purposes of resolving the return type we can just
        // ignore the recursive path and find the terminating return path.
        if (node.preventRecursion !== undefined)
        {
            node.resultType = [Types.unknown];
            return node.resultType;
        }

        node.preventRecursion = true;

        if (!(node.name in procDefs))
        {
            node.preventRecursion = undefined;
            this.formatter.error(false, node.token, "No procedure defined for %s" + node.name);
            return [Types.unknown];
        }

        // find all of the return statements
        var returnNodes = [];
        new FindProcedureOutputNodes().traverse(node, returnNodes);

        if (returnNodes.length == 0)
        {
            node.preventRecursion = undefined;
            // No return statements (that have values). Must be void.
            node.resultType = [Types.void];
            return node.resultType;
        }
        // Find the return types of each of the return paths
        // Failures are probably because the procedure is recursive, and
        // we're preventing a recursive search here so that we don't enter
        // an infinite loop. Remember the failures so that we can try again
        // (to resolve call return types) once we've determined a return
        // type for this procedure.
        var knownTypes   = [];
        var knownNodes   = [];
        var unknownNodes = [];
        for (var i = 0; i < returnNodes.length; i++)
        {
            this.traverse(returnNodes[i], procDefs, variables, calls, node.parameterTable);
            if (!Types.isUnknown(returnNodes[i].resultType))
            {
                knownNodes.push(returnNodes[i]);
                knownTypes.push(returnNodes[i].resultType);
            }
            else
            {
                unknownNodes.push(returnNodes[i]);
            }
        }
        // If we can't find any return type then we're stuffed!
        if (knownTypes.length == 0)
        {
            node.preventRecursion = undefined;
            if (!this.relax)
            {
                this.formatter.error(false, node.token, "Cannot determine a return type for %s", node.name);
                return [Types.unknown];
            }
            return node.resultType;
        }

        // Now we need to reconcile any discrepancies between the known
        // return types. (It's possible that they differ)
        var harmonisedType = Types.harmonise.apply(Types, knownTypes);
        if (harmonisedType == null)
        {
            node.preventRecursion = undefined;
            this.formatter.error(false, node.token, "Different return paths in %s have incompatible types", node.name);
            // Use the "output" token for now
            // TODO: provide the tokens for the values rather than "output"
            for (var i = 0; i < knownNodes.length; i++)
            {
                if (knownNodes[i].children[0].token !== undefined)
                    this.formatter.error(true, knownNodes[i].children[0].token);
                else
                    this.formatter.error(true, knownNodes[i].token);
            }
            return [Types.unknown];
        }
        // This change will be reflected in procDefs, so we can try again below.
        node.resultType = harmonisedType;
        // Now try to resolve the return statements that couldn't be resolved before.
        for (var i = 0; i < unknownNodes.length; i++)
        {
            this.traverse(unknownNodes[i], procDefs, variables, calls, node.parameterTable);
            if (Types.isUnknown(unknownNodes[i].resultType))
            {
                node.preventRecursion = undefined;
                this.formatter.error(false, unknownNodes[i].token, "Cannot determine the type for a return path in %s", node.name);
                return [Types.unknown];
            }
        }
        // ...and update all of the return statements with the harmonised
        // result type
        for (var i = 0; i < returnNodes.length; i++)
            returnNodes[i].resultType = harmonisedType;

        node.preventRecursion = undefined;
        return node.resultType;
    };

ResolveProcedureReturnTypes.prototype[CompileNodeType.call] =
    function (node, procDefs, variables, calls, params)
    {
        if (!(node.name in procDefs))
        {
            this.formatter.error("No procedure defined for %s" + node.name);
            return [Types.unknown];
        }

        this.traverse(node.argsNode, procDefs, variables, calls, params);

        // Get the result from the definition
        var procNode = procDefs[node.name];
        if (Types.isUnknown(procNode.resultType))
        {
            // Not known yet. Search the procedure itself.
            var procResultType = this.traverse(procNode, procDefs, variables, calls, params);
            if (Types.isUnknown(procResultType))
                return [Types.unknown];
        }
        node.resultType = procNode.resultType;

        return node.resultType;
    };

module.exports = ResolveProcedureReturnTypes;