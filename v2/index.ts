import Parser from './tools/parser';
import Tokenizer from './tools/tokenizer';

const programs = [
    '1 + 3',
    '1 / 2 + 3 / 4',
    '1 + {2 / 3}',
    '[1, 3 + 2]',
    '[0..3]',
    '[..3]',
    '[..3..1]',
    '[1..4..2]',
    `{
        a = 1
    }`,
    'fn (a, b) a + b',
    'fn (a, b) { a + b }',
    'fn () 1',
    'if true then true',
    'if { 1 + 1 } true else false',
    'if true { true } else false'
];

const index = 3;

const tokenizer: Tokenizer = new Tokenizer(programs[index]);
const tokens = tokenizer.tokenize();
console.log(tokens);
const parser: Parser = new Parser(tokens);
const ast = parser.parse();
console.log(ast);
