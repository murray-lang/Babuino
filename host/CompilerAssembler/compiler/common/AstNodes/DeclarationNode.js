CompileNodeType  = require("./NodeType");
var Types = require('../../../common/Types');

var DeclarationNodeKind =
{
    "local":    { toString: function () { return "local"; } },
    "array":    { toString: function () { return "array"; } },
    "string":    { toString: function () { return "string"; } }
};

function DeclarationNode(kind, token, varType, name)
{
    this.nodeType    = CompileNodeType.declaration;
    this.token       = token;
    this.nameToken   = name;
    this.resultType  = [Types.void];
    this.kind        = kind;

    this.suffix      = name.value.match(/[%!&\*#\$]/);
    if (this.suffix == null)
    {
        this.name = name.value;
    }
    else
    {
        this.suffix = this.suffix[0];
        this.name = name.value.replace(/[%!&\*#\$]/, "");
    }
    this.varType = varType;
    var typeFromName = Types.fromSuffix(this.suffix);
    if (typeFromName != Types.unknown)
        Types.replaceUnknown(this.varType, [typeFromName]);
}

function createArrayDeclaration(name, size)
{
    var length = parseInt(size.value, 10);
    return new DeclarationNode(DeclarationNodeKind.array, null, [Types.array(length), Types.unknown], name);
}

function createStringDeclaration(name, size)
{
    var length = parseInt(size.value, 10);
    return new DeclarationNode(DeclarationNodeKind.string, null, [Types.string(length)], name);
}

function setDeclarationToken(node, token)
{
    node.token = token;
    return node;
}

module.exports.DeclarationNode         = DeclarationNode;
module.exports.DeclarationNodeKind     = DeclarationNodeKind;
module.exports.createArrayDeclaration  = createArrayDeclaration;
module.exports.createStringDeclaration = createStringDeclaration;
module.exports.setDeclarationToken     = setDeclarationToken;