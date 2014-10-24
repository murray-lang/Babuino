var Types          = require('../../common/Types');

function replaceUnknownVarType(node, type)
{
    if (node.varType != undefined)
        Types.replaceUnknown(node.varType, type);

    return node;
}

function setReturnValueExpected(callNode, returnValueExpected)
{
    callNode.returnValueExpected = returnValueExpected;
    return callNode;
}

function incrementThings(node)
{
    if (node.things === undefined)
        node.things = 1;
    else
        node.things++;
    return node;
}

module.exports.setReturnValueExpected = setReturnValueExpected;
module.exports.incrementThings        = incrementThings;
module.exports.replaceUnknownVarType  = replaceUnknownVarType;
