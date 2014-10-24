function GenericNode(children)
{
    this.nodeType = "generic";
    this.children = [];

    for( var i = 0; i < arguments.length; i++ )
        this.children.push( arguments[i] );
}

module.exports = GenericNode;
