class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const declarations = [];
    while (!this.isAtEnd()) {
      const token = this.peek();
      console.log(`Parsing declaration at token index ${this.current}: ${JSON.stringify(token)}`);
      if (token.type === 'DIRECTIVA' || token.type === 'COMENTARIO') {
        this.advance();  // Ignora diretivas e comentários
      } else {
        declarations.push(this.declaration());
      }
    }
    return { type: 'program', body: declarations };
  }

  declaration() {
    console.log("Inside declaration()");
    console.log("Current token:", this.peek());

    const typeToken = this.consume("PALAVRA_RESERVADA", "Expect type specifier.");
    console.log("Type token:", typeToken);

    const nameToken = this.consume("IDENTIFICADOR", "Expect identifier.");
    console.log("Name token:", nameToken);

    if (nameToken.value === 'main') {
      // Process main function declaration
      this.consume("PARENTESES", "Expect '(' after main.");
      this.consume("PARENTESES", "Expect ')' after '('.");
      this.consume("CHAVES", "Expect '{' before main function body.");
      const body = this.block();
      return { type: 'function_declaration', returnType: typeToken.value, name: nameToken.value, parameters: [], body };
    } else {
      // Process other variable declarations
      return this.variableDeclaration(typeToken, nameToken);
    }
  }

  variableDeclaration(typeToken, nameToken) {
    let initializer = null;
    if (this.match("OPERADOR", "=")) {
      initializer = this.expression();
    }
    this.consume("PONTO_VIRGULA", "Expect ';' after variable declaration.");
    return { type: 'variable_declaration', varType: typeToken.value, name: nameToken.value, initializer };
  }

  block() {
    const body = [];
    while (!this.check("CHAVES", "}") && !this.isAtEnd()) {
      body.push(this.statement());
    }
    this.consume("CHAVES", "Expect '}' after block.");
    return body;
  }

  statement() {
    if (this.check("PALAVRA_RESERVADA", "int")) {
      return this.declaration();
    }

    if (this.check("FUNCAO_DE_CHAMADA", "printf")) {
      return this.printStatement();
    }

    if (this.check("PALAVRA_RESERVADA", "return")) {
      return this.returnStatement();
    }

    throw new Error("Unexpected statement.");
  }

  printStatement() {
    const funcCall = this.consume("FUNCAO_DE_CHAMADA", "Expect 'printf'.");
    this.consume("PARENTESES", "Expect '(' after 'printf'.");
    
    const formatString = [];
    this.consume("STRING_DELIMITADOR", "Expect string delimiter '\"'.");
    
    while (!this.check("STRING_DELIMITADOR")) {
      formatString.push(this.advance().value);
    }
    
    this.consume("STRING_DELIMITADOR", "Expect string delimiter '\"'.");
    
    const formatStringValue = formatString.join('');
    
    const args = [];
    if (this.match("OPERADOR", ",")) {
      do {
        args.push(this.expression());
      } while (this.match("OPERADOR", ","));
    }

    this.consume("PARENTESES", "Expect ')' after arguments.");
    this.consume("PONTO_VIRGULA", "Expect ';' after printf statement.");
    return { type: 'print_statement', funcCall, formatString: formatStringValue, args };
  }

  returnStatement() {
    const keyword = this.consume("PALAVRA_RESERVADA", "Expect 'return'.");
    const value = this.consume("NUMERO", "Expect return value.");
    this.consume("PONTO_VIRGULA", "Expect ';' after return value.");
    return { type: 'return_statement', keyword: keyword.value, value: value.value };
  }

  expression() {
    let expr = this.primary();

    while (this.match("OPERADOR", "+")) {
      const operator = this.previous();
      const right = this.primary();
      expr = { type: 'binary_expression', operator: operator.value, left: expr, right };
    }

    return expr;
  }

  primary() {
    if (this.match("NUMERO") || this.match("IDENTIFICADOR")) {
      return this.previous();
    }

    if (this.match("OPERADOR", "=")) {
      const value = this.expression();
      return { type: 'assignment', value };
    }

    throw new Error("Expect number or identifier.");
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  check(type, value) {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (value === undefined) {
      return token.type === type;
    }
    return token.type === type && token.value === value;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.current >= this.tokens.length || this.peek().type === "EOF";
  }

  peek() {
    return this.tokens[this.current] || { type: "EOF" };
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

module.exports = Parser;
