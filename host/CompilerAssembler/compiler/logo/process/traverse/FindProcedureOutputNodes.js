var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
CompileNodeType          = require('../../../common/AstNodes/NodeType');
ControlNodeKind          = require('../../../common/AstNodes/ControlNode').ControlNodeKind;

function FindProcedureOutputNodes(formatter)
    {
        this.formatter = formatter;
    }
FindProcedureOutputNodes.prototype = new AstTraverser();
FindProcedureOutputNodes.prototype.constructor = FindProcedureOutputNodes;

FindProcedureOutputNodes.prototype[CompileNodeType.control] =
    function (node, outputNodes)
    {
        if (node.kind == ControlNodeKind.output)
            outputNodes.push(node);
        else
            this.traverseChildren(node, outputNodes);
    };

FindProcedureOutputNodes.prototype["default"] =
    function (node, outputNodes)
    {
        this.traverseChildren(node, outputNodes);
    };

module.exports = FindProcedureOutputNodes;