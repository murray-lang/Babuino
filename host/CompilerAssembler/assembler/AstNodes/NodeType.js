var AssembleNodeType =
    {
        "dot":          { toString: function () { return "dot"; } },
        "set":          { toString: function () { return "set"; } },
        "addrexp":      { toString: function () { return "addrexp"; } },
        "origin":       { toString: function () { return "origin"; } },
        "global":       { toString: function () { return "global"; } },
        "procedure":    { toString: function () { return "procedure"; } },
        "return":       { toString: function () { return "return"; } },
        "block":        { toString: function () { return "block"; } },
        "eob":          { toString: function () { return "eob"; } },
        "data":         { toString: function () { return "data"; } },
        "codeptr":      { toString: function () { return "codeptr"; } },
        "varptr":       { toString: function () { return "varptr"; } },
        "immediate":    { toString: function () { return "immediate"; } },
        "expression":   { toString: function () { return "expression"; } },
        "sizeof":       { toString: function () { return "sizeof"; } },
        "instruction":  { toString: function () { return "instruction"; } },
        "label":        { toString: function () { return "label"; } },
        "section":      { toString: function () { return "section"; } },
        "declaration":  { toString: function () { return "declaration"; } },
        "basetype":     { toString: function () { return "basetype"; } },
        "repeat":       { toString: function () { return "repeat"; } },
        "align":        { toString: function () { return "align"; } },
        "params":       { toString: function () { return "params"; } },
        "locals":       { toString: function () { return "locals"; } },
        "configs":      { toString: function () { return "configs"; } },
        "end":          { toString: function () { return "end"; } }
    };

module.exports = AssembleNodeType;