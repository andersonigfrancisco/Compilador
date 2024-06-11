class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.globalScope = new Map();
    this.currentScope = this.globalScope;
    this.scopeStack = [];
    this.generatedCode = '';
  }

  analyze() {
    this.visit(this.ast);
    return this.generatedCode;
  }

  generateExpression(node) {
    switch (node.type) {
      case 'NUMERO':
        return node.value;
      case 'IDENTIFICADOR':
        return node.value;
      case 'binary_expression':
        const left = this.generateExpression(node.left);
        const right = this.generateExpression(node.right);
        return `(${left} ${node.operator} ${right})`;
      default:
        throw new Error(`Unhandled node type: ${node.type}`);
    }
  }

  generateStatement(node) {
    switch (node.type) {
      case 'variable_declaration':
        this.generatedCode += `let ${node.name} = ${this.generateExpression(node.initializer)};\n`;
        break;
      case 'print_statement':
        const args = node.args.map(arg => this.generateExpression(arg)).join(', ');
        this.generatedCode += `console.log(${args});\n`;
        break;
      case 'if_statement':
        const condition = this.generateExpression(node.condition);
        this.generatedCode += `if (${condition}) {\n`;
        node.thenBranch.body.forEach(statement => this.generateStatement(statement));
        this.generatedCode += '} else {\n';
        node.elseBranch.body.forEach(statement => this.generateStatement(statement));
        this.generatedCode += '}\n';
        break;
      case 'return_statement':
        this.generatedCode += `return ${this.generateExpression(node.value)};\n`;
        break;
      default:
        throw new Error(`Unhandled node type: ${node.type}`);
    }
  }

  visit(node) {
    switch (node.type) {
      case 'block':
        this.enterScope();
        node.body.forEach(statement => this.visit(statement));
        this.exitScope();
        break;
    }
  }
}

module.exports = SemanticAnalyzer;
