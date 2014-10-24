var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
CompileNodeType                 = require('../../../common/AstNodes/NodeType');
FindProcedureOutputNodes = require('./FindProcedureOutputNodes');

function FindProcedures(formatter)
    {
        this.formatter = formatter;
        this.outputNodeFinder = new FindProcedureOutputNodes();
    }
FindProcedures.prototype = new AstTraverser();
FindProcedures.prototype.constructor = FindProcedures;

FindProcedures.prototype[CompileNodeType.procedure] =
    function (node, procDefs)
    {
        if (node.name in procDefs)
        {
            this.formatter.error(false, node.token, "Redefinition of procedure %s", node.name);
            this.formatter.error(true, procDefs[node.name].node.token, "Procedure first declared here:");
            return;
        }

        var outputNodes = [];
        this.outputNodeFinder.traverse(node, outputNodes);
        // This is useful first-pass information that is used in resolving
        // ambiguities in a string of procedure calls.
        if (outputNodes.length == 0)
            node.resultType = [Types.void];

        procDefs[node.name] = node;
    };

FindProcedures.prototype.default =
    function (node, procDefs)
    {
        this.traverseChildren(node, procDefs);
    };

module.exports = FindProcedures;