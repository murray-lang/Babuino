EvaluateCompileTimeExpressions = require('./traverse/EvaluateCompileTimeExpressions');
FindStringLiterals             = require('./traverse/FindStringLiterals');
FindProcedures                 = require('./traverse/FindProcedures');
UpdateCallResultTypes          = require('./traverse/UpdateCallResultTypes');
SeparateStatementsFromArgs     = require('./traverse/SeparateStatementsFromArgs');
DisambiguateCalls              = require('./traverse/DisambiguateCalls');
ResolveProcedureReturnTypes    = require('./traverse/ResolveProcedureReturnTypes');
FixTypesAndBuildVariableTables = require('./traverse/FixTypesAndBuildVariableTables');

function LogoAstFixups(globals, stringLiterals, procDefs, output, formatter)
{
    this.procedureDefinitions = procDefs;
    this.globalVars           = globals;
    this.stringLiterals       = stringLiterals;
    this.output               = output;
    this.formatter            = formatter;
    this.suppressMessages     = false;

    this.globalCalls = {};
}

LogoAstFixups.prototype.debug =
    function(args)
    {
        if (!this.suppressMessages)
            this.formatter.debug.apply(this.formatter, arguments);
    };

LogoAstFixups.prototype.info =
    function(args)
    {
        if (!this.suppressMessages)
            this.formatter.info.apply(this.formatter, arguments);
    };

LogoAstFixups.prototype.warn =
    function(args)
    {
        if (!this.suppressMessages)
            this.formatter.warn.apply(this.formatter, arguments);
    };

LogoAstFixups.prototype.error =
    function(args)
    {
        if (!this.suppressMessages)
            this.formatter.error.apply(this.formatter, arguments);
    };

LogoAstFixups.prototype.process =
    function (nodes)
    {
        new EvaluateCompileTimeExpressions(this).traverse(nodes);

        new FindStringLiterals(this).traverse(nodes, this.stringLiterals);
        // Gather the procedure definitions so that we can disambiguate
        // procedure calls throughout the AST. 
        new FindProcedures(this).traverse(nodes, this.procedureDefinitions);
            // It's enough at this stage to know whether anything is returned
            // at all, or whether it's void.
        new UpdateCallResultTypes(this).traverse(nodes, this.procedureDefinitions);
        new SeparateStatementsFromArgs(this).traverse(nodes, this.procedureDefinitions, []);
        new DisambiguateCalls(this).traverse(nodes, this.procedureDefinitions, []);

        this.fixTypesAndBuildVariableTable(nodes, this.procedureDefinitions);
    };

LogoAstFixups.prototype.fixTypesAndBuildVariableTable =
    function (node, procDefs)
    {
            // Suppress output messages until the last pass
        this.suppressMessages = true;
        var resolver = new FixTypesAndBuildVariableTables(this);

            // Find and resolve as many global variables as possible first.
        var deeperVars = {};
        resolver.exclusions = { "procedure":  true };
        var varsArray = resolver.traverse(node, procDefs, [this.globalVars], this.globalCalls);
        this.mergeVariables(deeperVars, varsArray);

            // Now traverse the procedures to determine return types
        resolver.exclusions = {};
        resolver.relax = true;
        for (var procName in procDefs)
            resolver.traverse(procDefs[procName], procDefs, [this.globalVars], this.globalCalls);

            // With procedure return types hopefully resolved, try to resolve
            // the globalVars again
        resolver.exclusions = { "procedure":  true, "declaration": true };
        varsArray = resolver.traverse(node, procDefs, [this.globalVars], this.globalCalls);
        this.mergeVariables(deeperVars, varsArray);
            // Allow the messages through now
        this.suppressMessages = false;
             // Now one last time through the procedures with the parameter
            // types established.
        resolver.exclusions = { "declaration": true };
        varsArray = resolver.traverse(node, procDefs, [this.globalVars], this.globalCalls);
        this.mergeVariables(deeperVars, varsArray);
            // Claim the deeper variables (ie. in blocks) as globalVars.
            // (Variables returned here will be global only, as the procedures
            //  will claim any within their blocks as locals and not return
            //  them.)
        for (var varName in deeperVars)
        {
            if (deeperVars[varName].renamed != null)
                continue;

            if (varName in this.globalVars)
            {
                this.error(
                    false,
                    deeperVars[varName].firstToken,
                    "Internal error: Clash of variable name '%s'. Renaming appears to have failed.",
                    varName
                );
                this.error(true, this.globalVars[varName].firstToken, "Outer reference here:");
                return;
            }
            this.globalVars[varName] =  deeperVars[varName];
        }

        resolver.relax = false;
        for (var procName in procDefs)
            resolver.traverse(procDefs[procName], procDefs, [this.globalVars], this.globalCalls);
    };

LogoAstFixups.prototype.mergeVariables =
    function (table, arrayOfTables)
    {
        for (var i = 0; i < arrayOfTables.length; i++)
        {
            for (var varName in arrayOfTables[i])
            {
                if (arrayOfTables[i][varName].renamed != null)
                    continue;

                table[varName] = arrayOfTables[i][varName];
            }
        }
    };

module.exports = LogoAstFixups;
