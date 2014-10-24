baseCodes   = require("./BaseCodes");
mathCodes   = require("./MathCodes");
configCodes = require("./ConfigCodes");

var bvmCodes =
    {
        base:   baseCodes,
        config: configCodes,
        math:   mathCodes,

        init: function ()
                {
                        // Initialise the base library first, as its codes could
                        // be used by the other libraries.
                    this.base.init();
                    for (var libName in this)
                    {
                        if (libName != "base")  // Already done
                            this[libName].init();
                    }
                }
    };

    // Prevent the init function being enumerated as a library
Object.defineProperty(bvmCodes, "init", { enumerable: false});

module.exports = bvmCodes;
