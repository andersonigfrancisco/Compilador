class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.globalScope = new Map();
    this.currentScope = this.globalScope;
    this.scopeStack = [];
  }

  analyze() {
    this.visit(this.ast);
  }

  enterScope() {
    this.scopeStack.push(this.currentScope);
    this.currentScope = new Map();
  }

  exitScope() {
    this.currentScope = this.scopeStack.pop();
  }

  visit(node) {
    switch (node.type) {
      case 'program':
        node.body.forEach(statement => this.visit(statement));
        break;
      case 'function_declaration':
        this.visitFunctionDeclaration(node);
        break;
      case 'variable_declaration':
        this.visitVariableDeclaration(node);
        break;
      case 'block':
        this.visitBlock(node);
        break;
      case 'if_statement':
        this.visitIfStatement(node);
        break;
      case 'return_statement':
        this.visitReturnStatement(node);
        break;
      case 'print_statement':
        this.visitPrintStatement(node);
        break;
      case 'binary_expression':
        this.visitBinaryExpression(node);
        break;
      case 'assignment':
        this.visitAssignment(node);
        break;
      case 'identifier':
        this.visitIdentifier(node);
        break;
      case 'number':
        this.visitNumber(node);
        break;
      default:
        throw new Error(`Unhandled node type: ${node.type}`);
    }
  }

  visitFunctionDeclaration(node) {
    const { name, parameters, body } = node;
    if (this.currentScope.has(name)) {
      throw new Error(`Function ${name} already declared.`);
    }
    this.currentScope.set(name, { type: 'function', parameters, body });

    // Enter new scope for function body
    this.enterScope();
    parameters.forEach(param => {
      this.currentScope.set(param.name, { type: param.type });
    });
    this.visit(body); // Note que visitamos `body` diretamente, não `body.body`
    this.exitScope();
  }

  visitVariableDeclaration(node) {
    const { name, varType, initializer } = node;
    if (this.currentScope.has(name)) {
      throw new Error(`Variable ${name} already declared.`);
    }
    this.currentScope.set(name, { type: varType });
    if (initializer) {
      this.visit(initializer);
      this.checkTypeCompatibility(varType, initializer);
    }
  }
  

  visitBlock(node) {
    this.enterScope();
    node.body.forEach(statement => this.visit(statement));
    this.exitScope();
  }

  visitIfStatement(node) {
    this.visit(node.condition);
    this.visit(node.thenBranch);
    if (node.elseBranch) {
      this.visit(node.elseBranch);
    }
  }

  visitReturnStatement(node) {
    this.visit(node.value);
  }

  visitPrintStatement(node) {
    node.args.forEach(arg => this.visit(arg));
  }

  visitBinaryExpression(node) {
    this.visit(node.left);
    this.visit(node.right);
    // Aqui você pode adicionar verificações de tipo
  }

  visitAssignment(node) {
    this.visit(node.value);
    const varInfo = this.currentScope.get(node.name) || this.globalScope.get(node.name);
    if (!varInfo) {
      throw new Error(`Undeclared variable ${node.name}`);
    }
    this.checkTypeCompatibility(varInfo.type, node.value);
  }

  visitIdentifier(node) {
    if (!this.currentScope.has(node.name) && !this.globalScope.has(node.name)) {
      throw new Error(`Undeclared variable ${node.name}`);
    }
  }

  visitNumber(node) {
    // Números são sempre válidos como terminais
  }

  checkTypeCompatibility(expectedType, node) {
    // Adicione lógica para verificar a compatibilidade de tipos
    // Aqui você pode verificar se o tipo do node é compatível com expectedType
  }
}



module.exports = SemanticAnalyzer;