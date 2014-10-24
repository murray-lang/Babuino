AstTraverser     = require('../../../common/AstTraverser');
GenericNode      = require('../../../common/GenericNode');
AssembleNodeType         = require('../../AstNodes/NodeType');
ImmediateNode    = require('../../AstNodes/ImmediateNode');
DataNode         = require('../../AstNodes/DataNode');
InstructionNode  = require('../../AstNodes/InstructionNode');
HasNonZeroValues = require('./HasNonZeroValues');
GetSize          = require('./GetSize');

function OptimiseDataInitialisation(formatter)
    {
        this.formatter        = formatter;
        this.hasNonZeroValues = new HasNonZeroValues(formatter);
        this.getSize          = new GetSize(formatter);
    }
OptimiseDataInitialisation.prototype = new AstTraverser();
OptimiseDataInitialisation.prototype.constructor = OptimiseDataInitialisation;

OptimiseDataInitialisation.prototype[AssembleNodeType.section] =
    function (node)
    {
        if (node.section == ".data")
        {
            // A .data section node will be within the .data section's own
            // tree (with a GenericNode as the root). If the entire
            // section's data is zeroes, then create an optimised tree and
            // give it to the sections root node.
            var hasNonZeros = this.hasNonZeroValues.traverse(node.parent);
            if (!hasNonZeros)
            {
                var size = this.getSize.traverse(node.parent);
                if (size > 0)
                {
                    node.parent.optimised = new GenericNode(
                        new DataNode(
                            {token: "span", value: "span", offset: node.token.offset},
                            new ImmediateNode({token: "" + size, value: size, offset: node.token.offset})
                        ),
                        new InstructionNode({token: "push", value: "push", offset: node.token.offset})
                    );
                }
            }
        }
    };

OptimiseDataInitialisation.prototype[AssembleNodeType.locals] =
    function (node)
    {
        var hasNonZeros = this.hasNonZeroValues.traverse(node);
        if (hasNonZeros)
        {
            this.traverseChildren(node);
        }
        else
        {
            var size = this.getSize.traverse(node);
            node.optimised = new GenericNode(
                new DataNode(
                    {token: "span", value: "span", offset: node.token.offset},
                    new ImmediateNode({token: "" + size, value: size, offset: node.token.offset})),
                new InstructionNode({token: "push", value: "push", offset: node.token.offset})
            );
        }
    };

OptimiseDataInitialisation.prototype[AssembleNodeType.declaration] =
    function (node)
    {
        var hasNonZeros = this.hasNonZeroValues.traverse(node);
        if (!hasNonZeros)
        {
            var size = this.getSize.traverse(node);
            node.optimised = new GenericNode(
                new DataNode(
                    {token: "span", value: "span", offset: node.token.offset},
                    new ImmediateNode({token: "" + size, value: size, offset: node.token.offset})),
                new InstructionNode({token: "push", value: "push", offset: node.token.offset})
            );
        }
    };

OptimiseDataInitialisation.prototype.default =
    function (node)
    {
        this.traverseChildren(node);
    };

module.exports = OptimiseDataInitialisation;