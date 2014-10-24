var AstTraverser  = require('../../../common/AstTraverser');
var Types         = require('../../../common/Types');
//CompilerNodeType          = require('../../../common/AstNodes/NodeType');
var ImmediateNode = require('../../common/AstNodes/ImmediateNode').ImmediateNode;


function ParseConfigs(formatter)
{
    this.formatter = formatter;
}

ParseConfigs.prototype = new AstTraverser();
ParseConfigs.prototype.constructor = ParseConfigs;

ParseConfigs.prototype.default =
    function (node)
    {
        this.traverseChildren(node);
    };

// Parsing functions are keyed by 'item'
ParseConfigs.prototype.parsers = {};
ParseConfigs.prototype.parsers.serial = {};
ParseConfigs.prototype.parsers.send = {};

ParseConfigs.prototype["config"] =
    function (node)
    {
        if (node.item in this.parsers)
            this.parsers[node.item].parse(node, this.formatter);
    };

ParseConfigs.prototype.parsers.serial.parse =
    function (node, formatter)
    {
            // Serial config requires two children: a port number and a list of
            // param:value pairs (stored as strings in the children of a
            // GenericNode). The port number is already an ImmediateNode and we
            // don't need to touch it.
        if (node.children.length < 2)
        {
            formatter.error(
                false,
                node.token,
                "Serial configuration requires a port number followed by a list of parameters (eg. '[baud:9600]')"
            );
            return;
        }
            // Declare the symbols required for serial configuration
        this.setDefines(node);

            // Parameters will be parsed into this object
        var params = {};
            // Remove the GenericNode with the strings (we are going to replace
            // it)
        var paramsNode = node.children.pop();
        for (var i = 0; i < paramsNode.children.length; i++)
        {
            this.parseSerialParam(node, paramsNode.children[i], params, formatter);
        }
            // Create an immediate 32 bit int for the baud (9600 default)
        var baudNode =  new ImmediateNode([Types.uint32]);

            // Set the new rate if it's given
        if ("baud" in params)
            baudNode.value = parseInt(params["baud"]);
        else
            baudNode.value = 9600;
        node.children.push(baudNode);

            // Create an immediate byte for the parameters
        var paramsVal = "";
        if ("databits" in params)
            paramsVal = "DATABITS_" + params["databits"];
        else
            paramsVal = "DATABITS_8";

        if ("parity" in params)
            paramsVal += " + PARITY_" + params["parity"].toUpperCase();
        else
            paramsVal += " + PARITY_NONE";

        if ("stopbits" in params)
            paramsVal += " + STOPBITS_" + params["stopbits"];
        else
            paramsVal += " + STOPBITS_1";

        var newParamsNode = new ImmediateNode([Types.uint8]);
        newParamsNode.value = paramsVal;
        node.children.push(newParamsNode);
    };

ParseConfigs.prototype.parsers.serial.parseSerialParam =
    function (node, token, params, formatter)
    {
        var paramValuePair = token.value.split(":");
        if (paramValuePair.length == 2)
            params[paramValuePair[0].trim()] = paramValuePair[1];
        else
            formatter.error(false, node.token, "Cannot parse serial parameter '%s'");
    };

ParseConfigs.prototype.parsers.serial.setDefines =
    function(node)
    {
            // Databits, parity and stop bits are packed into a byte as fields
        node.defines =
        {
            "DATABITS_5":  "0x" + (5 << 4).toString(16),
            "DATABITS_6":  "0x" + (6 << 4).toString(16),
            "DATABITS_7":  "0x" + (7 << 4).toString(16),
            "DATABITS_8":  "0x" + (8 << 4).toString(16),
            "PARITY_NONE": "0x" + (0).toString(16),
            "PARITY_ODD":  "0x" + (1 << 2).toString(16),
            "PARITY_EVEN": "0x" + (2 << 2).toString(16),
            "STOPBITS_1":  "0x" + (1).toString(16),
            "STOPBITS_2":  "0x" + (2).toString(16)
        };

    };

ParseConfigs.prototype.parsers.send.parse =
    function (node, formatter)
    {
        // Declare the symbols required for send configuration
        this.setDefines(node);
            // The second (and last) parameter is the abstract port number
        var portNode = node.children.pop();
            // The first parameter is a token containing either
            // "serial" or "ethernet".
        var transportToken = node.children.pop();

            // Push the port node straight back onto the children as-is
        node.children.push(portNode);
            // The transport selection now goes at the end, meaning that it
            // gets emitted last (and pushed last, and popped first in the
            // target code that handles it)
        var transportNode = new ImmediateNode([Types.uint8]);
        if (transportToken.value == "serial")
            transportNode.value = "SEND_SERIAL";
        else if (transportToken.value == "ethernet")
            transportNode.value = "SEND_ETHERNET";
        else
        {
            formatter.error(
                false,
                transportToken,
                "'%s' is not a valid transport for configuration of 'send'. Defaulting to serial.",
                transportToken.value
            );
            transportNode.value = "SEND_SERIAL";
        }
        node.children.push(transportNode);
    };

ParseConfigs.prototype.parsers.send.setDefines =
    function(node)
    {
        // Databits, parity and stop bits are packed into a byte as fields
        node.defines =
        {
            "SEND_SERIAL":   "0",
            "SEND_ETHERNET": "1"
        };

    };


module.exports = ParseConfigs;