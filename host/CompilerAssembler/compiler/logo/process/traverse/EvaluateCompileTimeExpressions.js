var Types              = require('../../../../common/Types');
var AstTraverser       = require('../../../../common/AstTraverser');
CompileNodeType               = require('../../../common/AstNodes/NodeType');
var ExpressionNodeKind = require('../../../common/AstNodes/ExpressionNode').ExpressionNodeKind;


function EvaluateCompileTimeExpressions(formatter)
    {
        this.formatter = formatter;
    }

EvaluateCompileTimeExpressions.prototype = new AstTraverser();
EvaluateCompileTimeExpressions.prototype.constructor = EvaluateCompileTimeExpressions;

EvaluateCompileTimeExpressions.prototype.default =
    function (node, procDefs, remainders)
    {
        this.traverseChildren(node, procDefs, remainders);
    };

EvaluateCompileTimeExpressions.prototype[CompileNodeType.expression] =
    function (node)
    {
        this.traverseChildren(node);

        if (node.kind == ExpressionNodeKind.math)
            this.evaluateMath(node);
        else if (node.kind == ExpressionNodeKind.logic)
            this.evaluateLogic(node);
    };

EvaluateCompileTimeExpressions.prototype.evaluateLogic =
    function (node)
    {
        node.resultType = [Types.bool];

        if (node.children.length == 1)
        {
            if (node.children[0].nodeType != CompileNodeType.immediate)
                return;
            if (node.children[0].resultType[0] != Types.bool)
            {
                this.formatter.error(
                    false,
                    node.token,
                    "Operand of %s must be boolean",
                    node.token.token,
                    node.value.toString()
                );
                return;
            }
            var value = node.children[0].value;
            switch (node.operator)
            {
            case "not":
                node.value = !value;
                break;

                //case "isnan": // not available in JavaScript
                //case "isinf": // not available in JavaScript

            default:
                return; // Do nothing if we can't process the expression
            }
        }
        else
        {
            if (   node.children[0].nodeType != CompileNodeType.immediate
                || node.children[1].nodeType != CompileNodeType.immediate)
                return;

            var harmonisedType = Types.harmonise(node.children[0].resultType, node.children[1].resultType);
            if (harmonisedType == null)
            {
                this.formatter.error(
                    false,
                    node.token,
                    "%s and %s cannot be harmonised to a common type for %s",
                    node.children[0].resultType.toString(),
                    node.children[1].resultType.toString(),
                    node.token.token
                );
                return;
            }

            var lhs = node.children[0].value;
            var rhs = node.children[1].value;

            switch (node.operator)
            {
            case "or":
            case "and":
            case "xor":
                if (harmonisedType[0] != Types.bool)
                {
                    this.formatter.error(false, node.token, "Both operands of %s must be boolean", node.token.token);
                    return;
                }
                if (node.operator == "or")
                    node.value = lhs || rhs;
                else if (node.operator == "and")
                    node.value = lhs && rhs;
                else
                    node.value = (lhs || rhs) && (lhs != rhs);
                break;
            case "eq":
                node.value = lhs == rhs;
                break;
            case "ne":
                node.value = lhs != rhs;
                break;
            case "lt":
                node.value = lhs < rhs;
                break;
            case "gt":
                node.value = lhs > rhs;
                break;
            case "le":
                node.value = lhs <= rhs;
                break;
            case "ge":
                node.value = lhs >= rhs;
                break;

            default:
                return; // Do nothing if we can't process the expression
            }
        }
        node.nodeType = CompileNodeType.immediate;
        delete node.kind;
        delete node.operator;
        node.children = [];
    };

EvaluateCompileTimeExpressions.prototype.evaluateMath =
    function (node)
    {
        if (node.children.length == 1)
        {
            if (node.children[0].nodeType != CompileNodeType.immediate)
                return;
            if (!Types.isNumber(node.children[0].resultType))
            {
                this.formatter.error(
                    false,
                    node.token,
                    "Operand of %s must be numeric",
                    node.token.token
                );
                return;
            }
            var value = node.children[0].value;
            switch (node.operator)
            {
            case "bitnot":
                node.value      = ~value;
                node.resultType = node.children[0].resultType;
                break;
            case "neg":
                node.value      = -value;
                node.resultType = node.children[0].resultType;
                break;
            case "abs":
                node.value      = Math.abs(value);
                node.resultType = node.children[0].resultType;
                break;
            case "sqr":
                node.value      = Math.pow(value, 2);
                node.resultType = node.children[0].resultType;
                break;
            case "sqrt":
                node.value      = Math.sqrt(value);
                node.resultType = [Types.float];
                break;
            case "exp":
                node.value      = Math.exp(value);
                node.resultType = [Types.float];
                break;
            case "sin":
                node.value      = Math.sin(value);
                node.resultType = [Types.float];
                break;
            case "cos":
                node.value      = Math.cos(value);
                node.resultType = [Types.float];
                break;
            case "tan":
                node.value      = Math.tan(value);
                node.resultType = [Types.float];
                break;
            case "asin":
                node.value      = Math.asin(value);
                node.resultType = [Types.float];
                break;
            case "acos":
                node.value      = Math.acos(value);
                node.resultType = [Types.float];
                break;
            case "atan":
                node.value      = Math.atan(value);
                node.resultType = [Types.float];
                break;
                //case "sinh": // not available in JavaScript
                //case "cosh":
                // case "tanh":
            case "ln":
                node.value      = Math.log(value);
                node.resultType = [Types.float];
                break;
                // case "log10": // not available in JavaScript
            case "ceil":
                node.value      = Math.ceil(value);
                node.resultType = [Types.float];
                break;
            case "floor":
                node.value      = Math.floor(value);
                node.resultType = [Types.float];
                break;
            case "rnd":
                node.value      = Math.round(value);
                node.resultType = [Types.float];
                break;
                // case "trunc": // not available in JavaScript
            default:
                return; // Do nothing if we can't process the expression
            }

        }
        else
        {
            if (   node.children[0].nodeType != CompileNodeType.immediate
                || node.children[1].nodeType != CompileNodeType.immediate)
                return;

            var harmonisedType = Types.harmonise(node.children[0].resultType, node.children[1].resultType);
            if (harmonisedType == null)
            {
                this.formatter.error(
                    false,
                    node.token,
                    "(%s) %s and (%s) %s cannot be harmonised to a common type for %s",
                    node.children[0].resultType.toString(),
                    node.children[0].value.toString(),
                    node.children[1].resultType.toString(),
                    node.children[1].value.toString(),
                    node.token.token
                );
                return;
            }

            var lhs = node.children[0].value;
            var rhs = node.children[1].value;

            switch (node.operator)
            {
            case "sub":
                node.value = lhs - rhs;
                break;
            case "add":
                node.value = lhs + rhs;
                break;
            case "mul":
                node.value = lhs * rhs;
                break;
            case "div":
                node.value = lhs / rhs;
                break;
            case "mod":
                node.value = lhs % rhs;
                break;
            case "min":
                node.value = Math.min(lhs, rhs);
                break;
            case "max":
                node.value = Math.max(lhs, rhs);
                break;
            case "pow":
                node.value = Math.pow(lhs, rhs);
                break;
            case "atan2":
                node.value = Math.atan2(lhs, rhs);
                break;
            case "hypot":
                node.value = Math.sqrt(lhs * rhs);
                break;

            case "bitand":
            case "bitor":
            case "bitxor":
            case "lshift":
            case "rshift":
            case "rotate":
                this.evaluateBitwise(node, lhs, rhs, harmonisedType);
                return;

            default:
                return; // Do nothing if we can't process the expression
            }
            node.resultType = harmonisedType;
        }
        node.nodeType = CompileNodeType.immediate;
        delete node.kind;
        delete node.operator;
        node.children = [];
    };

EvaluateCompileTimeExpressions.prototype.evaluateBitwise =
    function (node, lhs, rhs, type)
    {
        var mask;
        var msbmask;

        switch (type[0])
        {
        case Types.int8:
        case Types.uint8:
            mask    = 0xFF;
            msbmask = 0x80;
            break;
        case Types.int16:
        case Types.uint16:
            mask    = 0xFFFF;
            msbmask = 0x8000;
            break;
        case Types.int32:
        case Types.uint32:
            mask    = 0xFFFFFFFF;
            msbmask = 0x80000000;
            break;
        default:
            this.formatter.error(false, node.token, "Cannot perform bitwise operations on non-integer types");
            return;
        }

        switch (node.operator)
        {
        case "bitand":
            node.value = (lhs & rhs) & mask;
            break;
        case "bitor":
            node.value = (lhs | rhs) & mask;
            break;
        case "bitxor":
            node.value = (lhs ^ rhs) & mask;
            break;
        case "lshift":
            if (rhs > 0)
                lhs = (lhs << rhs) & mask;
            else
                lhs = (lhs >>> rhs) & mask;
            break;
        case "ashift":
            if (rhs > 0)
                lhs = (lhs << rhs) & mask;
            else
                lhs = (lhs >> rhs) & mask;
            break;
        case "rotate":
            for (var i = 0; i < Math.abs(rhs); i++)
            {
                if (rhs > 0)
                {
                    var msb = ((lhs & msbmask) & mask) == 0 ? 0 : 1;
                    lhs = (lhs << 1) + msb;
                }
                else
                {
                    var lsb = (lhs & 1) & mask;
                    lhs = (lhs >>> 1) + (msbmask * lsb);
                }
            }
            break;
        default:
            return;
        }
        node.resultType = type;
        node.nodeType   = CompileNodeType.immediate;
        delete node.kind;
        delete node.operator;
        node.children   = [];
    };

module.exports = EvaluateCompileTimeExpressions;