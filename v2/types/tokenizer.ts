export enum TokenType {
    Keyword = 'keyword',
    Identifier = 'identifier',
    Operator = 'operator',
    Punctuation = 'punctuation',
    Literal = 'literal',
    LineFeed = 'lineFeed'
}

export enum KeywordType {
    Fn = 'fn',
    If = 'if',
    Then = 'then',
    Else = 'else',
    While = 'while',
    For = 'for',
    In = 'in',
    Do = 'do'
}

export interface Keyword {
    type: TokenType.Keyword;
    keyword: KeywordType;
}

export interface Identifier {
    type: TokenType.Identifier;
    name: string;
}

export enum OperatorType {
    Assign = '=',
    Plus = '+',
    Increment = '++',
    PlusAndAssign = '+=',
    Minus = '-',
    Decrement = '--',
    MinusAndAssign = '-=',
    Multiply = '*',
    MultiplyAndAssign = '*=',
    Divide = '/',
    DivideAndAssign = '/=',
    Modulus = '%',
    ModulusAndAssign = '%=',
    Power = '**',
    PowerAndAssign = '**=',
    Greater = '>',
    GreaterOrEqual = '>=',
    Less = '<',
    LessOrEqual = '<=',
    Equal = '==',
    LogicalOr = '||',
    LogicalOrAndAssign = '||=',
    LogicalAnd = '&&',
    LogicalAndAndAssign = '&&=',
    LogicalNot = '!',
    At = '@',
    Range = '..',
    AccessMember = '.'
}

interface Operator {
    type: TokenType.Operator;
    operator: OperatorType;
}

export enum PunctuationType {
    OpenCurly = '{',
    CloseCurly = '}',
    OpenParenthesis = '(',
    CloseParenthesis = ')',
    OpenSquare = '[',
    CloseSquare = ']',
    Comma = ',',
}

export interface Punctuation {
    type: TokenType.Punctuation;
    punctuation: PunctuationType;
}

export enum LiteralType {
    Boolean = 'boolean',
    Number = 'number',
    String = 'string'
}

interface BooleanLiteral {
    type: TokenType.Literal;
    literal: LiteralType.Boolean;
    value: boolean;
}

interface NumberLiteral {
    type: TokenType.Literal;
    literal: LiteralType.Number;
    value: number;
}

interface StringLiteral {
    type: TokenType.Literal;
    literal: LiteralType.String;
    value: string;
}

interface LineFeed {
    type: TokenType.LineFeed;
}

type Literal =
    | BooleanLiteral
    | NumberLiteral
    | StringLiteral;

export type Token =
    | Keyword
    | Identifier
    | Operator
    | Punctuation
    | Literal
    | LineFeed;
