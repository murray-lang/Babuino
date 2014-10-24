var AST     = require('../common/Ast.js')
var Types   = require('../common/Types');
GenericNode = require('../common/GenericNode');
AssembleNodeType    = require('./AstNodes/NodeType');

function AssemblerAst(formatter)
{
    this.formatter = formatter;
    this.sections =
    {
        "preamble": { origin: 0, align: 1, nodes: new GenericNode() },
        ".data":    { origin: 0, align: 1, nodes: new GenericNode() },
        ".text":    { origin: 0, align: 1, nodes: new GenericNode() }
    };
    this.currentSection = "preamble";

        // Using this node will lead to the sections being traversed in the
        // desired order. (Some processing might however require the
        // sections to be dealt with individually.)
    this.nodes = new GenericNode(
        this.sections.preamble.nodes,
        this.sections[".data"].nodes,
        this.sections[".text"].nodes
       );

    Object.defineProperty(this, "preamble",
        {
            get: function()
            {
                return this.nodes.children[0];
            }
        }
    );
    Object.defineProperty(this, "data",
        {
            get: function()
            {
                return this.nodes.children[1];
            }
        }
    );
    Object.defineProperty(this, "text",
        {
            get: function()
            {
                return this.nodes.children[2];
            }
        }
    );
}
AssemblerAst.prototype = new AST.AbstractSyntaxTree();
AssemblerAst.prototype.constructor = AssemblerAst;

AssemblerAst.prototype.init =
    function ()
    {
        for (var section in this.sections)
        {
            delete this.sections[section].nodes;
            this.sections[section].nodes = new GenericNode();
        }
        delete this.nodes;
        this.nodes = new GenericNode(
            this.sections.preamble.nodes,
            this.sections[".data"].nodes,
            this.sections[".text"].nodes
        );
    };

AssemblerAst.prototype.setFormatter =
    function (formatter)
    {
        this.formatter = formatter;
    };

AssemblerAst.prototype.appendNode =
    function (node)
    {
        if (node.nodeType == AssembleNodeType.section)
        {
            if (!(node.section in this.sections))
            {
                this.formatter.error(
                    false,
                    node.token,
                    "Custom sections such as '%s' are not supported",
                    node.section
                );
                return;
            }
            node.parent = this.sections[node.section].nodes;
            this.currentSection = node.section;
        }
        else if (node.nodeType == AssembleNodeType.align)
        {
            this.sections[this.currentSection].align = node.value;
        }

        this.appendToCurrentSection(node);
    };

AssemblerAst.prototype.appendToCurrentSection =
    function (node)
    {
        this.sections[this.currentSection].nodes.children.push(node);
    };

module.exports = AssemblerAst;





