
function ConfigNode(token, args)
{
    this.nodeType = "config";
    this.token = token;
    this.item = token.value;
    this.children = [];

    for (var i = 1; i < arguments.length; i++)
        this.children.push(arguments[i]);

    /*
    switch (this.item)
    {
    case "digitalin":
    case "digitalout":
    case "analogin":
    case "analogout":
            // These have a GenericNode argument, with the port assignments as
            // that node's children.
        for (var i = 0; i < args.children.length; i++)
            this.parameters.push(args.children[i]);
        break;

    case "send":
            // A single argument, being the default port for send
        this.parameters.push(args);
        break;

    case "serial":
            // In this case the second argument is the port in question and the
            // third argument is a GenericNode containing the serial parameters
            // as its children.
        this.parameters.push(arguments[1]);
       for (var i = 0; i < arguments[2].children.length; i++)
            this.parameters.push(arguments[2].children[i]);
        break;
    }
    */
}

module.exports = ConfigNode;
