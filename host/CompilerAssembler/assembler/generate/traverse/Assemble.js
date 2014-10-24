AstTraverser   = require('../../../common/AstTraverser');
GenericNode    = require('../../../common/GenericNode');
AssembleNodeType       = require('../../AstNodes/NodeType');
TypeMap        = require('../../AstNodes/TypeMap');
ImmediateNode  = require('../../AstNodes/ImmediateNode');
InstructionNode  = require('../../AstNodes/InstructionNode');
DataNode       = require('../../AstNodes/DataNode');
BlockNode      = require('../../AstNodes/BlockNode');
EobNode        = require('../../AstNodes/EobNode');
bvmCodes       = require('../codes/BvmCodes');
Scope          = require('../../../common/Scope');
Types          = require('../../../common/Types');

function Assemble(formatter)
{
    this.formatter      = formatter;
    this.allowAppending = true;
}
Assemble.prototype = new AstTraverser();
Assemble.prototype.constructor = Assemble;

Assemble.prototype.lookupCodes =
    function (token, code)
    {
        var codes = code.split('.');
        if (codes.length == 1)
        {
            if (!(code in bvmCodes.base.codes))
            {
                this.formatter.error(false, token, "There are no codes defined for '%s'", code);
                return [];
            }
            return bvmCodes.base.codes[code];
        }
        else if (codes.length == 2)
        {
            if (!(codes[0] in bvmCodes))
            {
                this.formatter.error(false, token, "Library '%s' not found", codes[0]);
                return [];
            }
            if (!(codes[1] in bvmCodes[codes[0]].codes))
            {
                this.formatter.error(
                    false,
                    token,
                    "There are no codes defined for '%s' in library '%s'",
                    codes[1],
                    codes[0]
                );
                return [];
            }
            return bvmCodes[codes[0]].codes[codes[1]];
        }
    };

Assemble.prototype.appendCodes =
    function (context, codes)
    {
        if (this.allowAppending)
        {
            for (var i = 1; i < arguments.length; i++)
                context.codes.push.apply(context.codes, arguments[i]);
        }
    };

Assemble.prototype.appendSingle =
    function(context, value)
    {
        var view = new DataView(new ArrayBuffer(4), 0);
        view.setFloat32(0, value);
        var result =
                [
                    view.getUint8(0),
                    view.getUint8(1),
                    view.getUint8(2),
                    view.getUint8(3)
                ];
        this.appendCodes(context, result);
    };

Assemble.prototype.appendDouble =
    function(context, value)
    {
        var view = new DataView(new ArrayBuffer(8), 0);
        view.setFloat64(0, value);
        var result =
                [
                    view.getUint8(0),
                    view.getUint8(1),
                    view.getUint8(2),
                    view.getUint8(3),
                    view.getUint8(4),
                    view.getUint8(5),
                    view.getUint8(6),
                    view.getUint8(7)
                ];
        this.appendCodes(context, result);
    };

Assemble.prototype.appendString =
    function(context, value)
    {
        var codes = [];
        for (var i = 0; i < value.length; i++)
        {
            codes.push(value.charCodeAt(i));
        }
        codes.push(0);  // Zero terminated string
        this.appendCodes(context, codes);
    };

Assemble.prototype.default =
    function(node, context, scope)
    {
        if (node.optimised === undefined)
        {
            this.traverseChildren(node, context, scope);
        }
        else
        {
            // Traverse the unoptimised nodes to build symbol and
            // label information, but prevent the codes being appended.
            // Note: this is intended to catch the GenericNode root of
            // the .data section, which was optimised by
            // OptimiseDataInitialisation above. I don't like the
            // secrecy of this and need to make it all more transparent.
            this.allowAppending = false;
            this.traverseChildren(node, context, scope);
            this.allowAppending = true;
            // Now append the optimised codes.
            this.traverse(node.optimised, context, scope);
        }
    };

Assemble.prototype["empty"] =
    function ()
    {
    };

Assemble.prototype[AssembleNodeType.global] =
    function (node)
    {
    };

Assemble.prototype["config"] =
    function (node, context)
    {
        var codes = [];

        switch (node.item)
        {
        case "digitalin":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.din"));
            break;

        case "digitalout":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.dout"));
            break;

        case "analogin":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.ain"));
            break;

        case "analogout":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.aout"));
            break;

        case "send":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.send"));
            break;

        case "serial":
            codes.push.apply(codes, this.lookupCodes(node.token, "config.serial"));
            break;
        }
        if (codes.length > 0)
            this.appendCodes(context, codes);
    };

Assemble.prototype[AssembleNodeType.configs] =
    function (node, context)
    {
        this.traverseChildren(node, context);
    };

Assemble.prototype[AssembleNodeType.procedure] =
    function (node, context)
    {
        node.address = context.codes.length;
        // This tells the children that they are within the context of a
        // procedure.
        context.currentProc = node.children[0].label;
        context.procs[context.currentProc] = { labels: {}, params: undefined, locals: undefined};

        this.traverseChildren(node, context, Scope.local);

        delete context.currentProc;
    };

Assemble.prototype[AssembleNodeType.params] =
    function (node, context)
    {
        node.address = context.codes.length;
        if (context.currentProc === undefined)
        {
            this.formatter.error(false, node.token, "Parameters can only be defined within a procedure");
            return;
        }

        // Parameters add themselves to this in order. Offsets can be
        // subsequently calculated.
        var currProc = context.procs[context.currentProc];
        currProc.params = node.getTable();
    };

Assemble.prototype[AssembleNodeType.locals] =
    function (node, context)
    {
        node.address = context.codes.length;
        if (context.currentProc === undefined)
        {
            this.formatter.error(false, node.token, "Local variables can only be defined within a procedure");
            return;
        }

        var table = node.getTable();
        context.procs[context.currentProc].locals = table;

        if (node.optimised !== undefined)
        {
            this.traverse(node.optimised, context);
        }
        else
        {
            //this.traverse(new InstructionNode("enter"), context);
            this.traverseChildren(node, context);
        }
    };

Assemble.prototype[AssembleNodeType.return] =
    function (node, context)
    {
        node.address = context.codes.length;
        // If there are local variables then a stack frame was created,
        // starting with "enter". In this case the frame needs to be
        // cleaned up by adding a "leave" instruction just before
        // every return.
        /*
         if (context.currentProc !== undefined)
         {
         if (context.procs[context.currentProc].locals !== undefined)
         {
         node.cleanup = new InstructionNode("leave");
         // Now process it like everything else
         this.traverse(node.cleanup, context);
         }
         }
         */
        var codes = this.lookupCodes(node.token, "return");
        this.appendCodes(context, codes);
    };

Assemble.prototype[AssembleNodeType.block] =
    function (node, context)
    {
        node.address = context.codes.length;

        // This will be found by the corresponding eob instruction, which
        // will calculate the length and update the length code that
        // follows this block instruction (using this BlockNode's address
        // and its own address).
        context.blocks.push(node);
        var codes = this.lookupCodes(node.token, "block");
        // Also append a place-holder for the block length (a short)
        this.appendCodes(context, codes, [0, 0]);
    };

Assemble.prototype[AssembleNodeType.eob] =
    function (node, context)
    {
        node.address = context.codes.length;

        if (context.blocks.length == 0)
        {
            this.formatter.error(false, node.token, "An 'eob' instruction does not have a matching 'block' instruction");
            return;
        }

        var blockNode = context.blocks.pop();

        // Calculate the block length and update the length argument of the
        // block node.
        var blockLength = node.address - blockNode.address;
        // (Network byte order - MSB first)
        context.codes[blockNode.address + 1] = (blockLength >> 8) & 0xFF;
        context.codes[blockNode.address + 2] = blockLength & 0xFF;
        // This removes the context member - it doesn't delete the node.

        var codes = this.lookupCodes(node.token, "eob");
        this.appendCodes(context, codes);
    };

Assemble.prototype[AssembleNodeType.data] =
    function (node, context)
    {
        node.address = context.codes.length;

        this.appendCodes(context, this.lookupCodes(node.token, node.instruction));
        var value = node.children[0].value;
        var codes = [];
        switch (node.instruction)
        {
        case "string":
            this.appendString(context, value);
            return;

        case "double":
            this.appendDouble(context, value);
            return;

        case "float":
            this.appendSingle(context, value);
            return;

        case "int32":
        case "uint32":
            codes.push((value >> 24) & 0xFF);
            codes.push((value >> 16) & 0xFF);
            // Fall through!
        case "int16":
        case "uint16":
            codes.push((value >> 8) & 0xFF);
            // Fall through!
        case "span":
        case "int8":
        case "uint8":
        case "bool":
            codes.push(value & 0xFF);
            break;
        }
        this.appendCodes(context, codes);
    };

Assemble.prototype[AssembleNodeType.varptr] =
    function (node, context)
    {
        node.address = context.codes.length;
        this.appendCodes(context, this.lookupCodes(node.token, node.scope), [-1, -1]);
    };

Assemble.prototype[AssembleNodeType.codeptr] =
    function (node, context)
    {
        node.address = context.codes.length;
        this.appendCodes(context, this.lookupCodes(node.token, "cptr"), [-1, -1]);
    };

Assemble.prototype[AssembleNodeType.instruction] =
    function (node, context)
    {
            // Debugging
        if (node.instruction == "output")
        {
            var breakpoint = true;
        }
        node.address = context.codes.length;
        this.appendCodes(context, this.lookupCodes(node.token, node.instruction));
    };

Assemble.prototype[AssembleNodeType.label] =
    function (node, context)
    {
        node.address = context.codes.length;
        // Update the relevant symbol table
        if (context.currentProc === undefined || context.currentProc == node.label)
        {
                // No current procedure, or the label is for the procedure
                // itself.
            context.globals.labels[node.label] = node.address;
        }
        else
        {
            context.procs[context.currentProc].labels[node.label] = node.address;
        }
    };

Assemble.prototype[AssembleNodeType.section] =
    function (node, context)
    {
        node.address = context.codes.length;
    };

Assemble.prototype[AssembleNodeType.declaration] =
    function (node, context, scope)
    {
        node.address = context.codes.length;

        // This node shouldn't be reached in this traversal if the
        // declaration is a parameter, because the handler for parameters
        // doesn't traverse its children.
        // If this declaration is local then it will only be traversed if
        // the LocalsNode detects that there are non-zero initialisation
        // values. Either way, the local variable table will be filled by
        // the LocalsNode and won't need to be touched here

        // 1st child is label. Don't traverse it otherwise it will end up
        // in the global labels table, which is only intended for code
        // addresses.
        var tableInfo = node.getTableInfo();
        if (scope == Scope.global)
        {
            context.globals.variables[tableInfo.label] = context.globals.variablesCursor;
            context.globals.variablesCursor += tableInfo.size;
        }
        if (node.optimised !== undefined)
            this.traverse(node.optimised, context, scope);
        else
            this.traverse(node.children[1], context, scope);
    };

Assemble.prototype[AssembleNodeType.basetype] =
    function (node, context, scope)
    {
        node.address = context.codes.length;

        // Get the equivalent assembler code to push the given type.
        var instruction = TypeMap[node.type].code;
        // Base type declarations can have a list of initialisation
        // values. Create a node for each one.
        var expanded = new GenericNode();
        for (var i = 0; i < node.children.length; i++)
        {
            var valueNode = new ImmediateNode(node.children[i].token);
            var newNode   = new DataNode(
                { token: instruction, value: instruction, offset: node.token.offset },
                valueNode
            );
            expanded.children.push(newNode);
        }
        this.traverse(expanded, context, scope);
    };

Assemble.prototype[AssembleNodeType.repeat] =
    function (node, context, scope)
    {
        node.address = context.codes.length;

        var count = node.children[0].value;
        // Create the nodes for the first part of a repeat loop
        var rept1 = new GenericNode(
            new DataNode(Types.uint8.code, new ImmediateNode(count)),
            new BlockNode()
        );
        // Assemble them
        this.traverse(rept1, context, scope);
        // Now put the data initialisation codes into the repeat loop block.
        for (var i = 1; i < node.children.length; i++)
            this.traverse(node.children[i], context, scope);
        // Close the block and add the repeat instruction
        var rept2 = new GenericNode(
            new EobNode(),
            new InstructionNode("repeat")
        );
        // Assemble that too
        this.traverse(rept2, context, scope);
    };

Assemble.prototype[AssembleNodeType.align] =
    function (node, context)
    {
        node.address = context.codes.length;
    };

Assemble.prototype[AssembleNodeType.end] =
    function (node, context)
    {
        node.address = context.codes.length;
    };

module.exports = Assemble;