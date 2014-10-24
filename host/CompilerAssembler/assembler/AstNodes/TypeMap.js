Types = require('../../common/Types');

var TypeMap =
    {
        ".byte":   Types.uint8,
        ".short":  Types.int16,
        ".int":    Types.int32,
        ".long":   Types.int32,   // for now
        ".single": Types.float,
        ".double": Types.double,
        ".ptr":    Types.pointer,
        ".asciz":  Types.string(0)
    };

module.exports = TypeMap;