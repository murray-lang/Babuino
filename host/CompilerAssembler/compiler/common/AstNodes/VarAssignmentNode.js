CompileNodeType     = require("./NodeType");
var Types    = require("../../../common/Types");

var VarAssignmentNodeKind =
    {
        "make":       { toString: function () { return "make"; } },
        "aset":       { toString: function () { return "aset"; } }
    };

function VarAssignmentNode(token, variable, kind, children)
    {
        this.nodeType   = CompileNodeType.assignment;
        this.token      = token;
        // In C (etc.) an assignment also returns a value, in which case the
        // result type will be taken from the variable being assigned to.
        // In Logo (and many other languages) there is no value returned from
        // an assignment.
        this.resultType = [Types.void];
        this.variable   = variable;
        this.kind       = kind;
            // This will be set to true if it is the initial assignment to
            // the variable and so might be made redundant by the
            // initialisation of variables during the handling of data
            // declarations. Otherwise it will be set to false.
            // (There is no harm in leaving it false other than
            // possible redundancy.)
        this.isInitial = false;

        this.children   = [];
        // The third argument (and therefore the first child) is always the
        // value being assigned to this variable. Subsequent arguments (and
        // children) are array subscripts or pointer indicators. Array
        // subscripts work outwards from the value to the outer-most
        // container.

        for( var i = 3; i < arguments.length; i++ )
            this.children.push( arguments[i] );
    }

module.exports.VarAssignmentNode     = VarAssignmentNode;
module.exports.VarAssignmentNodeKind = VarAssignmentNodeKind;