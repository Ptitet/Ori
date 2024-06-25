import { LiteralType } from "./tokenizer";

export enum ExpressionType {
    Assignment = 'assignment',
    Math = 'math',
    FunctionDeclaration = 'functionDeclaration',
    FunctionCall = 'functionCall',
    Condition = 'condition',
    Comparison = 'comparison',
    ForLoop = 'forLoop',
    WhileLoop = 'whileLoop',
    Boolean = 'boolean',
    At = 'at',
    Array = 'array',
    Object = 'object',
    Literal = 'literal',
    Variable = 'variable'
}

export interface Assignment {
    type: ExpressionType.Assignment,
    variable: string,
    value: Expression
}

export enum MathOperator {
    Plus = '+',
    Minus = '-',
    Multiply = '*',
    Divide = '/',
    Modulus = '%',
    Exponent = '**'
}

export interface MathUnary {
    type: ExpressionType.Math,
    operator: MathOperator.Plus | MathOperator.Minus,
    right: Expression
}

export interface MathBinary {
    type: ExpressionType.Math,
    binary: true,
    left: Expression,
    operator: MathOperator,
    right: Expression
}

export type Math = MathUnary | MathBinary;

export interface FunctionDeclaration {
    type: ExpressionType.FunctionDeclaration,
    args?: string[],
    body: Expression
}

export interface FunctionCall {
    type: ExpressionType.FunctionCall,
    func: string,
    args: Expression[]
}

export interface Condition {
    type: ExpressionType.Condition,
    if: Expression,
    then: Expression,
    else?: Expression
}

export enum ComparisonOperator {
    Greater = '>',
    GreaterOrEqual = '>=',
    Less = '<',
    LessOrEqual = '<=',
    Equal = '=='
}

export interface Comparison {
    type: ExpressionType.Comparison,
    left: Expression,
    operator: ComparisonOperator,
    right: Expression
}

export interface ForLoop {
    type: ExpressionType.ForLoop,
    variable: string,
    iterator: Expression,
    body: Expression
}

export interface WhileLoop {
    type: ExpressionType.WhileLoop,
    condition: Expression,
    body: Expression
}

export enum BooleanOperator {
    LogicalOr = '||',
    LogicalAnd = '&&',
    LogicalNot = '!'
}

export interface BooleanUnary {
    type: ExpressionType.Boolean,
    operator: BooleanOperator.LogicalNot
    right: Expression
}

export interface BooleanBinary {
    type: ExpressionType.Boolean,
    binary: true,
    left: Expression,
    operator: BooleanOperator.LogicalAnd | BooleanOperator.LogicalOr,
    right: Expression
}

export type Boolean = BooleanUnary | BooleanBinary;

export interface ArrayAt {
    type: ExpressionType.At,
    variable: string,
    at: Expression
}

export enum ArrayType {
    Range = 'range',
    List = 'list'
}

interface ArrayRange {
    type: ExpressionType.Array,
    array: ArrayType.Range,
    from?: Expression,
    to: Expression,
    step?: Expression
}

interface ArrayList {
    type: ExpressionType.Array,
    array: ArrayType.List,
    values: Expression[]
}

export type Array = ArrayRange | ArrayList;

export interface Member {
    key: string,
    value: Expression
}

export interface Object {
    type: ExpressionType.Object,
    members: Member[]
}

interface BooleanLiteral {
    type: ExpressionType.Literal
    literal: LiteralType.Boolean,
    value: boolean
}

interface NumberLiteral {
    type: ExpressionType.Literal,
    literal: LiteralType.Number,
    value: number
}

interface StringLiteral {
    type: ExpressionType.Literal,
    literal: LiteralType.String,
    value: string
}

type Literal = BooleanLiteral | NumberLiteral | StringLiteral;

export interface Variable {
    type: ExpressionType.Variable,
    name: string
}

export type Inline = | Assignment
    | Math
    | FunctionDeclaration
    | FunctionCall
    | Condition
    | Comparison
    | ForLoop
    | WhileLoop
    | Boolean
    | ArrayAt
    | Array
    | Object
    | Literal
    | Variable

export type Expression = Inline | Expression[];

const program: Expression = [
    {
        type: ExpressionType.Assignment,
        variable: 'input',
        value: {
            type: ExpressionType.Literal,
            literal: LiteralType.Number,
            value: 0
        }
    },
    {
        type: ExpressionType.Assignment,
        variable: 'chosen',
        value: {
            type: ExpressionType.WhileLoop,
            condition: {
                type: ExpressionType.Comparison,
                left: {
                    type: ExpressionType.Assignment,
                    variable: 'inp',
                    value: {
                        type: ExpressionType.FunctionCall,
                        func: 'input',
                        args: [{
                            type: ExpressionType.Literal,
                            literal: LiteralType.String,
                            value: 'number plz'
                        }]
                    }
                },
                operator: ComparisonOperator.Greater,
                right: {
                    type: ExpressionType.Literal,
                    literal: LiteralType.Number,
                    value: 3
                }
            },
            body: [
                {
                    type: ExpressionType.FunctionCall,
                    func: 'output',
                    args: [{
                        type: ExpressionType.Literal,
                        literal: LiteralType.String,
                        value: 'Error : input must be smaller than 3'
                    }]
                },
                {
                    type: ExpressionType.Variable,
                    name: 'inp'
                }
            ]
        }
    }
]