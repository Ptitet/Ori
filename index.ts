import Tokenizer from "./v1/tools/tokenizer";
import Parser from "./v1/tools/parser";
import type { Token } from "./v1/types/tokenizer";

const filePath: string = process.argv[2];

const programString: string = await Bun.file(filePath).text();

const tokenizer: Tokenizer = new Tokenizer(programString);
const tokens: Token[] = tokenizer.tokenize();
const parser: Parser = new Parser(tokens);
const ast = parser.parse();