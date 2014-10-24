CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

function BlockNode(openToken, node, closeToken)
{
    this.nodeType    = CompileNodeType.block;
    this.openToken   = openToken;
    this.closeToken  = closeToken;
    this.resultType  = [Types.unknown];
    this.children    = [node];
}

module.exports = BlockNode;