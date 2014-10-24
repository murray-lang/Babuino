CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

var VarFetchNodeKind =
    {
        "aget":     { toString: function () { return "aget"; } },
        "variable": { toString: function () { return "variable"; } }
    };

function VarFetchNode(token, variable, kind, type, children)
    {
        this.nodeType = CompileNodeType.fetch;
        if (token == null)
            this.token  = variable.token;
        else
            this.token = token;
        this.variable = variable;
        this.kind     = kind;
        // Merge the type information. If the base type is given to this
        // constructor then it should be reliable, so use it.
        Types.replaceUnknown(this.variable.type, type);

        this.children   = [];
        // The children are subscript values
        for (var i = 4; i < arguments.length; i++)
            this.children.push(arguments[i]);

        Object.defineProperty(this, "resultType",
            {
                get: function()
                {
                    var type = this.variable.resultType;
                    if (this.kind == VarFetchNodeKind.aget)
                        return type.slice(1, type.length);
                    return type;
                }
            }
        );
    }

module.exports.VarFetchNode     = VarFetchNode;
module.exports.VarFetchNodeKind = VarFetchNodeKind;