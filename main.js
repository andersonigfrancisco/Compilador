const fs = require('fs');
const lexer = require('./Analisadores/lexer');

const codigoFonte = fs.readFileSync('codigo.c', 'utf-8');

const tokens = lexer(codigoFonte);

console.log(tokens)

console.log("\n");
console.log("LEXEMA".padEnd(80), "TOKEN".padEnd(40), "Linha");

tokens.forEach(token => {
    console.log(token.value.padEnd(80), token.type.padEnd(40), token.line);
});