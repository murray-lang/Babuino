var AstTraverser  = require('../../../common/AstTraverser');
CompileNodeType   = require('../../common/AstNodes/NodeType');

function PrepareforCdecl(formatter)
    {
        this.formatter = formatter;
    }

PrepareforCdecl.prototype = new AstTraverser();
PrepareforCdecl.prototype.constructor = PrepareforCdecl;

PrepareforCdecl.prototype[CompileNodeType.procedure] =
    function (node, cdeclParamsByProc)
    {
        var params = node.parameterTable;
        var cdeclParams = this.prepareParameters(params);

        cdeclParamsByProc[node.name] = cdeclParams;
        // Traverse the statements
        this.traverse(node.children[1], cdeclParamsByProc);

    };

PrepareforCdecl.prototype.default =
    function (node, cdeclParamsByProc)
    {
        this.traverseChildren(node, cdeclParamsByProc);
    };

PrepareforCdecl.prototype.prepareParameters =
    function (params)
    {
        // Firstly put the arguments in sequential order
        var paramsArray = [];
        // Size the array first
        for (var param in params)
            paramsArray.push({});

        //Now that it's the right size we can insert the arguments in order
        for (var param in params)
            paramsArray[params[param].index] = { name: param, resultType: params[param].node.resultType};

        // Now that they are in order we can provide each an offset in terms
        // of the preceding arguments. Its given as a string that can be parsed
        // by the assembler.
        /* Not required
         for (var i = 0; i < paramsArray.length; i++)
         {
         if (i == 0)
         paramsArray[i].offset = "0";
         else if (i == 1)
         paramsArray[i].offset = sizeOf(paramsArray[0].resultType);
         else
         paramsArray[i].offset = paramsArray[i-1].offset + " + " + sizeOf(paramsArray[i-1].resultType);
         }
         */
        // Now that the offsets are calculated, the information can go back
        // into an object/lookup table
        var cdeclParams = { asArray: paramsArray }; // Also keep the array for convenience
        for (var i = 0; i < paramsArray.length; i++)
            cdeclParams[paramsArray[i].name] = paramsArray[i];

        return cdeclParams;
    };

module.exports = PrepareforCdecl;