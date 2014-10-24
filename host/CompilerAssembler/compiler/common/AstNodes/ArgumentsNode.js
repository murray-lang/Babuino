CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

function ArgumentsNode(args)
{
    this.nodeType = CompileNodeType.arguments;
    this.resultType = [Types.void];
    this.children = [];

    for (var i = 0; i < arguments.length; i++)
        this.children.push(arguments[i]);
}

function concatArguments(first, second)
{
    if (first === undefined)
        return new ArgumentsNode(second);

    first.children.push(second);

    return first;
}

module.exports.ArgumentsNode  = ArgumentsNode;
module.exports.concatArguments = concatArguments;
