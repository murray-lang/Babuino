CompileNodeType  = require("./NodeType");
var Scope = require('../../../common/Scope');
var Types = require('../../../common/Types');

var VariableNodeKind =
    {
        "nameof":    { toString: function () { return "nameof"; } },
        "valueof":   { toString: function () { return "valueof"; } },
        "parameter": { toString: function () { return "parameter"; } },
        "iterator":  { toString: function () { return "iterator"; } }
    };

function VariableNode(name, kind, valueType)
{
    this.nodeType    = CompileNodeType.variable;
    this.token       = name;

    this.suffix      = this.token.value.match(/[%!&\*#\$]/);
    if (this.suffix == null)
    {
        this.name = this.token.value;
    }
    else
    {
        this.suffix = this.suffix[0];
        this.name = this.token.value.replace(/[%!&\*#\$]/, "");
    }
    this.kind = kind;
    this.things = this.kind == VariableNodeKind.nameof ? 0 : 1; // Incremented for each "thing" placed before this variable
    var isParam = kind == VariableNodeKind.parameter;
    this.scope = isParam ? Scope.param : Scope.unknown;
    this.type = [Types.pointer];
    if (valueType === undefined)
        this.type.push(Types.unknown);
    else
        this.type.push.apply(this.type, valueType);

    Object.defineProperty(this, "valueType",
        {
            get: function()
            {
                return this.type.slice(1, this.type.length);
            },
            set: function(newType)
            {
                this.type.splice(1, this.type.length - 1);
                this.type.push.apply(this.type, newType);
            }
        }
    );

    Object.defineProperty(this, "resultType",
        {
            get: function()
            {
                if (this.things == 0 || this.type[0] == Types.unknown)
                    return this.type;
                if (this.type.length > 1 && this.type[1] == Types.unknown)
                    return [Types.unknown];
                if (this.things >= this.type.length)
                    throw new Error("Mismatch between 'thing's and 'names' in " + this.name + ".");
                return this.type.slice(this.things, this.type.length);
            },
            set: function(newType)
            {
                this.type.splice(this.things, this.type.length - this.things);
                this.type.push.apply(this.type, newType);
            }
        }
    );
}

module.exports.VariableNode     = VariableNode;
module.exports.VariableNodeKind = VariableNodeKind;