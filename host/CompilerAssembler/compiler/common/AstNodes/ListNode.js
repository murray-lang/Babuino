CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

function ListNode(items, type)
{
    this.nodeType = CompileNodeType.list;
    if (type === undefined)
    {
        this.resultType = [Types.list(items.children.length), Types.unknown];
    }
    else
    {
        this.resultType = [Types.list(items.children.length)].concat(type);
    }
    this.children   = items.children;
}

module.exports = ListNode;