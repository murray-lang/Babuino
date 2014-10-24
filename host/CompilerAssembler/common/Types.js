
var Types =
	{
		"unknown":	{ code: "",       size: 0, prefix: "?",  toString: function () { return "unknown"; } },
		"void":		{ code: "void",   size: 0, prefix: "",   toString: function () { return "void"; } },
		"int8":		{ code: "int8",   size: 1, prefix: "b",  toString: function () { return "int8"; },
                        isSigned: true },
		"uint8":	{ code: "uint8",  size: 1, prefix: "ub", toString: function () { return "uint8"; },
                        isSigned: false, asSigned: "int8" },
		"int16":	{ code: "int16",  size: 2, prefix: "s",  toString: function () { return "int16"; },
                        isSigned: true },
		"uint16":	{ code: "uint16", size: 2, prefix: "us", toString: function () { return "uint16"; },
                        isSigned: false, asSigned: "int16" },
		"int32":	{ code: "int32",  size: 4, prefix: "i",  toString: function () { return "int32"; },
                        isSigned: true },
		"uint32":	{ code: "uint32", size: 4, prefix: "ui", toString: function () { return "uint32"; },
                        isSigned: false, asSigned: "int32" },
		"float":	{ code: "float",  size: 4, prefix: "f",  toString: function () { return "float"; },
                        isSigned: true },
		"double":	{ code: "double", size: 8, prefix: "d",  toString: function () { return "double"; },
                        isSigned: true },
		"bool":	    { code: "bool",   size: 1, prefix: "q",  toString: function () { return "bool"; } },
        "pointer":  { code: "ptr",    size: 2, prefix: "p",  toString: function () { return "pointer"; }}
	};

Types.array =
	function (n)
	{
		return { code: "array",  size: n, prefix: "a", toString: function () { return "array[" + this.size + "]"; } };
	};

Types.list =
    function (n)
    {
        return { code: "list",  size: n, prefix: "l", toString: function () { return "list[" + this.size + "]"; } };
    };

Types.replaceUnknown =
    function (hasUnknown, replaceUnknownWith)
    {
        if (hasUnknown[hasUnknown.length - 1] == Types.unknown)
        {
            hasUnknown.pop(); // Drop the unknown
                // Add the known type(s) in its place
            hasUnknown.push.apply(hasUnknown, replaceUnknownWith);
        }
    };
	
Types.string =
	function (n)
	{
		return { code: "string",  size: 2, prefix: "str", length: n, toString: function () { return "string(" + this.size + "]"; }  };
	};

Types.prefixes =
    function (type)
    {
        var result = "";
        for (var i = 0; i < type.length; i++)
        {
            result += type[i].prefix;
                // Once you get to a pointer then the the following types are
                // not relevant. A pointer is a pointer.
            if (type[i].code == "ptr")
                break;
        }
        return result;
    };

Types.isNumber =
    function (type)
{
    return type[type.length -1].isSigned !== undefined;
}

Types.equals =
    function (type1, type2)
    {
        if (type1.length != type2.length)
            return false;
        for (var i = 0; i < type1.length; i++)
            if (type1[i].code != type2[i].code)
                return false;
        return true;
    };

Types.harmonise =
    function (args)
    {
        if (arguments.length == 0)
            return null;
            // We can only harmonise base types. If any of the types have any
            // modifiers then abort. Also, we can't harmonise numeric types with
            // non-numeric types. If one is numeric then they all must be.
            // Also, the rest of any higher-order type information must be
            // uniform.
        var numNumeric = 0;

        for (var i = 0; i < arguments.length; i++)
        {
            if (arguments[i].length > 1)
                return null;    // One of the arguments isn't just a base type

                // If any argument is a string then that must be the harmonised
                // type.
                // Don't do this just yet. Returning strings from a function is
                // problematic at the moment.
            //if (arguments[i][0].code == "string")
            //    return arguments[i];

            if (arguments[i][0].isSigned !== undefined)
                numNumeric++;
        }
        if (numNumeric > 0 && numNumeric < arguments.length)
            return null;    // At least one but not all are numeric.

        if (numNumeric == 0)
        {
            // non-numeric types must all be exactly the same
            var baseType = null;
            var rank = 0;
            for (var i = 0; i < arguments.length; i++)
            {
                if (baseType == null)
                    baseType = arguments[i][0];
                else if (arguments[i][0].code != baseType.code)
                    return null;    // Discrepancy!
            }
            return arguments[0]; // Any would do
        }
        else
        {
                // Numeric types are more difficult to harmonise
            var indexOfLargest = -1;    // Obviously can be multiple of the same.
            var anySigned = false;
            for (var i = 0; i < arguments.length; i++)
            {
                if (indexOfLargest == -1 || arguments[i][0].size > arguments[indexOfLargest][0].size)
                    indexOfLargest = i;
                if (arguments[i][0].isSigned)
                    anySigned = true;
            }
                // If there are any signed types, but the largest (that we've
                // grabbed at least) is not signed then we need to get the
                // signed version.
            var largest = arguments[indexOfLargest];
            var result = null;
            if (anySigned && !largest[0].isSigned)
                result = [Types[largest[0].asSigned]];
            else
                result = largest;
            return result;
        }
    };

Types.isUnknown =
    function (type)
    {
        return type[type.length - 1] == Types.unknown;
    };

Types.isVoid =
    function (type)
    {
        return type[0].code == Types.void;
    };

Types.isArray =
    function (type)
    {
        return type[0].code == "array";
    };

Types.isPointer =
    function (type)
    {
        return type[0].code == "ptr";
    };

Types.toPointer =
    function (type)
    {
        return type.unshift(Types.pointer);
    };

Types.fromPointer =
    function (type)
    {
        if (!this.isPointer(type))
            throw new Error("Attempt to remove a pointer modifier from a type that's not a pointer.");
        return type.slice(1, type.length);  // Copy everything but the first element
    };

Types.toString =
    function (type)
    {
        var str = "";
        for (var i = 0; i < type.length ; i++)
        {
            str += type[i].toString();
            if (Types.isArray([type[i]]))
                str += "[" + type[i].size + "]";
            else if (Types.isPointer([type[i]]))
                str = "&" + str;
        }
        return str;
    };

Types.fromName =
    function(name, initial)
    {
        return this.fromSuffix(name.charAt(name.length - 1), initial);
    };

Types.fromSuffix =
    function (suffix, initial)
    {
        if (suffix == null)
            return this.unknown;

        switch (suffix.charAt(0))
        {
        case "%":
            return this.int16;
            break;

        case "&":
            return this.int32;
            break;

        case "!":
            return this.float;
            break;

        case "#":
            return this.double;
            break;

        case "$":
            return this.string(initial !== undefined ? initial : 0); // Set size correctly later
            break;
        }
        return this.unknown;
    };

module.exports = Types;
