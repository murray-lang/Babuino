var CompileNodeType =
    {
        "variable":     { toString: function () { return "variable"; } },
        "declaration":  { toString: function () { return "declaration"; } },
        "expression":   { toString: function () { return "expression"; } },
        "assignment":   { toString: function () { return "assignment"; } },
        "fetch":        { toString: function () { return "fetch"; } },
        "call":         { toString: function () { return "call"; } },
        "block":        { toString: function () { return "block"; } },
        "command":      { toString: function () { return "command"; } },
        "control":      { toString: function () { return "control"; } },
        "input":        { toString: function () { return "input"; } },
        "immediate":    { toString: function () { return "immediate"; } },
        "procedure":    { toString: function () { return "procedure"; } },
        "motor":        { toString: function () { return "motor"; } },
        "arguments":    { toString: function () { return "arguments"; } },
        "list":         { toString: function () { return "list"; } }
    };

module.exports = CompileNodeType;