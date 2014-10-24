AssembleNodeType = require('./NodeType');
LabelNode        = require('./LabelNode')

function DeclarationNode(label, data)
{
    this.nodeType = AssembleNodeType.declaration;
    this.token    = label; // Borrow the label's token
    this.children = [new LabelNode(label), data];
}

DeclarationNode.prototype.getTableInfo =
    function ()
    {
        var label = this.children[0].label;
        var size = 0;
        for (var i = 1; i < this.children.length; i++)
            size += this.children[i].getSize();

        return { label: label, size: size };
    };

module.exports = DeclarationNode;