ByteCodes = require("./ByteCodes");

var baseCodes = new ByteCodes(95);
baseCodes.initData =
    [
        { asm: "begin", getCode: function ()
        {
            return [0];
        }
        },
        { asm: "byte", getCode: function ()
        {
            return [1];
        }
        },
        { asm: "uint8", getCode: function ()
        {
            return [1];
        }
        },
        { asm: "short", getCode: function ()
        {
            return [2];
        }
        },
        { asm: "int16", getCode: function () /* Synonym for short */
        {
            return [2];
        }
        },
        { asm: "block", getCode: function ()
        {
            return [3];
        }
        },
        { asm: "eob", getCode: function ()
        {
            return [4];
        }
        },
        { asm: "return", getCode: function ()
        {
            return [7];
        }
        },
        { asm: "output", getCode: function ()
        {
            return [8];
        }
        },
        { asm: "repeat", getCode: function ()
        {
            return [9];
        }
        },
        { asm: "if", getCode: function ()
        {
            return [10];
        }
        },
        { asm: "ifelse", getCode: function ()
        {
            return [11];
        }
        },
        { asm: "beep", getCode: function ()
        {
            return [12];
        }
        },
        { asm: "waituntil", getCode: function ()
        {
            return [14];
        }
        },
        { asm: "loop", getCode: function ()
        {
            return [15];
        }
        },
        { asm: "forever", getCode: function ()
        {
            return [15];
        }
        },
        { asm: "wait", getCode: function ()
        {
            return [16];
        }
        },
        { asm: "timer", getCode: function ()
        {
            return [17];
        }
        },
        { asm: "resett", getCode: function ()
        {
            return [18];
        }
        },
        { asm: "send", getCode: function ()
        {
            return [19];
        }
        },
        { asm: "serial", getCode: function ()
        {
            return [20];
        }
        },
        { asm: "newserial", getCode: function ()
        {
            return [21];
        }
        },
        { asm: "random", getCode: function ()
        {
            return [22];
        }
        },
        { asm: "add", getCode: function ()
        {
            return [23];
        }
        },
        { asm: "sub", getCode: function ()
        {
            return [24];
        }
        },
        { asm: "mul", getCode: function ()
        {
            return [25];
        }
        },
        { asm: "div", getCode: function ()
        {
            return [26];
        }
        },
        { asm: "mod", getCode: function ()
        {
            return [27];
        }
        },
        { asm: "eq", getCode: function ()
        {
            return [28];
        }
        },
        { asm: "gt", getCode: function ()
        {
            return [29];
        }
        },
        { asm: "lt", getCode: function ()
        {
            return [30];
        }
        },
        { asm: "and", getCode: function ()
        {
            return [31];
        }
        },
        { asm: "or", getCode: function ()
        {
            return [32];
        }
        },
        { asm: "xor", getCode: function ()
        {
            return [33];
        }
        },
        { asm: "not", getCode: function ()
        {
            return [34];
        }
        },
        { asm: "set", getCode: function ()
        {
            return [35];
        }
        },
        { asm: "get", getCode: function ()
        {
            return [36];
        }
        },
        { asm: "aset", getCode: function ()
        {
            return [37];
        }
        },
        { asm: "aget", getCode: function ()
        {
            return [38];
        }
        },
        { asm: "record", getCode: function ()
        {
            return [39];
        }
        },
        { asm: "recall", getCode: function ()
        {
            return [40];
        }
        },
        { asm: "resetdp", getCode: function ()
        {
            return [41];
        }
        },
        { asm: "setdp", getCode: function ()
        {
            return [42];
        }
        },
        { asm: "erase", getCode: function ()
        {
            return [43];
        }
        },
        { asm: "when", getCode: function ()
        {
            return [44];
        }
        },
        { asm: "whenoff", getCode: function ()
        {
            return [45];
        }
        },
        // Codes 46, 47 and 48 are obsolete motor commands
        { asm: "on", getCode: function ()
        {
            return [49];
        }
        },
        { asm: "onfor", getCode: function ()
        {
            return [50];
        }
        },
        { asm: "off", getCode: function ()
        {
            return [51];
        }
        },
        { asm: "thisway", getCode: function ()
        {
            return [52];
        }
        },
        { asm: "thatway", getCode: function ()
        {
            return [53];
        }
        },
        { asm: "rd", getCode: function ()
        {
            return [54];
        }
        },
        { asm: "setpower", getCode: function ()
        {
            return [59];
        }
        },
        { asm: "brake", getCode: function ()
        {
            return [60];
        }
        },
        { asm: "sensor1", getCode: function ()
        {
            return [55];
        }
        },
        { asm: "sensor2", getCode: function ()
        {
            return [56];
        }
        },
        { asm: "sensor3", getCode: function ()
        {
            return [73];
        }
        },
        { asm: "sensor4", getCode: function ()
        {
            return [74];
        }
        },
        { asm: "sensor5", getCode: function ()
        {
            return [75];
        }
        },
        { asm: "sensor6", getCode: function ()
        {
            return [76];
        }
        },
        { asm: "sensor7", getCode: function ()
        {
            return [77];
        }
        },
        { asm: "sensor8", getCode: function ()
        {
            return [78];
        }
        },

        { asm: "switch1", getCode: function ()
        {
            return [57];
        }
        },
        { asm: "switch2", getCode: function ()
        {
            return [58];
        }
        },
        { asm: "switch3", getCode: function ()
        {
            return [79];
        }
        },
        { asm: "switch4", getCode: function ()
        {
            return [80];
        }
        },
        { asm: "switch5", getCode: function ()
        {
            return [81];
        }
        },
        { asm: "switch6", getCode: function ()
        {
            return [82];
        }
        },
        { asm: "switch7", getCode: function ()
        {
            return [83];
        }
        },
        { asm: "switch8", getCode: function ()
        {
            return [84];
        }
        },
        { asm: "ledon", getCode: function ()
        {
            return [85];
        }
        },
        { asm: "ledoff", getCode: function ()
        {
            return [86];
        }
        },
        { asm: "setsvh", getCode: function ()
        {
            return [87];
        }
        },
        { asm: "svr", getCode: function ()
        {
            return [88];
        }
        },
        { asm: "svl", getCode: function ()
        {
            return [89];
        }
        },
        { asm: "motors", getCode: function ()
            {
                return [90];
            }
        },

        { asm: "i2cstart", getCode: function ()
            {
                return [91];
            }
        },
        { asm: "i2cstop", getCode: function ()
            {
                return [92];
            }
        },

        { asm: "i2ctxrx", getCode: function ()
            {
                return [93];
            }
        },
        { asm: "i2crx", getCode: function ()
            {
                return [94];
            }
        },

        { asm: "i2cerr", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "exit", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "servos", getCode: function (types)
            {
                return types.getNextCode();
            }
        },

        { asm: "error", getCode: function (types)
            {
                return types.getNextCode();
            }
        },

        { asm: "le", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "ge", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "ne", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "dup", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "getport", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "setport", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "ain", getCode: function (types) /* analog input number is provided by the previous short */
        {
            return types.getNextCode();
        }
        },
        { asm: "aout", getCode: function (types) /* analog output number is provided by the previous short */
        {                               /* analog value is provided by the short before that*/
            return types.getNextCode();
        }
        },

        { asm: "din", getCode: function (types) /* digital input number is provided by the previous short */
        {
            return types.getNextCode();
        }
        },
        { asm: "dout", getCode: function (types) /* digital output number is provided by the previous short */
        {                               /* digital value is provided by the short before that*/
            return types.getNextCode();
        }
        },
        { asm: "bitand", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "bitor", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "bitxor", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "bitnot", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "ashift", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "lshift", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "while", getCode: function (types)
        {
            return types.getNextCode();
        }
        },

        { asm: "sendn", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "serialn", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "newserialn", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "randomxy", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "call", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "push", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "pop", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "chkpoint", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "rollback", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "do", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "for", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "foreach", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "repcount", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "goto", getCode: function (types)
        {
            return types.getNextCode();
        }
        },

        { asm: "min", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "max", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "abs", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "neg", getCode: function (types) /* Unary minus (negate) */
        {
            return types.getNextCode();
        }
        },
        { asm: "bool", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "int8", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "uint16", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "int32", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "uint32", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "float", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "double", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "string", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "cptr", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "global", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "local", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "param", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "span", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withint8", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withuint8", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withint16", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withuint16", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withint32", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withuint32", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withfloat", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withdouble", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withbool", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withstring", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withptr", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "withlist", getCode: function (types)
        {
            return types.getNextCode();
        }
        },
        { asm: "tostr", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "ascii", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "strlen", getCode: function (types)
            {
                return types.getNextCode();
            }
        },
        { asm: "btos", getCode: function (types) /* byte to short  */
        {
            return types.getNextCode();
        }
        },
        { asm: "btoi", getCode: function (types) /* byte to int */
        {
            return types.getNextCode();
        }
        },
        { asm: "btof", getCode: function (types) /* byte to float */
        {
            return types.getNextCode();
        }
        },
        { asm: "btod", getCode: function (types) /* byte to double */
        {
            return types.getNextCode();
        }
        },
        { asm: "ubtos", getCode: function (types) /* unsigned byte to short  */
        {
            return types.getNextCode();
        }
        },
        { asm: "ubtoi", getCode: function (types) /* unsigned byte to int */
        {
            return types.getNextCode();
        }
        },
        { asm: "ubtof", getCode: function (types) /* unsigned byte to float */
        {
            return types.getNextCode();
        }
        },
        { asm: "ubtod", getCode: function (types) /* unsigned byte to double */
        {
            return types.getNextCode();
        }
        },
        { asm: "stob", getCode: function (types) /* short to byte (truncate - sign not relevant) */
        {
            return types.getNextCode();
        }
        },
        { asm: "ustob", getCode: function (types) /* short to byte (truncate - sign not relevant) */
        {
            return types.concatCodes("stob");   // same as short since sign bit not seen
        }
        },
        { asm: "stoi", getCode: function (types) /* short to int */
        {
            return types.getNextCode();
        }
        },

        { asm: "ustoi", getCode: function (types) /* unsigned short to int */
        {
            return types.getNextCode();
        }
        },

        { asm: "stof", getCode: function (types) /* short to float */
        {
            return types.getNextCode();
        }
        },

        { asm: "ustof", getCode: function (types) /* unsigned short to float */
        {
            return types.getNextCode();
        }
        },

        { asm: "stod", getCode: function (types) /* short to double */
        {
            return types.getNextCode();
        }
        },

        { asm: "ustod", getCode: function (types) /* unsigned short to double */
        {
            return types.getNextCode();
        }
        },

        { asm: "itob", getCode: function (types) /* int to byte (truncate - sign not relevant) */
        {
            return types.getNextCode();
        }
        },
        { asm: "uitob", getCode: function (types) /* int to byte (truncate - sign not relevant) */
        {
            return types.concatCodes("itob");   // same as signed since sign bit not seen
        }
        },

        { asm: "itos", getCode: function (types) /* int to short (truncate - sign not relevant) */
        {
            return types.getNextCode();
        }
        },
        { asm: "uitos", getCode: function (types) /* uint to short (truncate - sign not relevant) */
        {
            return types.concatCodes("itos");   // same as signed since sign bit not seen
        }
        },
        { asm: "itof", getCode: function (types) /* int to float */
        {
            return types.getNextCode();
        }
        },

        { asm: "uitof", getCode: function (types) /* unsigned int to float */
        {
            return types.getNextCode();
        }
        },

        { asm: "itod", getCode: function (types) /* int to double */
        {
            return types.getNextCode();
        }
        },

        { asm: "uitod", getCode: function (types) /* unsigned int to double */
        {
            return types.getNextCode();
        }
        },

        { asm: "ftob", getCode: function (types) /* float to byte (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "ftos", getCode: function (types) /* float to short (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "ftoi", getCode: function (types) /* float to int (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "ftod", getCode: function (types) /* float to double */
        {
            return types.getNextCode();
        }
        },

        { asm: "dtob", getCode: function (types) /* double to byte (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "dtos", getCode: function (types) /* double to short (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "dtoi", getCode: function (types) /* double to int (truncate) */
        {
            return types.getNextCode();
        }
        },

        { asm: "dtof", getCode: function (types) /* double to float (truncate) */
        {
            return types.getNextCode();
        }
        },
        { asm: "storage", getCode: function (types)
        {
            return [246];
        }
        },
        { asm: "environment", getCode: function (types)
        {
            return [247];
        }
        },
        { asm: "location", getCode: function (types)
        {
            return [248];
        }
        },
        { asm: "math", getCode: function (types)
            {
                return [249];
            }
        },
        { asm: "ui", getCode: function (types)
        {
            return [250];
        }
        },
        { asm: "comms", getCode: function (types)
        {
            return [251];
        }
        },
        { asm: "sync", getCode: function (types)
        {
            return [252];
        }
        },
        { asm: "system", getCode: function (types)
        {
            return [253];
        }
        },
        { asm: "config", getCode: function (types)
        {
            return [254];
        }
        },
        { asm: "invalid", getCode: function (types)
        {
            return [255];
        }
        },
        { asm: "btostr", getCode: function (types)
        {
            return types.concatCodes("withint8", "tostr");
        }
        },
        { asm: "ubtostr", getCode: function (types)
        {
            return types.concatCodes("withuint8", "tostr");
        }
        },
        { asm: "stostr", getCode: function (types)
        {
            return types.concatCodes("withint16", "tostr");
        }
        },
        { asm: "ustostr", getCode: function (types)
        {
            return types.concatCodes("withuint16", "tostr");
        }
        },
        { asm: "itostr", getCode: function (types)
        {
            return types.concatCodes("withint32", "tostr");
        }
        },
        { asm: "uitostr", getCode: function (types)
        {
            return types.concatCodes("withuint32", "tostr");
        }
        },
        { asm: "ftostr", getCode: function (types)
        {
            return types.concatCodes("withfloat", "tostr");
        }
        },
        { asm: "dtostr", getCode: function (types)
        {
            return types.concatCodes("withdouble", "tostr");
        }
        },
        { asm: "qtostr", getCode: function (types)
        {
            return types.concatCodes("withbool", "tostr");
        }
        },
        { asm: "ptostr", getCode: function (types)
        {
            return types.concatCodes("withptr", "tostr");
        }
        },
        { asm: "boutput", getCode: function (types)
        {
            return types.concatCodes("withint8", "output");
        }
        },
        { asm: "uboutput", getCode: function (types)
        {
            return types.concatCodes("withuint8", "output");
        }
        },
        { asm: "soutput", getCode: function (types)
        {
            return types.concatCodes("withint16", "output");
        }
        },
        { asm: "usoutput", getCode: function (types)
        {
            return types.concatCodes("withuint16", "output");
        }
        },
        { asm: "ioutput", getCode: function (types)
        {
            return types.concatCodes("withint32", "output");
        }
        },
        { asm: "uioutput", getCode: function (types)
        {
            return types.concatCodes("withuint32", "output");
        }
        },
        { asm: "foutput", getCode: function (types)
        {
            return types.concatCodes("withfloat", "output");
        }
        },
        { asm: "doutput", getCode: function (types)
        {
            return types.concatCodes("withdouble", "output");
        }
        },
        { asm: "qoutput", getCode: function (types)
        {
            return types.concatCodes("withbool", "output");
        }
        },
        { asm: "poutput", getCode: function (types)
        {
            return types.concatCodes("withptr", "output");
        }
        },
        { asm: "stroutput", getCode: function (types)
            {
                return types.concatCodes("withstring", "output");
            }
        },
//--------------
        { asm: "bforeach", getCode: function (types)
            {
                return types.concatCodes("withint8", "foreach");
            }
        },
        { asm: "ubforeach", getCode: function (types)
            {
                return types.concatCodes("withuint8", "foreach");
            }
        },
        { asm: "sforeach", getCode: function (types)
            {
                return types.concatCodes("withint16", "foreach");
            }
        },
        { asm: "usforeach", getCode: function (types)
            {
                return types.concatCodes("withuint16", "foreach");
            }
        },
        { asm: "iforeach", getCode: function (types)
            {
                return types.concatCodes("withint32", "foreach");
            }
        },
        { asm: "uiforeach", getCode: function (types)
            {
                return types.concatCodes("withuint32", "foreach");
            }
        },
        { asm: "fforeach", getCode: function (types)
            {
                return types.concatCodes("withfloat", "foreach");
            }
        },
        { asm: "dforeach", getCode: function (types)
            {
                return types.concatCodes("withdouble", "foreach");
            }
        },
        { asm: "qforeach", getCode: function (types)
            {
                return types.concatCodes("withbool", "foreach");
            }
        },
        { asm: "pforeach", getCode: function (types)
            {
                return types.concatCodes("withptr", "foreach");
            }
        },
        { asm: "strforeach", getCode: function (types)
            {
                return types.concatCodes("withstring", "foreach");
            }
        },
        { asm: "bsend", getCode: function (types)
        {
            return types.concatCodes("withint8", "send");
        }
        },
        { asm: "ubsend", getCode: function (types)
        {
            return types.concatCodes("withuint8", "send");
        }
        },
        { asm: "ssend", getCode: function (types)
        {
            return types.concatCodes("withint16", "send");
        }
        },
        { asm: "ussend", getCode: function (types)
        {
            return types.concatCodes("withuint16", "send");
        }
        },
        { asm: "isend", getCode: function (types)
        {
            return types.concatCodes("withint32", "send");
        }
        },
        { asm: "uisend", getCode: function (types)
        {
            return types.concatCodes("withuint32", "send");
        }
        },
        { asm: "fsend", getCode: function (types)
        {
            return types.concatCodes("withfloat", "send");
        }
        },
        { asm: "dsend", getCode: function (types)
        {
            return types.concatCodes("withdouble", "send");
        }
        },
        { asm: "qsend", getCode: function (types)
        {
            return types.concatCodes("withbool", "send");
        }
        },
        { asm: "strsend", getCode: function (types)
        {
            return types.concatCodes("withstring", "send");
        }
        },
        { asm: "bsendn", getCode: function (types)
        {
            return types.concatCodes("withint8", "sendn");
        }
        },
        { asm: "ubsendn", getCode: function (types)
        {
            return types.concatCodes("withuint8", "sendn");
        }
        },
        { asm: "ssendn", getCode: function (types)
        {
            return types.concatCodes("withint16", "sendn");
        }
        },
        { asm: "ussendn", getCode: function (types)
        {
            return types.concatCodes("withuint16", "sendn");
        }
        },
        { asm: "isendn", getCode: function (types)
        {
            return types.concatCodes("withint32", "sendn");
        }
        },
        { asm: "uisendn", getCode: function (types)
        {
            return types.concatCodes("withuint32", "sendn");
        }
        },
        { asm: "fsendn", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sendn");
        }
        },
        { asm: "dsendn", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sendn");
        }
        },
        { asm: "qsendn", getCode: function (types)
        {
            return types.concatCodes("withbool", "sendn");
        }
        },
        { asm: "strsendn", getCode: function (types)
        {
            return types.concatCodes("withstring", "sendn");
        }
        },
        { asm: "lsendn", getCode: function (types)
        {
            return types.concatCodes("withlist", "sendn");
        }
        },
        { asm: "bbitand", getCode: function (types)
        {
            return types.concatCodes("withint8", "bitand");
        }
        },
        { asm: "ubbitand", getCode: function (types)
        {
            return types.concatCodes("withuint8", "bitand");
        }
        },
        { asm: "bbitor", getCode: function (types)
        {
            return types.concatCodes("withint8", "bitor");
        }
        },
        { asm: "ubbitor", getCode: function (types)
        {
            return types.concatCodes("withuint8", "bitor");
        }
        },
        { asm: "bbitxor", getCode: function (types)
        {
            return types.concatCodes("withint8", "bitxor");
        }
        },
        { asm: "ubbitxor", getCode: function (types)
        {
            return types.concatCodes("withuint8", "bitxor");
        }
        },
        { asm: "bbitnot", getCode: function (types)
        {
            return types.concatCodes("withint8", "bitnot");
        }
        },
        { asm: "ubbitnot", getCode: function (types)
        {
            return types.concatCodes("withuint8", "bitnot");
        }
        },
        { asm: "bashift", getCode: function (types)
        {
            return types.concatCodes("withint8", "ashift");
        }
        },
        { asm: "ubashift", getCode: function (types)
        {
            return types.concatCodes("withuint8", "ashift");
        }
        },
        { asm: "blshift", getCode: function (types)
        {
            return types.concatCodes("withint8", "lshift");
        }
        },
        { asm: "ublshift", getCode: function (types)
        {
            return types.concatCodes("withuint8", "lshift");
        }
        },
        { asm: "usbitand", getCode: function (types)
        {
            return types.concatCodes("withuint16", "bitand");
        }
        },
        { asm: "usbitor", getCode: function (types)
        {
            return types.concatCodes("withuint16", "bitor");
        }
        },
        { asm: "usbitxor", getCode: function (types)
        {
            return types.concatCodes("withuint16", "bitxor");
        }
        },
        { asm: "usbitnot", getCode: function (types)
        {
            return types.concatCodes("withuint16", "bitnot");
        }
        },
        { asm: "usashift", getCode: function (types)
        {
            return types.concatCodes("withuint16", "ashift");
        }
        },
        { asm: "uslshift", getCode: function (types)
        {
            return types.concatCodes("withuint16", "lshift");
        }
        },
        { asm: "uibitand", getCode: function (types)
        {
            return types.concatCodes("withuint32", "bitand");
        }
        },
        { asm: "uibitor", getCode: function (types)
        {
            return types.concatCodes("withuint32", "bitor");
        }
        },
        { asm: "uibitxor", getCode: function (types)
        {
            return types.concatCodes("withuint32", "bitxor");
        }
        },
        { asm: "uibitnot", getCode: function (types)
        {
            return types.concatCodes("withuint32", "bitnot");
        }
        },
        { asm: "uiashift", getCode: function (types)
        {
            return types.concatCodes("withuint32", "ashift");
        }
        },
        { asm: "uilshift", getCode: function (types)
        {
            return types.concatCodes("withuint32", "lshift");
        }
        },
        { asm: "bset", getCode: function (types)
        {
            return types.concatCodes("withint8", "set");
        }
        },
        { asm: "bget", getCode: function (types)
        {
            return types.concatCodes("withint8", "get");
        }
        },
        { asm: "abset", getCode: function (types)
        {
            // "witharray" not required because we already have an
            // operator that deals with arrays.
            return types.concatCodes("withint8", "aset");
        }
        },
        { asm: "abget", getCode: function (types)
        {
            return types.concatCodes("withint8", "aget");
        }
        },
        { asm: "ubset", getCode: function (types)
        {
            return types.concatCodes("withuint8", "set");
        }
        },
        { asm: "ubget", getCode: function (types)
        {
            return types.concatCodes("withuint8", "get");
        }
        },
        { asm: "aubset", getCode: function (types)
        {
            return types.concatCodes("withuint8", "aset");
        }
        },
        { asm: "aubget", getCode: function (types)
        {
            return types.concatCodes("withuint8", "aget");
        }
        },
        { asm: "sset", getCode: function (types)
        {
            return types.concatCodes("withint16", "set");
        }
        },
        { asm: "sget", getCode: function (types)
        {
            return types.concatCodes("withint16", "get");
        }
        },
        { asm: "asset", getCode: function (types)
        {
            return types.concatCodes("withint16", "aset");
        }
        },
        { asm: "asget", getCode: function (types)
        {
            return types.concatCodes("withint16", "aget");
        }
        },
        { asm: "usset", getCode: function (types)
        {
            return types.concatCodes("withuint16", "set");
        }
        },

        { asm: "usget", getCode: function (types)
        {
            return types.concatCodes("withuint16", "get");
        }
        },
        { asm: "ausset", getCode: function (types)
        {
            return types.concatCodes("withuint16", "aset");
        }
        },
        { asm: "ausget", getCode: function (types)
        {
            return types.concatCodes("withuint16", "aget");
        }
        },
        { asm: "iset", getCode: function (types)
        {
            return types.concatCodes("withint32", "set");
        }
        },
        { asm: "iget", getCode: function (types)
        {
            return types.concatCodes("withint32", "get");
        }
        },
        { asm: "aiset", getCode: function (types)
        {
            return types.concatCodes("withint32", "aset");
        }
        },
        { asm: "aiget", getCode: function (types)
        {
            return types.concatCodes("withint32", "aget");
        }
        },
        { asm: "uiset", getCode: function (types)
        {
            return types.concatCodes("withuint32", "set");
        }
        },
        { asm: "uiget", getCode: function (types)
        {
            return types.concatCodes("withuint32", "get");
        }
        },
        { asm: "auiset", getCode: function (types)
        {
            return types.concatCodes("withuint32", "aset");
        }
        },
        { asm: "auiget", getCode: function (types)
        {
            return types.concatCodes("withuint32", "aget");
        }
        },
        { asm: "fset", getCode: function (types)
        {
            return types.concatCodes("withfloat", "set");
        }
        },
        { asm: "fget", getCode: function (types)
        {
            return types.concatCodes("withfloat", "get");
        }
        },
        { asm: "afset", getCode: function (types)
        {
            return types.concatCodes("withfloat", "aset");
        }
        },
        { asm: "afget", getCode: function (types)
        {
            return types.concatCodes("withfloat", "aget");
        }
        },
        { asm: "dset", getCode: function (types)
        {
            return types.concatCodes("withdouble", "set");
        }
        },
        { asm: "dget", getCode: function (types)
        {
            return types.concatCodes("withdouble", "get");
        }
        },
        { asm: "adset", getCode: function (types)
        {
            return types.concatCodes("withdouble", "aset");
        }
        },
        { asm: "adget", getCode: function (types)
        {
            return types.concatCodes("withdouble", "aget");
        }
        },
        { asm: "pset", getCode: function (types)
        {
            return types.concatCodes("withptr", "set");
        }
        },
        { asm: "pget", getCode: function (types)
        {
            return types.concatCodes("withptr", "get");
        }
        },
        { asm: "apset", getCode: function (types)
        {
            return types.concatCodes("withptr", "aset");
        }
        },
        { asm: "apget", getCode: function (types)
        {
            return types.concatCodes("withptr", "aget");
        }
        },
        { asm: "qset", getCode: function (types)
        {
            return types.concatCodes("withbool", "set");
        }
        },
        { asm: "qget", getCode: function (types)
        {
            return types.concatCodes("withbool", "get");
        }
        },
        { asm: "aqset", getCode: function (types)
        {
            return types.concatCodes("withbool", "aset");
        }
        },
        { asm: "aqget", getCode: function (types)
        {
            return types.concatCodes("withbool", "aget");
        }
        },
        { asm: "strset", getCode: function (types)
        {
            return types.concatCodes("withstring", "set");
        }
        },
        { asm: "strget", getCode: function (types)
        {
            return types.concatCodes("withstring", "get");
        }
        },
        { asm: "qeq", getCode: function (types)
        {
            return types.concatCodes("withbool", "eq");
        }
        },
        { asm: "qne", getCode: function (types)
        {
            return types.concatCodes("withbool", "ne");
        }
        },
        { asm: "badd", getCode: function (types)
        {
            return types.concatCodes("withuint8", "add");
        }
        },
        { asm: "bsub", getCode: function (types)
        {
            return types.concatCodes("withuint8", "sub");
        }
        },
        { asm: "bmul", getCode: function (types)
        {
            return types.concatCodes("withuint8", "mul");
        }
        },
        { asm: "bdiv", getCode: function (types)
        {
            return types.concatCodes("withuint8", "div");
        }
        },
        { asm: "bmod", getCode: function (types)
        {
            return types.concatCodes("withuint8", "mod");
        }
        },
        { asm: "beq", getCode: function (types)
        {
            return types.concatCodes("withuint8", "eq");
        }
        },
        { asm: "bgt", getCode: function (types)
        {
            return types.concatCodes("withuint8", "gt");
        }
        },
        { asm: "blt", getCode: function (types)
        {
            return types.concatCodes("withuint8", "lt");
        }
        },
        { asm: "ble", getCode: function (types)
        {
            return types.concatCodes("withuint8", "le");
        }
        },
        { asm: "bge", getCode: function (types)
        {
            return types.concatCodes("withuint8", "ge");
        }
        },
        { asm: "bne", getCode: function (types)
        {
            return types.concatCodes("withuint8", "ne");
        }
        },
        { asm: "bmin", getCode: function (types)
        {
            return types.concatCodes("withuint8", "min");
        }
        },
        { asm: "bmax", getCode: function (types)
        {
            return types.concatCodes("withuint8", "max");
        }
        },
        { asm: "sadd", getCode: function (types)
        {
            return types.concatCodes("withint16", "add");
        }
        },
        { asm: "ssub", getCode: function (types)
        {
            return types.concatCodes("withint16", "sub");
        }
        },
        { asm: "smul", getCode: function (types)
        {
            return types.concatCodes("withint16", "mul");
        }
        },
        { asm: "sdiv", getCode: function (types)
        {
            return types.concatCodes("withint16", "div");
        }
        },
        { asm: "smod", getCode: function (types)
        {
            return types.concatCodes("withint16", "mod");
        }
        },
        { asm: "seq", getCode: function (types)
        {
            return types.concatCodes("withint16", "eq");
        }
        },
        { asm: "sgt", getCode: function (types)
        {
            return types.concatCodes("withint16", "gt");
        }
        },
        { asm: "slt", getCode: function (types)
        {
            return types.concatCodes("withint16", "lt");
        }
        },
        { asm: "sle", getCode: function (types)
        {
            return types.concatCodes("withint16", "le");
        }
        },
        { asm: "sge", getCode: function (types)
        {
            return types.concatCodes("withint16", "ge");
        }
        },
        { asm: "sne", getCode: function (types)
        {
            return types.concatCodes("withint16", "ne");
        }
        },
        { asm: "smin", getCode: function (types)
        {
            return types.concatCodes("withint16", "min");
        }
        },
        { asm: "smax", getCode: function (types)
        {
            return types.concatCodes("withint16", "max");
        }
        },
        { asm: "sabs", getCode: function (types)
        {
            return types.concatCodes("withint16", "abs");
        }
        },
        { asm: "sneg", getCode: function (types)
        {
            return types.concatCodes("withint16", "neg");
        }
        },
        { asm: "usadd", getCode: function (types)
        {
            return types.concatCodes("withuint16", "add");
        }
        },
        { asm: "ussub", getCode: function (types)
        {
            return types.concatCodes("withuint16", "sub");
        }
        },
        { asm: "usmul", getCode: function (types)
        {
            return types.concatCodes("withuint16", "mul");
        }
        },
        { asm: "usdiv", getCode: function (types)
        {
            return types.concatCodes("withuint16", "div");
        }
        },
        { asm: "usmod", getCode: function (types)
        {
            return types.concatCodes("withuint16", "mod");
        }
        },
        { asm: "useq", getCode: function (types)
        {
            return types.concatCodes("withuint16", "eq");
        }
        },
        { asm: "usgt", getCode: function (types)
        {
            return types.concatCodes("withuint16", "gt");
        }
        },
        { asm: "uslt", getCode: function (types)
        {
            return types.concatCodes("withuint16", "lt");
        }
        },
        { asm: "usle", getCode: function (types)
        {
            return types.concatCodes("withuint16", "le");
        }
        },
        { asm: "usge", getCode: function (types)
        {
            return types.concatCodes("withuint16", "ge");
        }
        },
        { asm: "usne", getCode: function (types)
        {
            return types.concatCodes("withuint16", "ne");
        }
        },
        { asm: "usmin", getCode: function (types)
        {
            return types.concatCodes("withuint16", "min");
        }
        },
        { asm: "usmax", getCode: function (types)
        {
            return types.concatCodes("withuint16", "max");
        }
        },
        { asm: "iadd", getCode: function (types)
        {
            return types.concatCodes("withint32", "add");
        }
        },
        { asm: "isub", getCode: function (types)
        {
            return types.concatCodes("withint32", "sub");
        }
        },
        { asm: "imul", getCode: function (types)
        {
            return types.concatCodes("withint32", "mul");
        }
        },
        { asm: "idiv", getCode: function (types)
        {
            return types.concatCodes("withint32", "div");
        }
        },
        { asm: "imod", getCode: function (types)
        {
            return types.concatCodes("withint32", "mod");
        }
        },
        { asm: "ieq", getCode: function (types)
        {
            return types.concatCodes("withint32", "eq");
        }
        },
        { asm: "igt", getCode: function (types)
        {
            return types.concatCodes("withint32", "gt");
        }
        },
        { asm: "ilt", getCode: function (types)
        {
            return types.concatCodes("withint32", "lt");
        }
        },
        { asm: "ile", getCode: function (types)
        {
            return types.concatCodes("withint32", "le");
        }
        },
        { asm: "ige", getCode: function (types)
        {
            return types.concatCodes("withint32", "ge");
        }
        },
        { asm: "ine", getCode: function (types)
        {
            return types.concatCodes("withint32", "ne");
        }
        },
        { asm: "imin", getCode: function (types)
        {
            return types.concatCodes("withint32", "min");
        }
        },
        { asm: "imax", getCode: function (types)
        {
            return types.concatCodes("withint32", "max");
        }
        },
        { asm: "iabs", getCode: function (types)
        {
            return types.concatCodes("withint32", "abs");
        }
        },
        { asm: "ineg", getCode: function (types)
        {
            return types.concatCodes("withint32", "neg");
        }
        },
        { asm: "uiadd", getCode: function (types)
        {
            return types.concatCodes("withuint32", "add");
        }
        },
        { asm: "uisub", getCode: function (types)
        {
            return types.concatCodes("withuint32", "sub");
        }
        },
        { asm: "uimul", getCode: function (types)
        {
            return types.concatCodes("withuint32", "mul");
        }
        },
        { asm: "uidiv", getCode: function (types)
        {
            return types.concatCodes("withuint32", "div");
        }
        },
        { asm: "uimod", getCode: function (types)
        {
            return types.concatCodes("withuint32", "mod");
        }
        },
        { asm: "uieq", getCode: function (types)
        {
            return types.concatCodes("withuint32", "eq");
        }
        },
        { asm: "uigt", getCode: function (types)
        {
            return types.concatCodes("withuint32", "gt");
        }
        },
        { asm: "uilt", getCode: function (types)
        {
            return types.concatCodes("withuint32", "lt");
        }
        },
        { asm: "uile", getCode: function (types)
        {
            return types.concatCodes("withuint32", "le");
        }
        },
        { asm: "uige", getCode: function (types)
        {
            return types.concatCodes("withuint32", "ge");
        }
        },
        { asm: "uine", getCode: function (types)
        {
            return types.concatCodes("withuint32", "ne");
        }
        },
        { asm: "uimin", getCode: function (types)
        {
            return types.concatCodes("withuint32", "min");
        }
        },
        { asm: "uimax", getCode: function (types)
        {
            return types.concatCodes("withuint32", "max");
        }
        },
        { asm: "fadd", getCode: function (types)
        {
            return types.concatCodes("withfloat", "add");
        }
        },
        { asm: "fsub", getCode: function (types)
        {
            return types.concatCodes("withfloat", "sub");
        }
        },
        { asm: "fmul", getCode: function (types)
        {
            return types.concatCodes("withfloat", "mul");
        }
        },
        { asm: "fdiv", getCode: function (types)
        {
            return types.concatCodes("withfloat", "div");
        }
        },
        { asm: "fmod", getCode: function (types)
        {
            return types.concatCodes("withfloat", "mod");
        }
        },
        { asm: "feq", getCode: function (types)
        {
            return types.concatCodes("withfloat", "eq");
        }
        },
        { asm: "fgt", getCode: function (types)
        {
            return types.concatCodes("withfloat", "gt");
        }
        },
        { asm: "flt", getCode: function (types)
        {
            return types.concatCodes("withfloat", "lt");
        }
        },
        { asm: "fle", getCode: function (types)
        {
            return types.concatCodes("withfloat", "le");
        }
        },
        { asm: "fge", getCode: function (types)
        {
            return types.concatCodes("withfloat", "ge");
        }
        },
        { asm: "fne", getCode: function (types)
        {
            return types.concatCodes("withfloat", "ne");
        }
        },
        { asm: "fmin", getCode: function (types)
        {
            return types.concatCodes("withfloat", "min");
        }
        },
        { asm: "fmax", getCode: function (types)
        {
            return types.concatCodes("withfloat", "max");
        }
        },
        { asm: "fabs", getCode: function (types)
        {
            return types.concatCodes("withfloat", "abs");
        }
        },
        { asm: "fneg", getCode: function (types)
        {
            return types.concatCodes("withfloat", "neg");
        }
        },
        { asm: "dadd", getCode: function (types)
        {
            return types.concatCodes("withdouble", "add");
        }
        },
        { asm: "dsub", getCode: function (types)
        {
            return types.concatCodes("withdouble", "sub");
        }
        },
        { asm: "dmul", getCode: function (types)
        {
            return types.concatCodes("withdouble", "mul");
        }
        },
        { asm: "ddiv", getCode: function (types)
        {
            return types.concatCodes("withdouble", "div");
        }
        },
        { asm: "dmod", getCode: function (types)
        {
            return types.concatCodes("withdouble", "mod");
        }
        },
        { asm: "deq", getCode: function (types)
        {
            return types.concatCodes("withdouble", "eq");
        }
        },
        { asm: "dgt", getCode: function (types)
        {
            return types.concatCodes("withdouble", "gt");
        }
        },
        { asm: "dlt", getCode: function (types)
        {
            return types.concatCodes("withdouble", "lt");
        }
        },
        { asm: "dle", getCode: function (types)
        {
            return types.concatCodes("withdouble", "le");
        }
        },
        { asm: "dge", getCode: function (types)
        {
            return types.concatCodes("withdouble", "ge");
        }
        },
        { asm: "dne", getCode: function (types)
        {
            return types.concatCodes("withdouble", "ne");
        }
        },
        { asm: "dmin", getCode: function (types)
        {
            return types.concatCodes("withdouble", "min");
        }
        },
        { asm: "dmax", getCode: function (types)
        {
            return types.concatCodes("withdouble", "max");
        }
        },
        { asm: "dabs", getCode: function (types)
        {
            return types.concatCodes("withdouble", "abs");
        }
        },
        { asm: "dneg", getCode: function (types)
        {
            return types.concatCodes("withdouble", "neg");
        }
        }

    ];

module.exports = baseCodes;