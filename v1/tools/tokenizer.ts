import { CharType, TokenType, PunctuationType, LiteralType, OperatorType, KeywordType } from '../types/tokenizer';
import type { Token, StringLitteral, NumberLitteral, Operator, Keyword, Identifier, BooleanLitteral } from '../types/tokenizer';

export default class Tokenizer {

    index = 0;
    row = 0;
    column = 0;
    readonly input: string;

    constructor(input: string) {
        this.input = input;
    }

    get current(): string {
        return this.input[this.index];
    }

    next(): string {
        this.row++;
        const nextChar: string = this.input.charAt(++this.index);

        if (nextChar === '\n') {
            this.column++;
            this.row = 0;
        }
        return nextChar;
    }

    peek(): string {
        return this.input.charAt(this.index + 1);
    }

    getCharType(input?: string): CharType {
        const char = input ?? this.current;
        const punctuations = ['(', ')', '{', '}', '\'', '"', ','];
        const quotes = ['"', '\''];
        const regularRegex = /[a-zA-Z_]/;
        if (punctuations.includes(char)) {
            return CharType.Punctuation;
        } else if (quotes.includes(char)) {
            return CharType.Quote;
        } else if (regularRegex.test(char)) {
            return CharType.Letter;
        } else if (char === ' ') {
            return CharType.Space;
        } else if (char === '\n') {
            return CharType.LineFeed;
        } else if (char === '') {
            return CharType.EOF;
        } else if (!Number.isNaN(Number.parseInt(char))) {
            return CharType.Digit;
        } else {
            return CharType.Operator;
        }
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];
        let charType: CharType;
        while ((charType = this.getCharType()) !== CharType.EOF) {
            switch (charType) {
                case CharType.Punctuation: {
                    tokens.push({
                        type: TokenType.Punctuation,
                        punctuation: this.current as PunctuationType
                    });
                    this.next();
                    break;
                }
                case CharType.Quote: {
                    tokens.push(this.getStringLitteral());
                    break;
                }
                case CharType.Digit: {
                    tokens.push(this.getNumberLitteral());
                    break;
                }
                case CharType.Letter: {
                    tokens.push(this.getIdentifierOrKeywordOrBooleanLitteral());
                    break;
                }
                case CharType.Space: {
                    this.next();
                    continue;
                }
                case CharType.LineFeed: {
                    tokens.push({
                        type: TokenType.LineFeed
                    });
                    break;
                }
                case CharType.Operator: {
                    tokens.push(this.getOperator());
                    break;
                }
            }
        }
        return tokens;
    }

    getStringLitteral(): StringLitteral {
        const opener: string = this.current;
        let value = '';
        while (this.peek() !== opener) {
            value += this.next();
        }
        this.next();
        this.next();
        return {
            type: TokenType.Literal,
            literal: LiteralType.String,
            value
        };
    }

    getNumberLitteral(): NumberLitteral {
        let value: string = this.current;
        // eslint-disable-next-line prefer-const
        let dotHit = false;
        let currentChar: string;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (this.getCharType(currentChar = this.peek()) === CharType.Digit || (currentChar === '.' && !dotHit)) {
            value += this.next();
        }
        this.next();
        return {
            type: TokenType.Literal,
            literal: LiteralType.Number,
            value: Number.parseFloat(value)
        };
    }

    getOperator(): Operator {
        let operator: string = this.current;
        while (this.getCharType(this.peek()) === CharType.Operator) {
            operator += this.next();
        }
        this.next();
        return {
            type: TokenType.Operator,
            operator: operator as OperatorType
        };
    }

    getIdentifierOrKeywordOrBooleanLitteral(): Keyword | Identifier | BooleanLitteral {
        let value: string = this.current;
        while (this.getCharType(this.peek()) === CharType.Letter) {
            value += this.next();
        }
        this.next();
        const keywords = ['if', 'then', 'else', 'fn'];
        const booleanLitterals = ['true', 'false'];
        if (keywords.includes(value)) {
            return {
                type: TokenType.Keyword,
                keyword: value as KeywordType
            };
        } else if (booleanLitterals.includes(value)) {
            return {
                type: TokenType.Literal,
                literal: LiteralType.Boolean,
                value: value === 'true'
            };
        } else {
            return {
                type: TokenType.Identifier,
                name: value
            };
        }
    }
}
