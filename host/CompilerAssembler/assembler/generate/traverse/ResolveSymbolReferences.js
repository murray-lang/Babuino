AstTraverser     = require('../../../common/AstTraverser');
AssembleNodeType = require('../../AstNodes/NodeType');

function ResolveSymbolReferences(formatter)
{
    this.formatter = formatter;
}

ResolveSymbolReferences.prototype = new AstTraverser();
ResolveSymbolReferences.prototype.constructor = ResolveSymbolReferences;

ResolveSymbolReferences.prototype[AssembleNodeType.procedure] =
    function (node, context)
    {
        context.currentProc = node.children[0].label;

        this.traverseChildren(node, context);

        delete context.currentProc;
    };

ResolveSymbolReferences.prototype[AssembleNodeType.varptr] =
    function (node, context)
    {
        // Look for an address/offset for the symbol
        var addr = -1;
        if (context.currentProc !== undefined )
        {
            var currProc = context.procs[context.currentProc];

            if (currProc.locals !== undefined && (node.symbol in currProc.locals))
            {
                addr = currProc.locals[node.symbol]; // It's a local
            }
            else if (currProc.params !== undefined && (node.symbol in currProc.params))
            {
                addr = currProc.params[node.symbol]; // It's a parameter
            }
        }
        if ((addr == -1) && (node.symbol in context.globals.variables))
        {
            addr = context.globals.variables[node.symbol];
        }
        if (addr == -1)
        {
            this.formatter.error(false, node.token, "Cannot resolve variable '%s'", node.symbol);
            return;
        }

        // Hmmm...not sure whether to make variable addresses a byte value
        // since they are in fact offsets within their scope. (TODO)
        context.codes[node.address + 1] = (addr >> 8) & 0xFF;
        context.codes[node.address + 2] = addr & 0xFF;
    };

ResolveSymbolReferences.prototype[AssembleNodeType.codeptr] =
    function (node, context)
    {
        var addr;
        if (context.currentProc !== undefined)
        {
            if (node.symbol in context.procs[context.currentProc].labels)
                addr = context.procs[context.currentProc].labels[node.symbol];
        }
        if (addr === undefined)
        {
            if (node.symbol in context.globals.labels)
                addr = context.globals.labels[node.symbol];
            else
            {
                this.formatter.error("Unable to resolve label '%s'", node.symbol);
                return;
            }
        }

        context.codes[node.address + 1] = (addr >> 8) & 0xFF;
        context.codes[node.address + 2] = addr & 0xFF;
    };

ResolveSymbolReferences.prototype.default =
    function(node, context)
    {
        this.traverseChildren(node, context);
    };

module.exports = ResolveSymbolReferences;