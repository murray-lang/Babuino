AstTraverser          = require('../../../common/AstTraverser');
CompileNodeType       = require('../../common/AstNodes/NodeType');
VariableNodeKind      = require('../../common/AstNodes/VariableNode').VariableNodeKind;
VarAssignmentNodeKind = require('../../common/AstNodes/VarAssignmentNode').VarAssignmentNodeKind;
ControlNodeKind       = require('../../common/AstNodes/ControlNode').ControlNodeKind;
VarFetchNodeKind      = require('../../common/AstNodes/VarFetchNode').VarFetchNodeKind;
var Types             = require('../../../common/Types');


function MakeIteratorsPointers(formatter)
{
    this.formatter = formatter;

}

MakeIteratorsPointers.prototype = new AstTraverser();
MakeIteratorsPointers.prototype.constructor = MakeIteratorsPointers;

MakeIteratorsPointers.prototype.default =
    function (node, variables, iterators)
    {
        this.traverseChildren(node, variables, iterators);
    };

MakeIteratorsPointers.prototype[CompileNodeType.control] =
    function (node, variables, iterators)
    {
        if (node.kind == ControlNodeKind.foreach)
        {
            var varNode = node.children[0];
                // Change the VariableNode's type to a pointer (insert a
                // pointer type between the first pointer, that all variables
                // have, and the data type).
            varNode.type.splice(1, 0, Types.pointer);
                // Counter that with a dereference
            varNode.things++;
                // Add it to the iterators so that other VariableNodes referring
                // to the iterator can be detected and modified.
            iterators[varNode.name] = varNode;
                // Now update the variable table (this could be global or local
                // depending on the context in which this traverser was invoked).
            var varInfo = variables[varNode.name];
            varInfo.type.unshift(Types.pointer);
                // Traverse the list because it might contain a reference to an
                // outer iterator.
            this.traverse(node.children[1], variables, iterators);
                // Traverse the block to find references to iterators and to
                // traverse nested foreach loops.
            this.traverse(node.children[2], variables, iterators);

        }
        else
        {
            this.traverseChildren(node, variables, iterators);
        }

    };

MakeIteratorsPointers.prototype[CompileNodeType.procedure] =
    function (node)
    {
            // Provide iterators and variables for this procedure only.
        this.traverse(node.statements, node.localVars, {});
    };

MakeIteratorsPointers.prototype[CompileNodeType.variable] =
    function (node, variables, iterators)
    {
        if (node.name in iterators)
        {
            node.type.splice(1, 0, Types.pointer);
            // Counter that with a dereference
            node.things++;
        }
    };

MakeIteratorsPointers.prototype[CompileNodeType.call] =
    function (node, variables, iterators)
    {
        this.traverse(node.argsNode, variables, iterators);
    };

MakeIteratorsPointers.prototype[CompileNodeType.fetch] =
    function (node, variables, iterators)
    {
        this.traverse(node.variable, variables, iterators);
        this.traverseChildren(node, variables, iterators);
    };

MakeIteratorsPointers.prototype[CompileNodeType.assignment] =
    function (node, variables, iterators)
    {
        this.traverse(node.variable, variables, iterators);
        this.traverseChildren(node, variables, iterators);
    };

module.exports = MakeIteratorsPointers;