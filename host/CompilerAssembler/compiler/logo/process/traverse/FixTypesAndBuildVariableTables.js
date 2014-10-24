var Types                   = require('../../../../common/Types');
var AstTraverser            = require('../../../../common/AstTraverser');
var Scope                   = require('../../../../common/Scope');
CompileNodeType             = require('../../../common/AstNodes/NodeType');
var vars                    = require('../../../common/Variable');
var VariableNodeKind        = require('../../../common/AstNodes/VariableNode').VariableNodeKind;
var VarAssignmentNodeKind   = require('../../../common/AstNodes/VarAssignmentNode').VarAssignmentNodeKind;
var ControlNodeKind         = require('../../../common/AstNodes/ControlNode').ControlNodeKind;
var CommandNodeKind         = require('../../../common/AstNodes/CommandNode').CommandNodeKind;
var ExpressionNodeKind      = require('../../../common/AstNodes/ExpressionNode').ExpressionNodeKind;
var InputNodeKind           = require('../../../common/AstNodes/InputNode').InputNodeKind;
ResolveProcedureReturnTypes = require('./ResolveProcedureReturnTypes');


function FixTypesAndBuildVariableTables(formatter)
{
    this.formatter = formatter;
    this.defaultReturnValue = [];
    // This is set to true if failure is acceptable
    this.relax = false;

    this.procReturnTypeResolver = new ResolveProcedureReturnTypes(formatter);
    this.procReturnTypeResolver.defaultReturnValue = this.defaultReturnValue;
    // Mix our node handlers into ResolveProcedureReturnTypes.
    this.procReturnTypeResolver[CompileNodeType.immediate]  = this[CompileNodeType.immediate].bind(this);
    this.procReturnTypeResolver[CompileNodeType.input]      = this[CompileNodeType.input].bind(this);
    this.procReturnTypeResolver[CompileNodeType.fetch]      = this[CompileNodeType.fetch].bind(this);
    this.procReturnTypeResolver[CompileNodeType.control]    = this[CompileNodeType.control].bind(this);
    this.procReturnTypeResolver[CompileNodeType.block]      = this[CompileNodeType.block].bind(this);
    this.procReturnTypeResolver[CompileNodeType.expression] = this[CompileNodeType.expression].bind(this);
    this.procReturnTypeResolver.mathExpression           = this.mathExpression.bind(this);
    this.procReturnTypeResolver.logicExpression          = this.logicExpression.bind(this);
}
FixTypesAndBuildVariableTables.prototype = new AstTraverser();
FixTypesAndBuildVariableTables.prototype.constructor = FixTypesAndBuildVariableTables;

FixTypesAndBuildVariableTables.prototype.combineChildResults =
    function (childResults)
    {
        var childTables = [];
        for (var i = 0; i < childResults.length; i++)
        {
            if (childResults[i].length > 0)
                childTables.push.apply(childTables, childResults[i]);
        }
        return childTables;
    };

FixTypesAndBuildVariableTables.prototype.default =
    function (node, procDefs, variables, calls, params, typeHint)
    {
        return this.traverseChildren(node, procDefs, variables, calls, params, typeHint);
        /*
         if (node.children === undefined || node.children == null)
         return [];
         var childTables = [];
         for (var i = 0; i < node.children.length; i++)
         {
         childTables = childTables.concat(this.traverse(node.children[i], procDefs, variables, calls, params, typeHint));
         }
         return childTables;
         */
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.immediate] =
    function (node, procDefs, variables, calls, params, typeHint)
    {
        if (typeHint !== undefined && typeHint != null)
        {
            if (Types.isUnknown(node.resultType) || typeHint[typeHint.length - 1].code != "string")
            {
                node.resultType[0] = typeHint[typeHint.length - 1];
            }
        }
        else if (Types.isUnknown(node.resultType))
        {
            if (node.value % 1 === 0) // Is it an integer?
            {
                // Yes. How big? Signed?
                if (node.value >= 32767)
                {
                    node.resultType[0] = Types.int32;
                }
                else
                {
                    node.resultType[0] = Types.int16;
                }
            }
            else
            {
                // Not an integer. Default to float. If double was wanted then
                // it should have been specified with the '#' suffix.
                node.resultType[0] = Types.float;
            }
        }
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.input] =
    function (node, procDefs, variables, calls, params)
    {
        var requiredChildType = [Types.int16];
        switch (node.kind)
        {
        case InputNodeKind.repcount:
            node.resultType = [Types.uint16];
            break;
        case InputNodeKind.slot:
            return [];

        case InputNodeKind.analogin:
            requiredChildType = [Types.int8];
            break;

        case InputNodeKind.digitalin:
            requiredChildType = [Types.int8];
            // Fall through
        case InputNodeKind.newserial:
        case InputNodeKind.switch:
            node.resultType = [Types.bool];
            break;
        case InputNodeKind.i2cerr:
            node.resultType = [Types.uint32];
            break;

        default:
            Types.replaceUnknown(node.resultType, [Types.int16]);
        }
        // Deal with arguments for switch, sensor, analogin, digitalin etc.
        return this.traverseChildren(node, procDefs, variables, calls, params, requiredChildType);
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.variable] =
    function (node, procDefs, variables, calls, params, requiredType, mustAlreadyExist)
    {
        // Firstly see if this is referring to a parameter.
        // If the kind is VariableNodeKind.parameter then this variable
        // represents the actual parameter declaration, so any copying of
        // the type would be self-referential.
        if (node.kind == VariableNodeKind.parameter)
        {
            if (node.suffix != null)
                Types.replaceUnknown(node.type, [Types.fromSuffix(node.suffix)]);
        }
        else if (params !== undefined && (node.name in params))
        {
            // This is a variable refering to a parameter
            node.scope = Scope.param;
            node.valueType = params[node.name].node.resultType;
        }
        else
        {
            var thisScope = params === undefined ? Scope.global : Scope.local;
            var varInfo = vars.findVariable(node.name, variables);
            if (varInfo == null)
            {
                // Doesn't exist yet
                if (mustAlreadyExist)
                    this.formatter.error(false, node.token,  "%s must be declared before use.", node.name);

                if (Types.isUnknown(node.type))
                {
                    if (node.suffix != null)
                        Types.replaceUnknown(node.type, [Types.fromSuffix(node.suffix)]);
                    else if (requiredType !== undefined && requiredType != null)
                        node.valueType = requiredType;
                }
                // This is the first reference to this variable, so create it
                // in the current scope.
                node.scope = thisScope;
                varInfo = new vars.VariableInfo(node.valueType, thisScope);
                varInfo.firstToken = node.token;
                variables[variables.length - 1][node.name] = varInfo;
            }
            else
            {
                // The variable was found. Now see if it has been renamed. If
                // so then change the name in this assignment accordingly.
                if (varInfo.renamed != null)
                {
                    this.formatter.warn(
                        false,
                        node.token,
                        "Variable '%s' was renamed to '%s'. This reference to it will be changed accordingly.",
                        node.name,
                        varInfo.renamed
                    );
                    node.name = varInfo.renamed;
                }
                node.scope = varInfo.scope;
                if (requiredType === undefined || requiredType == null)
                {
                    if (Types.isUnknown(node.type))
                        node.valueType = varInfo.type;
                }
                else
                {
                    // The variable information contains the correct array
                    // dimension(s) because it was gathered from the declaration.
                    // If it also contains the type of the stored data then that
                    // must be honoured (ie. replaceUnknown() does just that).
                    // However, if the data type is still unknown then give it the required type (if available).
                    Types.replaceUnknown(varInfo.type, requiredType);
                    // Now give the variable the whole lot
                    if (Types.isUnknown(node.valueType))
                        node.valueType = varInfo.type;
                }
            }
        }
        return [];
    };

FixTypesAndBuildVariableTables.prototype.setParameterTypesFromCallArgs =
    function (procNode, procDefs, calls)
    {
        if (procNode.numParameters == 0)
            return true;
        // Try the calls in the global code first
        if (procNode.name in calls)
        {
            var callsToNode = calls[procNode.name];
            if (this.setParameterTypes(procNode, callsToNode))
                return true;
        }
        // Couldn't find a call to this procedure in the global code so try
        // looking in other procedures.
        for (var procName in procDefs)
        {
            // No circular references please
            if (procName == procNode.name)
                continue;
            if (procNode.name in procDefs[procName].localCalls)
            {
                // There is a call our procedure in another one
                var callsToNode = procDefs[procName].localCalls[procNode.name];
                if (this.setParameterTypes(procNode, callsToNode))
                    return true;
            }
        }
        return false;
    };

FixTypesAndBuildVariableTables.prototype.setParameterTypes =
    function (procNode, calls)
    {
        var argsToUse = this.chooseArgsToUse(procNode, calls);

        for (var i = 0; i < procNode.numParameters; i++)
        {
            if (Types.isUnknown(procNode.parameters.children[i].resultType))
            {
                if (argsToUse[i] === undefined)
                {
                    this.formatter.error(
                        false,
                        procNode.token,
                        "Unable to find a call to %s with a type resolved for argument %n",
                        procNode.name,
                        i
                    );
                    return false;
                }

                    // If it's a string then throw away the length information
                    // as it will vary with each call.
                if (argsToUse[i].resultType[0].code == "string")
                    procNode.parameters.children[i].resultType = [Types.string(0)];
                else
                    procNode.parameters.children[i].resultType = argsToUse[i].resultType;
            }
        }
        return true;
    };

FixTypesAndBuildVariableTables.prototype.chooseArgsToUse =
    function (procNode, calls)
    {
        var numParams = procNode.numParameters;
        var args = new Array(numParams);
        for (var i = 0; i < numParams; i++)
        {
            for (var j = 0; j < calls.length; j++)
            {
                if (calls[j].argsNode.children.length >= i + 1)
                {
                    if (!Types.isUnknown(calls[j].argsNode.children[i].resultType))
                    {
                        args[i] = calls[j].argsNode.children[i];
                        break;
                    }
                }
            }
        }
        return args;
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.procedure] =
    function (node, procDefs, globals, calls)
    {
        this.setParameterTypesFromCallArgs(node, procDefs, calls);
        this.traverse(node.parameters, procDefs, globals, calls, node.parameterTable);

        var locals = this.traverse(node.children[1], procDefs, globals.concat([node.localVars]),
            node.localCalls, node.parameterTable);
        // Claim the deeper variables (ie. in blocks) as localVars
        for (var i = 0; i < locals.length; i++)
        {
            for (var varName in locals[i])
            {
                if (locals[i][varName].renamed != null)
                    continue;

                if (varName in node.localVars)
                {
                    this.formatter.error(
                        false,
                        locals[i][varName].firstToken,
                        "Internal error: Clash of variable name '%s'. Renaming appears to have failed.",
                        varName
                    );
                    this.formatter.error(true, this.localVars[varName].firstToken, "Outer reference here:");
                    return;
                }
                node.localVars[varName] =  locals[i][varName];
            }
        }
        // fix the procedure return types
        this.procReturnTypeResolver.relax = this.relax;
        this.procReturnTypeResolver.traverse(node, procDefs, globals.concat([node.localVars]), calls);
        // This procedure has claimed all variables created within it.
        // Return none.
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.block] =
    function (node, procDefs, variables, calls, params)
    {
        var blockVariables = {};
        var deeperVars = this.traverse(node.children[0], procDefs, variables.concat([blockVariables]), calls, params);
        return [blockVariables].concat(deeperVars);
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.declaration] =
    function (node, procDefs, variables, calls, params)
    {
        // Traversing children deals with array dimensions
        this.traverseChildren(node, procDefs, variables, calls, params);

        if (Types.isUnknown(node.varType))
            if (node.suffix != null)
                node.varType[node.varType.length - 1] = Types.fromSuffix(node.suffix); // Try to get the type from the suffix.

        // Make sure the name doesn't clash with a parameter name
        if (params !== undefined && node.name in params)
        {
            this.formatter.error(
                false,
                node.nameToken,
                "The variable name '%s' clashes with a parameter name",
                node.name
            );
            return [];
        }

        // A declaration obviously belongs to the current scope, which has
        // its variables in the last of the variable tables.
        var thisScopesVars = variables[variables.length - 1];
        if (node.name in thisScopesVars)
        {
            this.formatter.error(
                false,
                node.nameToken,
                "A variable named '%s' already exists in this scope",
                node.name
            );
            return [];
        }
        var thisScope = params === undefined ? Scope.global : Scope.local;
        // Rename the variable if it clashes with one used in an outer scope
        var newName = this.disambiguateName(node.name, variables);
        thisScopesVars[newName] = new vars.VariableInfo(node.varType, thisScope);
        thisScopesVars[newName].firstToken = node.nameToken;
        if (newName != node.name)
        {
            this.formatter.warn(
                false,
                node.token,
                    "The variable name '%s' clashes with a variable in an outer scope. "
                    + "It has been renamed to '%s' for the target output.",
                node.name,
                newName
            );
            // It was renamed. Add an entry for its given name and mark
            // it as renamed. This will facilitate the correcting of
            // references to the old name.
            var oldVarInfo = new vars.VariableInfo(node.varType, thisScope);
            oldVarInfo.renamed = newName;
            thisScopesVars[node.name] = oldVarInfo;
            node.name = newName;    // Update the node itself
        }

        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.assignment] =
    function (node, procDefs, variables, calls, params)
    {
        // If the variable type is known then try to bend the child result
        // types to that type. Otherwise try to use the child result types
        // to determine the type of the variable.
        if (Types.isUnknown(node.variable.resultType))
        {
            this.traverseChildren(node, procDefs, variables, calls, params);
            var valueType = node.children[0].resultType;
            this.traverse(node.variable, procDefs, variables, calls, params, valueType,
                    node.kind == VarAssignmentNodeKind.aset);
        }
        else
        {
            this.traverse(node.variable, procDefs, variables, calls, params, null,
                    node.kind == VarAssignmentNodeKind.aset);
            var requiredType = node.variable.resultType;
            this.traverse(node.children[0], procDefs, variables, calls, params, requiredType);
        }
            // If the data being assigned is immediate, then set the initial
            // value of the variable table entry if this has not already been
            // done.
        var varInfo = vars.findVariable(node.variable.name, variables);
        if (node.children[0].nodeType == CompileNodeType.immediate)
        {

            if (varInfo != null)
            {
                if (varInfo.value === undefined)
                {
                    varInfo.value = node.children[0].value;
                    node.isInitial = true;
                }
            }
        }
            // If this is a string assignment then check that the length of the
            // value being assigned is known. If not, then we need to issue a
            // warning or an error, depending on whether a variable length is
            // provided or not respectively.
        if (varInfo != null && varInfo.type[0].code == "string")
        {
            var varLength = varInfo.type[0].length;
            var dataType = node.children[0].resultType[0];
            if (dataType.code == "string")
            {
                    // If we have the data length then update the variable
                    // table
                if (dataType.length > varLength)
                {
                    varLength = dataType.length;
                    varInfo.type[0].length = varLength;
                }
                if (dataType.length == 0)
                {
                    var msg = "A string is being assigned a value of unknown length. Ensure that the string is given sufficient size.";
                    if (varLength > 0)
                        this.formatter.warn(false, node.variable.token, msg);
                    else
                        this.formatter.error(false, node.variable.token, msg);
                }
            }
        }
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.call] =
    function (node, procDefs, variables, calls, params)
    {
        // Add this call to the known calls to the same procedure
        if (node.name in calls)
            calls[node.name].push(node);
        else
            calls[node.name] = [node];

        // Traverse arguments to the call
        this.traverse(node.argsNode, procDefs, variables, calls, params, null, true);

        if (Types.isUnknown(node.resultType))
        {
            if (node.name in procDefs)
            {
                node.resultType = procDefs[node.name].resultType;
            }
            else
            {
                this.formatter.error(false, node.token, "Call to undefined procedure %s", node.name);
                node.resultType = [Types.unknown];
                return [];
            }
        }
        if (node.returnValueExpected && node.resultType[0] == Types.void)
        {
            this.formatter.error(
                false,
                node.token,
                "A return value is expected from %s, but it returns no value.",
                node.name
            );
        }

        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.fetch] =
    function (node, procDefs, variables, calls, params)
    {
        this.traverse(node.variable, procDefs, variables, calls, params, null, true);
        this.traverseChildren(node, procDefs, variables, calls, params);
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.control] =
    function (node, procDefs, variables, calls, params)
    {
        var result;
        if (node.kind == ControlNodeKind.foreach)
        {
            var result = [];
            //if (!Types.isUnknown(node.children[0].resultType))
            //    return result;  // Already known

                // Make the base type of the iterator the same as the harmonised
                // type of the list. Firstly traverse the list.
            this.traverse(node.children[1], procDefs, variables, calls, params);

                // If the list now has a type then give it to the iterator
                // variable. (Slice the list resultType because the first
                // element of the type array is 'list')
            if (!Types.isUnknown(node.children[1].resultType))
                Types.replaceUnknown(node.children[0].type, node.children[1].resultType.slice(1));
                // Now traverse the iterator so that it goes into the
                // variable table. This is essentially a variable declaration.
            this.traverse(node.children[0], procDefs, variables, calls, params);
                // Now that the iterator is (hopefully) in the variable table,
                // traverse the  block
            result = this.traverse(node.children[2], procDefs, variables, calls, params);
                // This iterator variable is new, so needs to be returned (the
                // object that holds it in the 'variables' array is dropped later
                // to keep it out of the scope of other blocks at the same depth).
            //var iteratorName = node.children[0].name;
            //result[result.length-1][iteratorName] = variables[variables.length-1][iteratorName];
            return result;
        }
        if (node.kind == ControlNodeKind.output)
        {
            // Procedure output nodes might have previously been harmonised,
            // so if the result type is known then it needs to be honoured
            // so that all return paths return the same type, regardless of
            // the type of the expression.
            // It might be possible to change the expression type now in
            // order to avoid the need for conversion codes in the generated
            // output. This is certainly the case for ImmediateNodes.
            if (Types.isUnknown(node.resultType))
            {
                // Not specified. Take the type of the expression.
                result = this.traverseChildren(node, procDefs, variables, calls, params);
                node.resultType = node.children[0].resultType;
            }
            else
            {
                // Try to bend the expression to the required type
                result = this.traverseChildren(node, procDefs, variables, calls, params, node.resultType);
            }
            return result;
        }
        else
        {
            return this.traverseChildren(node, procDefs, variables, calls, params);
        }
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.command] =
    function (node, procDefs, variables, calls, params)
    {
        switch (node.kind)
        {
        case CommandNodeKind.setpower:
            this.traverse(node.children[0], procDefs, variables, calls, params, [Types.uint8]);
            break;
        case CommandNodeKind.setsvh:
        case CommandNodeKind.svr:
        case CommandNodeKind.svl:
        case CommandNodeKind.setdp:
        case CommandNodeKind.record:
        case CommandNodeKind.erase:
        case CommandNodeKind.onfor:
            this.traverse(node.children[0], procDefs, variables, calls, params, [Types.int16]);
            break;
        case CommandNodeKind.send:
            // Value to send can be any of the basic types. Don't specify a
            // type, but rather allow the generator to choose the variant of
            // the send command to suit the type.
            this.traverse(node.children[0], procDefs, variables, calls, params);

            // If there are more children then there should be three.
            if (node.children.length == 3)
            {
                // In this case the first was a reference to an array.
                // The second is the port number (uint8)
                this.traverse(node.children[1], procDefs, variables, calls, params, [Types.uint8]);
                // The third is the number of items in the array to send (uint8)
                this.traverse(node.children[2], procDefs, variables, calls, params, [Types.uint8]);
            }
            break;

        case CommandNodeKind.digitalout:
            // Output number
            this.traverse(node.children[0], procDefs, variables, calls, params, [Types.uint8]);
            // output value
            this.traverse(node.children[1], procDefs, variables, calls, params, [Types.bool]);
            break;

        case CommandNodeKind.analogout:
            // Output number
            this.traverse(node.children[0], procDefs, variables, calls, params, [Types.uint8]);
            // output value
            this.traverse(node.children[1], procDefs, variables, calls, params, [Types.int16]);
            break;

        case CommandNodeKind.i2c:
            if (node.command == "i2crx")
            {
                // I2C address
                this.traverse(node.children[0], procDefs, variables, calls, params, [Types.uint16]);
                // Rx buffer variable. Should be a bytearray.
                this.traverse(node.children[1], procDefs, variables, calls, params);
                // Rx buffer size. Stick to max 255 I think
                this.traverse(node.children[2], procDefs, variables, calls, params, [Types.uint8]);
                // timeout
                this.traverse(node.children[3], procDefs, variables, calls, params, [Types.uint16]);
            }
            else if (node.command == "i2ctxrx")
            {
                // I2C address
                this.traverse(node.children[0], procDefs, variables, calls, params, [Types.uint16]);
                // Tx buffer variable. Should be a bytearray.
                this.traverse(node.children[1], procDefs, variables, calls, params);
                // Tx buffer size. Stick to max 255 I think
                this.traverse(node.children[2], procDefs, variables, calls, params, [Types.uint8]);
                // Rx buffer variable. Should be a bytearray.
                this.traverse(node.children[3], procDefs, variables, calls, params);
                // Rx buffer size. Stick to max 255 I think
                this.traverse(node.children[4], procDefs, variables, calls, params, [Types.uint8]);
                // timeout
                this.traverse(node.children[5], procDefs, variables, calls, params, [Types.uint16]);
            }
            break;
        }
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.list] =
    function (node, procDefs, variables, calls, params)
    {
        this.traverseChildren(node, procDefs, variables, calls, params);
        if (!Types.isUnknown(node.resultType))
            return [];
        // Determine the resultType for the list as a whole. Items will
        // be cast to this type during code generation.
        // If any of the items is a string then they all must be cast to
        // a string, otherwise adopt the most accurate type.
        var bestType = [Types.unknown];
        for (var i = 0; i < node.children.length; i++)
        {
            var nextType = node.children[i].resultType;
            if (Types.isUnknown(nextType))
                continue;
            if (nextType[0].code == "string")
            {
                bestType = [Types.string(0)]; // Should get away with 0 length
                break;
            }
            // If we don't have a good type yet then just grab the first one
            if (bestType[0] == Types.unknown && !Types.isUnknown(nextType))
            {
                bestType = nextType;
            }
            else
            {
                var harmonised = Types.harmonise(bestType, nextType);
                if (harmonised != null)
                    bestType = harmonised;
            }
        }
        Types.replaceUnknown(node.resultType, bestType);
        return [];
    };

FixTypesAndBuildVariableTables.prototype[CompileNodeType.expression] =
    function (node, procDefs, variables, calls, params, typeHint)
    {
        this.traverseChildren(node, procDefs, variables, calls, params);
        // If one (and only one) of the children is immediate, then
        // just make it the same type as the other. This cuts down
        // on the use of run-time conversion operations.
        // Don't do this for shift and rotate operations, as the rhs
        // for these is always int8.
        if (   node.operator == "ashift"
            || node.operator == "lshift"
            || node.operator == "rotate")
        {
            this.traverse(node.children[0], procDefs, variables, calls, params);
                // rhs is always int8
            this.traverse(node.children[1], procDefs, variables, calls, params, [Types.int8]);
                // The expression result type is always the same as the lhs.
            node.resultType = node.children[0].resultType;
            return [];
        }
        else if (node.children.length > 1)
        {
            this.traverseChildren(node, procDefs, variables, calls, params);
            if (node.children[0].nodeType == CompileNodeType.immediate
                && node.children[1].nodeType != CompileNodeType.immediate)
            {
                // lhs is immediate but rhs is not. If the type of rhs is
                // known then make lhs the same type.
                if (!Types.isUnknown(node.children[1].resultType))
                    node.children[0].resultType  = node.children[1].resultType;
            }
            else if (node.children[1].nodeType == CompileNodeType.immediate
                && node.children[0].nodeType != CompileNodeType.immediate)
            {
                // rhs is immediate but lhs is not. If the type of lhs is
                // known then make rhs the same type.
                if (!Types.isUnknown(node.children[0].resultType))
                    node.children[1].resultType  = node.children[0].resultType;
            }
        }
        else
        {
            this.traverse(node.children[0], procDefs, variables, calls, params);
        }

        if (!Types.isUnknown(node.resultType))
            return [];

        if (node.kind == ExpressionNodeKind.logic)
            return this.logicExpression(node, procDefs, variables, calls, params, typeHint);
        else if (node.kind == ExpressionNodeKind.math)
            return this.mathExpression(node, procDefs, variables, calls, params, typeHint);

        return [];
    };

FixTypesAndBuildVariableTables.prototype.logicExpression =
    function (node)
    {
        node.resultType[0] = Types.bool;
        switch (node.operator)
        {
        case "not":
            if (!Types.isUnknown(node.children[0].resultType))
                if (node.children[0].resultType[0] != Types.bool)
                {
                    this.formatter.error(false, node.children[0].token,
                        "Operand of %s must be boolean", node.token.value);
                    return [];
                }
            break;

        case "and":
        case "or":
        case "xor":
            if (Types.isUnknown(node.children[0].resultType) || Types.isUnknown(node.children[1].resultType))
            {
                // Do nothing. Hopefully a later pass will be able to resolve this.
            }
            else if (node.children[0].resultType[0] != Types.bool)
            {
                this.formatter.error(false, node.children[0].token,
                    "Both operands of %s must be boolean", node.token.value);
                return [];
            }
            else if (node.children[1].resultType[0] != Types.bool)
            {
                this.formatter.error(false, node.children[1].token,
                    "Both operands of %s must be boolean", node.token.value);
                return [];
            }
            break;

        case "eq":
        case "ne":
            if (Types.isUnknown(node.children[0].resultType) || Types.isUnknown(node.children[1].resultType))
            {
                // Do nothing. Hopefully a later pass will be able to resolve this.
            }
            else if (   node.children[0].resultType[0] != Types.bool
                && node.children[0].resultType[0].isSigned === undefined)
            {
                // Left operand not boolean and not a number
                this.formatter.error(false, node.children[0].token,
                    "Both operands of %s must be comparable", node.token.value);
                return [];
            }
            else if (   node.children[1].resultType[0] != Types.bool
                && node.children[1].resultType[0].isSigned === undefined)
            {
                // Left operand not boolean and not a number
                this.formatter.error(false, node.children[1].token,
                    "Both operands of %s must be comparable", node.token.value);
                return [];
            }
            else if (node.children[0].resultType[0] == Types.bool && node.children[1].resultType[0] != Types.bool)
            {
                // Left operand is boolean but the right is not
                this.formatter.error(false, node.children[0].token,
                    "Both operands of %s must be comparable", node.token.value);
                return [];
            }
            else if (node.children[1].resultType[1] == Types.bool && node.children[0].resultType[0] != Types.bool)
            {
                // Right operand is boolean but the left is not
                this.formatter.error(false, node.children[1].token,
                    "Both operands of %s must be comparable", node.token.value);
                return [];
            }
            break;

        default:
            if (Types.isUnknown(node.children[0].resultType) || Types.isUnknown(node.children[1].resultType))
            {
                // Do nothing. Hopefully a later pass will be able to resolve this.
            }
            else if (node.children[0].resultType[0].isSigned === undefined)
            {
                // Left operand is not numeric
                this.formatter.error(false, node.children[0].token,
                    "Both operands of %s must be numeric", node.token.value);
                return [];
            }
            else if (node.children[1].resultType[0].isSigned === undefined)
            {
                // Right operand is not numeric
                this.formatter.error(false, node.children[1].token,
                    "Both operands of %s must be numeric", node.token.value);
                return [];
            }
            else
            {
                var resultType = Types.harmonise(node.children[0].resultType, node.children[1].resultType);
                if (resultType == null)
                {
                    this.formatter.error(
                        false,
                        node.token,
                        "%s and %s cannot be harmonised to a common type for %s",
                        node.children[0].resultType.toString(),
                        node.children[1].resultType.toString(),
                        node.token.token
                    );
                    return [];
                }
            }
            break;
        }
        return [];
    };

FixTypesAndBuildVariableTables.prototype.mathExpression =
    function (node, procDefs, variables, calls, params, typeHint)
    {
        switch (node.operator)
        {
        case "neg":
            if (!Types.isUnknown(node.children[0].resultType))
            {
                // If we're negating a number that's not signed then we
                // need to (try to) promote the result type to avoid underflow.
                var argResultType = node.children[0].resultType[0];
                if (argResultType.isSigned === undefined)
                {
                    this.formatter.error(
                        false,
                        node.children[0].token,
                        "Operand of %s must be numeric",
                        node.token.token
                    );
                    return [];
                }
                else if (argResultType == Types.uint8)
                    node.resultType[0] = Types.int16;
                else if (argResultType == Types.uint16)
                    node.resultType[0] = Types.int32;
                else if (argResultType == Types.uint32)
                    node.resultType[0] = Types.int32; // Can't promote uint32 (so there's a risk of overflow)

            }
            else if (typeHint !== undefined && typeHint != null)
            {

                node.resultType = typeHint;
            }
            break;

        case "abs":
        case "sqr":
        case "sqrt":
        case "exp":
        case "sin":
        case "cos":
        case "tan":
        case "asin":
        case "acos":
        case "atan":
        case "sinh":
        case "cosh":
        case "tanh":
        case "ln":
        case "log10":
            if (typeHint !== undefined && typeHint != null)
            {
                node.resultType = typeHint;
            }
            else if (Types.isUnknown(node.children[0].resultType))
            {
                // Do nothing. Hopefully a later pass will be able to resolve this.
            }
            else if (node.children[0].resultType[0].isSigned === undefined)
            {
                this.formatter.error(
                    false,
                    node.children[0].token,
                    "Operand of %s must be numeric",
                    node.token.token
                );
                return [];
            }
            else if (node.operator == "abs" || node.operator == "sqr")
            {
                // Result type of abs and sqr can always follow the operand.
                node.resultType = node.children[0].resultType;
            }
            else
            {
                // everything else really needs to be floating point
                node.resultType = [Types.float];
            }
            break;

        case "sub":
        case "add":
        case "mul":
        case "div":
        case "mod":
        case "min":
        case "max":
        case "pow":
        case "atan2":
        case "hypot":
            if (typeHint !== undefined && typeHint != null)
            {
                node.resultType = typeHint;
            }
            else if (Types.isUnknown(node.children[0].resultType) || Types.isUnknown(node.children[1].resultType))
            {
                // Do nothing. Hopefully a later pass will be able to resolve this.
            }
            else if (node.children[0].resultType[0].isSigned === undefined)
            {
                // Left operand is not numeric
                this.formatter.error(false, node.children[0].token,
                    "Both operands of %s must be numeric", node.token.value);
                return [];
            }
            else if (node.children[1].resultType[0].isSigned === undefined)
            {
                // Right operand is not numeric
                this.formatter.error(false, node.children[1].token,
                    "Both operands of %s must be numeric", node.token.value);
                return [];
            }
            else
            {
                var harmonised = Types.harmonise(node.children[0].resultType, node.children[1].resultType);
                if (harmonised == null)
                {
                    this.formatter.error(
                        false,
                        node.token,
                        "%s and %s cannot be harmonised to a common type for %s",
                        node.children[0].resultType.toString(),
                        node.children[1].resultType.toString(),
                        node.token.token
                    );
                    return [];
                }
                else
                {
                    node.resultType = harmonised;
                }
            }
            break;
        }
        return [];
    };

/*******************************************************************************
 * Mangle the name of a variable if it clashes with variables in outer scopes.
 *
 * Variables in code blocks (e.g. in if, while, for etc.) can reuse
 * names found in outer scopes. (This isn't standard Logo, but I want the
 * semantic analyser to be able to cope with languages that have this.)
 * The problem is that the back end virtual machine has no such concept - all
 * variables local to a procedure are stored in the same table. So the names
 * of variables in inner scopes need to be mangled if they clash with outer
 * variables.
 * This is complicated by the fact that Logo doesn't require variable
 * declarations. So, if an undeclared variable is used in an inner scope, and
 * a variable with the same name is used in an outer scope, then the two
 * variable are deemed to be one in the same. However, if the inner variable is
 * explicitly declared, then it will be deemed to be separate (and require
 * mangling).
 ******************************************************************************/
FixTypesAndBuildVariableTables.prototype.disambiguateName =
    function (name, varsByScope)
    {
        // Search outwards through the scopes for any variables with the same
        // name. Innermost scope is at the end of the array.
        for (var i = varsByScope.length - 1; i >= 0 ; i--)
        {
            // Look for a variable with the same name in this scope
            if (name in varsByScope[i])
            {
                // Found. If it's been renamed then it also clashed, so we need
                // to look further above for any clash with ours.
                if (varsByScope[i][name].renamed == null)
                {
                    // We have a genuine clash. Bump the kind count of the
                    // outer variable and use that count to mangle our name.
                    var newName = name + varsByScope[i][name].usageCount;
                    varsByScope[i][name].usageCount++;
                    return newName;
                }
            }
        }
        return name;
    };

module.exports = FixTypesAndBuildVariableTables;