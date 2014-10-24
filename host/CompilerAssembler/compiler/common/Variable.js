function VariableInfo(type, scope)
{
	this.type	    = type;
    this.scope      = scope;
    this.usageCount = 1;
    this.renamed    = null;
    this.firstToken = null;
    this.value      = undefined;    // Initial value
}

/*******************************************************************************
 * Search for the variable name, starting at the innermost scope. If the name is
 * found but it has been renamed, then return the new name.
 ******************************************************************************/
function findVariable(name, varsByScope)
{
    // Search outwards through the scopes for any variables with the same
    // name. Innermost scope is at the end of the array.
    for (var i = varsByScope.length - 1; i >= 0 ; i--)
    {
        // Look for a variable with the same name in this scope
        if (name in varsByScope[i])
        {
            return varsByScope[i][name];
        }
    }
    return null;
}

module.exports.VariableInfo = VariableInfo;
module.exports.findVariable = findVariable;
