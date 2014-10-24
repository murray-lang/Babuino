function AstTraverser ()
{
    // Some traversals return a value, some don't. Derived objects that
    // return values can place a default value here. Leaving it undefined
    // essentially means void return.
    this.defaultReturnValue = undefined;
        // A table of node types to ignore is placed here.
    this.exclusions = undefined;
}

AstTraverser.prototype.traverse =
    function (args)
    {
        if (arguments[0] === undefined || arguments[0] == null)
            return this.defaultReturnValue;

        if (this.exclusions !== undefined && arguments[0].nodeType in this.exclusions )
            return this.defaultReturnValue;

        if (this[arguments[0].nodeType] !== undefined)
        {
            return this[arguments[0].nodeType].apply(this, arguments);
        }
        else if ("default" in this)
        {
            return this.default.apply(this, arguments);
        }
        return this.defaultReturnValue;
    };

AstTraverser.prototype.traverseChildren =
    function (args)
    {
        if (arguments[0].children != undefined && arguments[0].children != null)
        {
            var childArgs = [null];
            for (var i = 1; i < arguments.length; i++)
                childArgs.push(arguments[i]);

            var childResults = [];
            for (var j = 0; j < arguments[0].children.length; j++)
            {
                childArgs[0] = arguments[0].children[j];
                childResults.push (this.traverse.apply(this, childArgs));
            }

            if (this.combineChildResults !== undefined)
                return this.combineChildResults(childResults);
        }


        return this.defaultReturnValue;
    };

module.exports = AstTraverser;
