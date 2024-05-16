const fs = require('fs');
const lexer = require('./lexer');

// Ler o arquivo de código-fonte
const codigoFonte = fs.readFileSync('codigo.c', 'utf-8');

// Executar o analisador léxico
const tokens = lexer(codigoFonte);

console.log("\n");
console.log("LEXEMA".padEnd(80), "TOKEN".padEnd(40), "Linha");
console.log("\n");

tokens.forEach(token => {
    console.log(token.value.padEnd(80), token.type.padEnd(40), token.line);
    console.log("\n");
});