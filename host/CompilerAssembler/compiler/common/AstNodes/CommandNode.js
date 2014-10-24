CompileNodeType     = require("./NodeType");
var Types    = require("../../../common/Types");

var CommandNodeKind =
    {
        "resett":       { toString: function () { return "resett"; } },
        "setsvh":       { toString: function () { return "setsvh"; } },
        "svr":          { toString: function () { return "svr"; } },
        "svl":          { toString: function () { return "svl"; } },
        "resetdp":      { toString: function () { return "resetdp"; } },
        "setdp":        { toString: function () { return "setdp"; } },
        "record":       { toString: function () { return "record"; } },
        "erase":        { toString: function () { return "erase"; } },
        "send":         { toString: function () { return "send"; } },
        "digitalout":   { toString: function () { return "digitalout"; } },
        "analogout":    { toString: function () { return "analogout"; } },
        "ledon":        { toString: function () { return "ledon"; } },
        "ledoff":       { toString: function () { return "ledoff"; } },
        "beep":         { toString: function () { return "beep"; } },
        "i2c":          { toString: function () { return "i2c"; } },
        "on":           { toString: function () { return "on"; } },
        "onfor":        { toString: function () { return "onfor"; } },
        "off":          { toString: function () { return "off"; } },
        "thisway":      { toString: function () { return "thisway"; } },
        "thatway":      { toString: function () { return "thatway"; } },
        "rd":           { toString: function () { return "rd"; } },
        "brake":        { toString: function () { return "brake"; } },
        "setpower":     { toString: function () { return "setpower"; } }
    };

function CommandNode(kind, token, children)
    {
        this.nodeType   = CompileNodeType.command;
        this.token      = token;
        this.resultType = [Types.void];
        this.kind       = kind;
        this.children   = [];

        if (kind == CommandNodeKind.i2c)
            this.command = this.token.value;

        for (var i = 2; i < arguments.length; i++)
            this.children.push(arguments[i]);
    }

module.exports.CommandNode     = CommandNode;
module.exports.CommandNodeKind = CommandNodeKind;