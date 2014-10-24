var Scope =
    {
        "unknown":  { toString: function () { return "unknown"; } },
        "global":   { toString: function () { return "global"; } },
        "local":    { toString: function () { return "local"; } },
        "param":    { toString: function () { return "param"; } }
    };

module.exports = Scope;
