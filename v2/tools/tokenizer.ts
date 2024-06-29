import { KeywordType, LiteralType, OperatorType, PunctuationType, TokenType, type Token } from '../types/tokenizer';
import StringReader from './readers/string';

enum CharType {
    Letter = 'letter',
    Operator = 'operator',
    Punctuation = 'punctuation',
    Digit = 'digit',
    LineFeed = 'lineFeed',
    Space = 'space',
    Comment = 'comment',
    Quote = 'quote'
}

export default class Tokenizer {

    private _stringReader: StringReader;
    private _tokens: Token[] = [];
    private _letterRegex = /[a-zA-Z_]/;
    private _punctuationChars: string[] = Object.values(PunctuationType);
    private _digitRegex = /\d/;
    private _lineFeed: string;
    private _space = ' ';
    private _keywords: string[] = Object.values(KeywordType);
    private _booleanLiterals: string[] = ['true', 'false'];
    private _allowedCharTypesForIdentifiers: string[] = [CharType.Letter, CharType.Digit];
    // eslint-disable-next-line @stylistic/quotes
    private _quotes: string[] = ['"', "'"];
    private _comment = ';';
    private _operators: string[] = Object.values(OperatorType);
    private _operatorsFirstChar: string[] = this._operators.map(operator => operator.charAt(0));

    constructor(source: string) {
        this._stringReader = new StringReader(source);
        this._lineFeed = this._stringReader.lineFeed;
    }

    tokenize(): Token[] {
        while (this._stringReader.next()) {
            switch (this._getCharType()) {
                case CharType.Letter: {
                    this._getIdentifierOrKeywordOrBooleanLiteral();
                    break;
                }
                case CharType.Operator: {
                    this._getOperator();
                    break;
                }
                case CharType.Punctuation: {
                    this._tokens.push({
                        type: TokenType.Punctuation,
                        punctuation: this._stringReader.current as PunctuationType
                    });
                    break;
                }
                case CharType.Digit: {
                    this._getNumberLiteral();
                    break;
                }
                case CharType.LineFeed: {
                    this._tokens.push({
                        type: TokenType.LineFeed
                    });
                    break;
                }
                case CharType.Comment: {
                    this._skipComment();
                    break;
                }
                case CharType.Quote: {
                    this._getStringLiteral();
                }
            }
        }
        return this._tokens;
    }

    private _getCharType(char?: string): CharType {
        char ??= this._stringReader.current;
        if (this._letterRegex.test(char)) {
            return CharType.Letter;
        } else if (this._punctuationChars.includes(char)) {
            return CharType.Punctuation;
        } else if (this._digitRegex.test(char)) {
            return CharType.Digit;
        } else if (char === this._lineFeed) {
            return CharType.LineFeed;
        } else if (char === this._space) {
            return CharType.Space;
        } else if (char === this._comment) {
            return CharType.Comment;
        } else if (this._operatorsFirstChar.includes(char)) {
            return CharType.Operator;
        } else if (this._quotes.includes(char)) {
            return CharType.Quote;
        } else {
            throw SyntaxError(`Bad character ${char} at ${this._stringReader.row}:${this._stringReader.column}`);
        }
    }

    private _getIdentifierOrKeywordOrBooleanLiteral() {
        let value = this._stringReader.current;
        let nextChar: string | undefined;
        while ((nextChar = this._stringReader.peek()) && this._allowedCharTypesForIdentifiers.includes(this._getCharType(nextChar))) {
            value += this._stringReader.next()!;
        }
        const isBooleanLiteral = this._booleanLiterals.includes(value);
        if (isBooleanLiteral) {
            this._tokens.push({
                type: TokenType.Literal,
                literal: LiteralType.Boolean,
                value: value === 'true'
            });
            return;
        }
        const isKeyword = this._keywords.includes(value);
        if (isKeyword) {
            this._tokens.push({
                type: TokenType.Keyword,
                keyword: value as KeywordType
            });
        } else { // it's an identifier
            this._tokens.push({
                type: TokenType.Identifier,
                name: value
            });
        }
    }

    private _getOperator() {
        let value = this._stringReader.current;
        let nextChar: string | undefined;
        while ((nextChar = this._stringReader.peek()) && this._getCharType(nextChar) === CharType.Operator) {
            value += this._stringReader.next()!;
        }
        if (!this._operators.includes(value)) {
            throw SyntaxError(`Unknown operator ${value} at ${this._stringReader.row}:${this._stringReader.column}`);
        }
        this._tokens.push({
            type: TokenType.Operator,
            operator: value as OperatorType,
        });
    }

    private _getNumberLiteral() {
        let value = this._stringReader.current;
        let nextChar: string | undefined;
        let dotHit = false;
        while ((nextChar = this._stringReader.peek()) && (this._getCharType(nextChar) === CharType.Digit || nextChar === '.')) {
            if (nextChar === '.') {
                if (this._stringReader.peek(2) === '.') { // check for range syntax
                    break;
                }
                if (dotHit) {
                    throw SyntaxError(`Unexpected . at ${this._stringReader.row}:${this._stringReader.column + 1}`);
                } else {
                    dotHit = true;
                }
            }
            value += this._stringReader.next()!;
        }
        this._tokens.push({
            type: TokenType.Literal,
            literal: LiteralType.Number,
            value: Number.parseFloat(value)
        });
    }

    private _getStringLiteral() {
        const openQuote = this._stringReader.current;
        let value = '';
        let nextChar: string | undefined;
        while ((nextChar = this._stringReader.peek()) && nextChar !== openQuote) {
            value += this._stringReader.next()!;
        }
        if (!nextChar) {
            throw SyntaxError(`Expected string to be closed at ${this._stringReader.row}:${this._stringReader.column + 1}`);
        }
        this._tokens.push({
            type: TokenType.Literal,
            literal: LiteralType.String,
            value
        });
        this._stringReader.next(); // skip the closing quote
    }

    private _skipComment() {
        let nextChar: string | undefined;
        while ((nextChar = this._stringReader.peek()) && this._getCharType(nextChar) !== CharType.LineFeed) {
            this._stringReader.next();
        }
    }
}
