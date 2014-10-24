/**
 * Created by murray on 14/09/14.
 */
function ByteCodes(newCodeStart, libName, baseCodes)
{
    this.codes = {};
        // If this is not itself the base library, then it should be given a
        // library name and a reference to the base library. The library
        // name should be defined in the base library in order to obtain the
        // this library's code(s).
    this.libName = libName;
    this.baseCodes = baseCodes;
    this.libCodes = undefined;

    this.newCodeStart = newCodeStart === undefined ? 0 : newCodeStart;
    // initData: [ { asm: <code name 1>, getCode: function() { return []; }}, ...]

}

ByteCodes.prototype.init =
    function ()
    {
        if (this.libName !== undefined && this.baseCodes !== undefined)
            this.libCodes = this.baseCodes.codes[this.libName];
        else
            this.libCodes = [];

        this.codes = {};
        this.nextCode = this.newCodeStart;
        for (var i = 0; i < this.initData.length; i++)
            this.codes[this.initData[i].asm] = this.initData[i].getCode(this);
    };

ByteCodes.prototype.getNextCode =
    function ()
    {
        return this.libCodes.concat([this.nextCode++]);
    };

ByteCodes.prototype.concatCodes =
    function(args)
    {
        var result = [];
        for (var i = 0; i < arguments.length; i++)
        {
                // Try this library first then try the base library
            if (arguments[i] in this.codes)
                result.push.apply(result, this.codes[arguments[i]]);
            else if (this.baseCodes !== undefined && arguments[i] in this.baseCodes.codes)
                result.push.apply(result, this.baseCodes.codes[arguments[i]]);
            else
                throw new Error("No codes found for '" + arguments[i] + "'.");
        }
        return result;
    };

module.exports = ByteCodes;