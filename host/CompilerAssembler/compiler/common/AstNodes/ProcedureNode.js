CompileNodeType     = require("./NodeType");
EmptyNode    = require("../../../common/EmptyNode");
GenericNode  = require("../../../common/GenericNode");
var Types    = require("../../../common/Types");

function ProcedureNode(name, type, children)
    {
        this.nodeType       = CompileNodeType.procedure;
        this.resultType     = type;
        this.token          = name;
        this.name           = this.token.value;
        this.children       = [];
        this.localVars      = {};
        this.localCalls     = {};
        this.parameterTable = {};

        for (var i = 2; i < arguments.length; i++)
        {
            if (arguments[i] === undefined)
                this.children.push(new EmptyNode());
            else
                this.children.push(arguments[i]);
        }

        // Don't leave the arguments and statements undefined
        if (this.children.length == 0)
            this.children.push(new GenericNode());
        if (this.children.length == 1)
            this.children.push(new GenericNode());

        Object.defineProperty(this, "parameters",
            {
                get: function()
                {
                    return this.children[0];
                }
            }
        );

        Object.defineProperty(this, "numParameters",
            {
                get: function()
                {
                    if (this.parameters.children === undefined)
                        return 0;
                    return this.parameters.children.length;
                }
            }
        );

        Object.defineProperty(this, "statements",
            {
                get: function()
                {
                    return this.children[1];
                }
            }
        );
        this.findParameters(this.parameterTable);
    }

ProcedureNode.prototype.findParameters =
    function (params)
    {
        for (var i = 0; i < this.numParameters; i++)
            params[this.parameters.children[i].name] =
            {
                "index":  i,
                "node":   this.parameters.children[i]
            };
    };

module.exports = ProcedureNode;