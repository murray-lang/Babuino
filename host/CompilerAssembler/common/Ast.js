var GenericNode = require('../common/GenericNode');

function AbstractSyntaxTree()
{
    this.init();
}

AbstractSyntaxTree.prototype.init =
    function ()
    {
        delete this.nodes;
        this.nodes = new GenericNode();
    };

AbstractSyntaxTree.prototype.appendNode =
    function (node)
    {
        if (this.nodes == null)
            this.nodes = new GenericNode();
        else
            this.nodes.children.push(node);
    };

function appendChildren(node, children)
{
    if (node.children === undefined)
        node.children = [];

    for (var i = 1; i < arguments.length; i++)
        node.children.push(arguments[i]);

    return node;
}



function concatNodes(first, second)
{
    if (first === undefined)
        return new GenericNode(second);

    if (first.nodeType == "empty")
        return new GenericNode(first, second);

    if (first.children === undefined)
        return new GenericNode(first, second);

    first.children.push(second);

    return first;
}

function appendChildren(node, children)
    {
        if (node.children === undefined)
            node.children = [];

        for (var i = 1; i < arguments.length; i++)
            node.children.push(arguments[i]);

        return node;
    }

module.exports.AbstractSyntaxTree = AbstractSyntaxTree;
module.exports.appendChildren     = appendChildren;
module.exports.concatNodes        = concatNodes;
