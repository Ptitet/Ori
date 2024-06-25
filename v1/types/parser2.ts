import { LiteralType } from "./tokenizer"

export enum ExpressionType {
    Assignment = 'assignment',
    Condition = 'condition',
    FunctionCall = 'functionCall',
    Comparison = 'comparison',
    Literal = 'literal',
    Variable = 'variable',
    Calculus = 'calculus',
    FunctionDeclaration = 'functionDeclaration'
}

export interface Assignment {
    type: ExpressionType.Assignment,
    variable: string,
    value: Expression
}

export enum ComparisonOperator {
    Equal = '==',
    NotEqual = '!=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    LessThan = '<',
    LessThanOrEqual = '<='
}

export interface Comparison {
    type: ExpressionType.Comparison,
    left: Expression,
    operator: ComparisonOperator,
    right: Expression
}

export enum MathOperator {
    Plus = '+',
    Minus = '-',
    Multiply = '*',
    Divide = '/'
}

export interface Calculus {
    type: ExpressionType.Calculus,
    left: Expression,
    operator: MathOperator
    right: Expression
}

// export enum LiteralType {
//     Boolean,
//     Number,
//     String
// }

export interface BooleanLiteral {
    type: ExpressionType.Literal
    literal: LiteralType.Boolean,
    value: boolean
}

export interface NumberLiteral {
    type: ExpressionType.Literal,
    literal: LiteralType.Number,
    value: number
}

export interface StringLiteral {
    type: ExpressionType.Literal,
    literal: LiteralType.String,
    value: string
}

export type Literal = BooleanLiteral | NumberLiteral | StringLiteral;

export interface Variable {
    type: ExpressionType.Variable
    name: string
}

export interface Condition {
    type: ExpressionType.Condition,
    condition: Expression,
    true: Expression,
    false?: Expression
}

export interface FunctionCall {
    type: ExpressionType.FunctionCall,
    func: string,
    args: Expression[]
}

export interface FunctionDeclaration {
    type: ExpressionType.FunctionDeclaration,
    args?: string[],
    body: Expression
}

export type Inline = Assignment | Comparison | Calculus | Literal | Variable | Condition | FunctionCall | FunctionDeclaration;

export type Expression = Inline | Expression[];

const program: Expression = [
    {
        type: ExpressionType.Assignment,
        variable: 'check',
        value: {
            type: ExpressionType.FunctionDeclaration,
            args: ['age_max'],
            body: [
                {
                    type: ExpressionType.Assignment,
                    variable: 'input',
                    value: {
                        type: ExpressionType.FunctionCall,
                        func: 'in',
                        args: [{
                            type: ExpressionType.Literal,
                            literal: LiteralType.String,
                            value: 'age ? '
                        }]
                    }
                },
                {
                    type: ExpressionType.Condition,
                    condition: {
                        type: ExpressionType.Comparison,
                        left: {
                            type: ExpressionType.Variable,
                            name: 'input'
                        },
                        operator: ComparisonOperator.LessThanOrEqual,
                        right: {
                            type: ExpressionType.Variable,
                            name: 'age_max'
                        }
                    },
                    true: {
                        type: ExpressionType.FunctionCall,
                        func: 'out',
                        args: [{
                            type: ExpressionType.Literal,
                            literal: LiteralType.String,
                            value: 'Adult'
                        }]
                    },
                    false: {
                        type: ExpressionType.FunctionCall,
                        func: 'out',
                        args: [{
                            type: ExpressionType.Literal,
                            literal: LiteralType.String,
                            value: 'Child'
                        }]
                    }
                }
            ]
        }
    },
    {
        type: ExpressionType.Assignment,
        variable: 'age_max',
        value: {
            type: ExpressionType.Literal,
            literal: LiteralType.Number,
            value: 18
        }
    },
    {
        type: ExpressionType.FunctionCall,
        func: 'check',
        args: [{
            type: ExpressionType.Variable,
            name: 'age_max'
        }]
    }
];

const prog: Expression = [
    {
        type: ExpressionType.Comparison,
        left: {
            type: ExpressionType.Calculus,
            left: {
                type: ExpressionType.Variable,
                name: 'a'
            },
            operator: MathOperator.Plus,
            right: {
                type: ExpressionType.Literal,
                literal: LiteralType.Number,
                value: 2
            }
        },
        operator: ComparisonOperator.GreaterThan,
        right: {
            type: ExpressionType.Literal,
            literal: LiteralType.Number,
            value: 3
        }
    }
]
