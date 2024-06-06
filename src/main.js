const fs = require('fs');
const lexer = require('./lexer/lexico');
const Parser = require('./parser/parse');
const generateASTYAML = require('./generateastyml');
const SemanticAnalyzer = require('./semantic/SemanticAnalyzer');

const colors = {
    lilas: '\x1b[35m',
    verde: '\x1b[32m',
    reset: '\x1b[0m'
};


const codigoFonte = fs.readFileSync('../input.c', 'utf-8');

const tokens = lexer(codigoFonte);

console.log("".padEnd(60), "Análise Léxica (Scanner) || (Gera Tokens)".padEnd(40), "\n");
console.log("\n" + "LEXEMA".padEnd(80), "TOKEN".padEnd(40), "LINHA");

tokens.forEach(token => {
    console.log(
        `${colors.lilas}${token.value.padEnd(80)}${colors.reset} ${colors.verde}${token.type.padEnd(42)}${colors.reset} ${token.line}\n`
    );
});

console.log("\n\n\n\n".padEnd(60), "Análise Sintática (Parser) || (Gera AST)".padEnd(40), "\n\n");


// Análise sintática
const parser = new Parser(tokens);
const ast = parser.parse();

// Geração do AST em YAML
const astYAML = generateASTYAML(ast);
fs.writeFileSync('./ast.yaml', astYAML);


console.log("\n\n\n\n".padEnd(60), "Análise semântica".padEnd(40), "\n\n");

// Análise semântica
const semanticAnalyzer = new SemanticAnalyzer(ast);
try {
    semanticAnalyzer.analyze();
    console.log('Semantic analysis completed successfully.');
} catch (error) {
    console.error('Semantic error:', error.message);
}
