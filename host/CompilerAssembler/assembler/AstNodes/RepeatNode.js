AssembleNodeType = require('./NodeType');

function RepeatNode(token, count, children)
{
    this.nodeType = AssembleNodeType.repeat;
    this.token    = token;
    this.children = [count];

    for( var i = 2; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

RepeatNode.prototype.getSize =
    function ()
    {
        var count = this.children[0].value;
        var size = 0;
        for (var i = 0; i < count; i++)
            for (var j = 1; j < this.children.length; j++)
                size += this.children[j].getSize();

        return size;
    };

module.exports = RepeatNode;