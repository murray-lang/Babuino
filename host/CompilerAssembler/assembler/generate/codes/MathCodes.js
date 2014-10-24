ByteCodes = require("./ByteCodes");
baseCodes = require("./BaseCodes");

var mathCodes = new ByteCodes(0, "math", baseCodes);
mathCodes.initData =
    [
        { asm: "pow", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "sqr", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "sqrt", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "exp", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "sin", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "cos", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "tan", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "asin", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "acos", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "atan", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "atan2", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "sinh", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "cosh", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "tanh", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "hypot", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "ln", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "log10", getCode: function (types)
            {
                return types.getNextCode();
            }
        },

        { asm: "rnd", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "trunc", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "floor", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "ceil", getCode: function (types)
            {
                return types.getNextCode();
            }
        },

        { asm: "isnan", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "isinf", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "fpow", getCode: function (types)
        {
            return types.concatCodes("withfloat", "pow");
        }
        },
        { asm: "fsqr", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sqr");
        }
        },
        { asm: "fsqrt", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sqrt");
        }
        },
        { asm: "fexp", getCode: function (types)
        {
            return types.concatCodes("withfloat", "exp");
        }
        },
        { asm: "fsin", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sin");
        }
        },
        { asm: "fcos", getCode: function (types)
        {
            return types.concatCodes("withfloat", "cos");
        }
        },
        { asm: "ftan", getCode: function (types)
        {
            return types.concatCodes("withfloat", "tan");
        }
        },
        { asm: "fasin", getCode: function (types)
        {
            return types.concatCodes("withfloat", "asin");
        }
        },
        { asm: "facos", getCode: function (types)
        {
            return types.concatCodes("withfloat", "acos");
        }
        },
        { asm: "fatan", getCode: function (types)
        {
            return types.concatCodes("withfloat", "atan");
        }
        },
        { asm: "fatan2", getCode: function (types)
        {
            return types.concatCodes("withfloat", "atan2");
        }
        },
        { asm: "fsinh", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sinh");
        }
        },
        { asm: "fcosh", getCode: function (types)
        {
            return types.concatCodes("withfloat", "cosh");
        }
        },
        { asm: "ftanh", getCode: function (types)
        {
            return types.concatCodes("withfloat", "tanh");
        }
        },
        { asm: "fhypot", getCode: function (types)
        {
            return types.concatCodes("withfloat", "hypot");
        }
        },
        { asm: "fln", getCode: function (types)
        {
            return types.concatCodes("withfloat", "ln");
        }
        },
        { asm: "flog10", getCode: function (types)
        {
            return types.concatCodes("withfloat", "log10");
        }
        },
        { asm: "frnd", getCode: function (types)
        {
            return types.concatCodes("withfloat", "rnd");
        }
        },
        { asm: "ftrunc", getCode: function (types)
        {
            return types.concatCodes("withfloat", "trunc");
        }
        },
        { asm: "ffloor", getCode: function (types)
        {
            return types.concatCodes("withfloat", "floor");
        }
        },
        { asm: "fceil", getCode: function (types)
        {
            return types.concatCodes("withfloat", "ceil");
        }
        },
        { asm: "fisnan", getCode: function (types)
        {
            return types.concatCodes("withfloat", "isnan");
        }
        },
        { asm: "fisinf", getCode: function (types)
        {
            return types.concatCodes("withfloat", "isinf");
        }
        },
        { asm: "dpow", getCode: function (types)
        {
            return types.concatCodes("withdouble", "pow");
        }
        },
        { asm: "dsqr", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sqr");
        }
        },
        { asm: "dsqrt", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sqrt");
        }
        },
        { asm: "dexp", getCode: function (types)
        {
            return types.concatCodes("withdouble", "exp");
        }
        },
        { asm: "dsin", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sin");
        }
        },
        { asm: "dcos", getCode: function (types)
        {
            return types.concatCodes("withdouble", "cos");
        }
        },
        { asm: "dtan", getCode: function (types)
        {
            return types.concatCodes("withdouble", "tan");
        }
        },
        { asm: "dasin", getCode: function (types)
        {
            return types.concatCodes("withdouble", "asin");
        }
        },
        { asm: "dacos", getCode: function (types)
        {
            return types.concatCodes("withdouble", "acos");
        }
        },
        { asm: "datan", getCode: function (types)
        {
            return types.concatCodes("withdouble", "atan");
        }
        },
        { asm: "datan2", getCode: function (types)
        {
            return types.concatCodes("withdouble", "atan2");
        }
        },
        { asm: "dsinh", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sinh");
        }
        },
        { asm: "dcosh", getCode: function (types)
        {
            return types.concatCodes("withdouble", "cosh");
        }
        },
        { asm: "dtanh", getCode: function (types)
        {
            return types.concatCodes("withdouble", "tanh");
        }
        },
        { asm: "dhypot", getCode: function (types)
        {
            return types.concatCodes("withdouble", "hypot");
        }
        },
        { asm: "dln", getCode: function (types)
        {
            return types.concatCodes("withdouble", "ln");
        }
        },
        { asm: "dlog10", getCode: function (types)
        {
            return types.concatCodes("withdouble", "log10");
        }
        },
        { asm: "drnd", getCode: function (types)
        {
            return types.concatCodes("withdouble", "rnd");
        }
        },
        { asm: "dtrunc", getCode: function (types)
        {
            return types.concatCodes("withdouble", "trunc");
        }
        },
        { asm: "dfloor", getCode: function (types)
        {
            return types.concatCodes("withdouble", "floor");
        }
        },
        { asm: "dceil", getCode: function (types)
        {
            return types.concatCodes("withdouble", "ceil");
        }
        },
        { asm: "disnan", getCode: function (types)
        {
            return types.concatCodes("withdouble", "isnan");
        }
        },
        { asm: "disinf", getCode: function (types)
        {
            return types.concatCodes("withdouble", "isinf");
        }
        }
    ];

module.exports = mathCodes;