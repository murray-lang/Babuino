ByteCodes = require("./ByteCodes");
baseCodes = require("./BaseCodes");

var configCodes = new ByteCodes(0, "config", baseCodes);
configCodes.initData =
    [
        { asm: "din", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "dout", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "ain", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "aout", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "serial", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "send", getCode: function (types)
            {
                return types.getNextCode();
            }
        }
    ];

module.exports = configCodes;