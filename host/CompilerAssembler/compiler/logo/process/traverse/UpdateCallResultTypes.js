var Types                = require('../../../../common/Types');
var AstTraverser         = require('../../../../common/AstTraverser');
NodeType                 = require('../../../common/AstNodes/NodeType');

function UpdateCallResultTypes(formatter)
    {
        this.formatter = formatter;
    }
UpdateCallResultTypes.prototype = new AstTraverser();
UpdateCallResultTypes.prototype.constructor = UpdateCallResultTypes;

UpdateCallResultTypes.prototype[NodeType.call] =
    function (node, procDefs)
    {
        if (node.name in procDefs)
        {
            node.resultType = procDefs[node.name].resultType;
            // There will be procedure calls as arguments. Traverse them too.
            this.traverse(node.argsNode, procDefs);
        }
        else
        {
            this.formatter.error(false, node.token, "Call to undefined procedure %s", node.name);
        }
    };

UpdateCallResultTypes.prototype.default =
    function (node, procDefs)
    {
        this.traverseChildren(node, procDefs);
    };

module.exports = UpdateCallResultTypes;