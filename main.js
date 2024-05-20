const fs = require('fs');
const lexer = require('./Analisadores/lexico');
const codigoFonte = fs.readFileSync('codigo.c', 'utf-8');

const tokens = lexer(codigoFonte);

console.log("\n"+"LEXEMA".padEnd(80), "TOKEN".padEnd(40), "LINHA");

tokens.forEach(token => {
    console.log(token.value.padEnd(80), token.type.padEnd(42), token.line);
});