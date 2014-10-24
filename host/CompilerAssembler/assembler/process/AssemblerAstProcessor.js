ResolveExpressions = require('./traverse/ResolveExpressions');
GatherDefines      = require('./traverse/GatherDefines');


function AssemblerAstProcessor(formatter)
{
	this.baseAddress   = 0;
    this.formatter = formatter;
}

AssemblerAstProcessor.prototype.process =
    function (ast)
    {
            // firstly, get the '.set' definitions as these might be referred
            // to in expressions.
        var defines = {};
        new GatherDefines(this.formatter).traverse(ast.nodes, defines);
		new ResolveExpressions(this.formatter).traverse(ast.nodes, defines);
        //new ExpandDeclarations().traverse(nodes, { scope: Scope.global });
    };


/*
function ExpandDeclarations()
{

}
ExpandDeclarations.prototype = new AstTraverser();
ExpandDeclarations.prototype.constructor = ExpandDeclarations;

ExpandDeclarations.prototype[ast.NodeType.procedure] =
    function (node, context)
    {
        var saveScope = context.scope;
        context.scope = Scope.local;
        context.currentProc = {};

        this.traverseChildren(node, context);

        delete context.currentProc;
        context.scope = saveScope;
    };

ExpandDeclarations.prototype[ast.NodeType.locals] =
    function (node, context)
    {
        if (context.currentProc === undefined)
            throw new Error("Locals cannot be defined outside of a procedure");

        // This flags that a leave instruction needs to be inserted before each
        // return.
        context.currentProc.hasLocals = true;
        node.enter = new ast.InstructionNode("enter");
        this.traverseChildren(node, context);

    };

ExpandDeclarations.prototype[ast.NodeType.params] =
    function (node, context)
    {
        var saveScope = context.scope;
        context.scope = Scope.param;
        this.traverseChildren(node, context);
        context.scope = saveScope;

    };

ExpandDeclarations.prototype[ast.NodeType.declaration] =
    function (node, context)
    {
        node.scope = context.scope;
        this.traverseChildren(node, context);
    };

ExpandDeclarations.prototype[ast.NodeType.return] =
    function (node, context)
    {
            // If there are local variables then an "enter" instruction was
            // added. This needs to be balanced by a leave instruction to
            // precede every return.
        if (context.currentProc !== undefined)
            if (context.currentProc.hasLocals !== undefined)
                node.leave = new ast.InstructionNode("leave");
    };

ExpandDeclarations.prototype[ast.NodeType.basetype] =
    function (node, context)
    {
        node.scope = context.scope;
        node.expanded = [];
            // Get the equivalent assembler code to push the given type.
        var instruction = ast.TypeMap[node.type].code;
            // Base type declarations can have a list of initialisation
            // values. Create a node for each one.
        for (var i = 0; i < node.children.length; i++)
        {
            var valueNode = new ast.ImmediateNode(node.children[i].value);
            var newNode   = new ast.DataNode(instruction, valueNode);
            node.expanded.push(newNode);
        }

    };

ExpandDeclarations.prototype[ast.NodeType.repeat] =
    function (node, context)
    {
        node.scope = context.scope;
            // The count ExpressionNode had its value calculated earlier.
        var count = node.children[0].value;
        for (var i = 0; i < count; i++)
            this.traverse(node.children[1]);

    };

ExpandDeclarations.prototype.default =
    function (node, context)
    {
        this.traverseChildren(node, context);
    };
*/
module.exports = AssemblerAstProcessor;
