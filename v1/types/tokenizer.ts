export enum CharType {
    /** ( ) { } */
    Punctuation,
    /** ' " */
    Quote,
    /** a, b, c, A, B, C, _ */
    Letter,
    /** 1, 2, 3 */
    Digit,
    /** space, newline */
    Space,
    /** comparison, maths */
    Operator,
    /** end of file */
    EOF,
    /** \n */
    LineFeed
}

export type Token = Identifier | Litteral | Punctuation | Operator | Keyword | LineFeed;

export interface LineFeed {
    type: TokenType.LineFeed;
}

export interface Keyword {
    type: TokenType.Keyword;
    keyword: KeywordType;
}

export enum TokenType {
    Identifier = 'identifier',
    Literal = 'litteral',
    Punctuation = 'punctuation',
    Operator = 'operator',
    Keyword = 'keyword',
    LineFeed = 'linefeed'
}

export enum LiteralType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean'
}

export interface Identifier {
    type: TokenType.Identifier;
    name: string;
}

export interface StringLitteral {
    type: TokenType.Literal;
    literal: LiteralType.String;
    value: string;
}

export interface NumberLitteral {
    type: TokenType.Literal;
    literal: LiteralType.Number;
    value: number;
}

export interface BooleanLitteral {
    type: TokenType.Literal;
    literal: LiteralType.Boolean;
    value: boolean;
}

export type Litteral = StringLitteral | NumberLitteral | BooleanLitteral;

export enum PunctuationType {
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    OpenBracket = '{',
    CloseBracket = '}',
    Comma = ','
}
interface Punctuation {
    type: TokenType.Punctuation;
    punctuation: PunctuationType;
}

export enum OperatorType {
    Assignment = '=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    LessThan = '<',
    LessThanOrEqual = '<=',
    Equal = '==',
    NotEqual = '!=',
    Plus = '+',
    Minus = '-',
    Multiply = '*',
    Divide = '/'
}

export interface Operator {
    type: TokenType.Operator;
    operator: OperatorType;
}

export enum KeywordType {
    If = 'if',
    Then = 'then',
    Else = 'else',
    Function = 'fn'
}
