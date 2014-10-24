AssembleNodeType  = require('./NodeType');
LabelNode = require('./LabelNode');

function ProcedureNode(token, stmts)
{
    this.nodeType = AssembleNodeType.procedure;
    this.token    = token;
    this.children = [new LabelNode(token), stmts];
}

module.exports = ProcedureNode;