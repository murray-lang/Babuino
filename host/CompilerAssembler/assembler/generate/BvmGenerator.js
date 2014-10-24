var AstTraverser = require('../../common/AstTraverser');
var Scope        = require('../../common/Scope');
var bvmCodes     = require('./codes/BvmCodes');
OptimiseDataInitialisation = require('./traverse/OptimiseDataInitialisation');
ResolveSymbolReferences    = require('./traverse/ResolveSymbolReferences');
Assemble                   = require('./traverse/Assemble');

function BvmGenerator (output, formatter)
{
    this.extOutput        = output;
    this.formatter        = formatter;
    this.alignment = 2;
    bvmCodes.init(); // Important to set up the codes table.
}
BvmGenerator.prototype = new AstTraverser();
BvmGenerator.prototype.constructor = BvmGenerator;

BvmGenerator.prototype.generate =
    function (ast)
    {
        this.prepare(ast);

        var context =
            {
                alignment: [this.alignment], // Alignments can be pushed and popped
                globals:   { labels: {}, variables: {}, variablesCursor: 0 },
                procs:     {},
                blocks:    [],  // Blocks are remembered here to match up with eobs
                codes:     []   // Assembled machine codes go here
            };
        new Assemble(this.formatter).traverse(ast.nodes, context, Scope.global);
        new ResolveSymbolReferences(this.formatter).traverse(ast.nodes, context);

        this.output(context.codes);
    };

BvmGenerator.prototype.output =
    function (codes)
    {
        for (var i = 0; i < codes.length; i++)
            this.extOutput(codes[i].toString() + "\n")
    };

BvmGenerator.prototype.prepare =
    function (ast)
    {
        new OptimiseDataInitialisation().traverse(ast.nodes);
    };

module.exports = BvmGenerator;
