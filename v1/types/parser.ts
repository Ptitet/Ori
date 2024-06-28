import { LiteralType } from './tokenizer';

export type Statement = Block | Inline;

export enum StatementType {
    Inline = 'inline',
    Block = 'block'
}

export enum ExpressionType {
    Assignment = 'assignment',
    Condition = 'condition',
    FunctionCall = 'functionCall',
    Comparison = 'comparison',
    Literal = 'literal',
    Variable = 'variable'
}

export interface VariableAssignment {
    type: ExpressionType.Assignment;
    variable: string;
    value: Statement;
}

interface Condition {
    type: ExpressionType.Condition;
    condition: Statement;
    true: Statement;
    false?: Statement;
}

export interface FunctionCall {
    type: ExpressionType.FunctionCall;
    name: string;
    args: Statement[];
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
    type: ExpressionType.Comparison;
    operator: ComparisonOperator;
    left: Statement;
    right: Statement;
}

interface BooleanLitteral {
    type: ExpressionType.Literal;
    litteral: LiteralType.Boolean;
    value: boolean;
}

interface NumberLitteral {
    type: ExpressionType.Literal;
    litteral: LiteralType.Number;
    value: number;
}

interface StringLitteral {
    type: ExpressionType.Literal;
    litteral: LiteralType.String;
    value: string;
}

export interface Variable {
    type: ExpressionType.Variable;
    name: string;
}

type Litteral = BooleanLitteral | NumberLitteral | StringLitteral;

export interface FunctionDeclaration {
    name: string;
    args: string[];
    body: Statement;
}

type Expression = VariableAssignment | Condition | FunctionCall | Comparison | Litteral | Variable | FunctionDeclaration;

export interface Inline {
    type: StatementType.Inline;
    expression: Expression;
}

export interface Block {
    type: StatementType.Block;
    statements: Statement[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const program: Block = {
    type: StatementType.Block,
    statements: [
        {
            type: StatementType.Inline,
            expression: {
                type: ExpressionType.Assignment,
                variable: 'input',
                value: {
                    type: StatementType.Inline,
                    expression: {
                        type: ExpressionType.FunctionCall,
                        name: 'in',
                        args: [
                            {
                                type: StatementType.Inline,
                                expression: {
                                    type: ExpressionType.Literal,
                                    litteral: LiteralType.String,
                                    value: 'age ? '
                                }
                            }
                        ]
                    }
                }
            }
        },
        {
            type: StatementType.Inline,
            expression: {
                type: ExpressionType.Assignment,
                variable: 'age_max',
                value: {
                    type: StatementType.Inline,
                    expression: {
                        type: ExpressionType.Literal,
                        litteral: LiteralType.Number,
                        value: 18
                    }
                }
            }
        },
        {
            type: StatementType.Inline,
            expression: {
                type: ExpressionType.Condition,
                condition: {
                    type: StatementType.Inline,
                    expression: {
                        type: ExpressionType.Comparison,
                        left: {
                            type: StatementType.Inline,
                            expression: {
                                type: ExpressionType.Variable,
                                name: 'input'
                            }
                        },
                        operator: ComparisonOperator.GreaterThan,
                        right: {
                            type: StatementType.Inline,
                            expression: {
                                type: ExpressionType.Variable,
                                name: 'age_max'
                            }
                        }
                    }
                },
                true: {
                    type: StatementType.Block,
                    statements: [{
                        type: StatementType.Inline,
                        expression: {
                            type: ExpressionType.FunctionCall,
                            name: 'out',
                            args: [{
                                type: StatementType.Inline,
                                expression: {
                                    type: ExpressionType.Literal,
                                    litteral: LiteralType.String,
                                    value: 'Youre an adult'
                                }
                            }]
                        }
                    }]
                },
                false: {
                    type: StatementType.Block,
                    statements: [{
                        type: StatementType.Inline,
                        expression: {
                            type: ExpressionType.FunctionCall,
                            name: 'out',
                            args: [{
                                type: StatementType.Inline,
                                expression: {
                                    type: ExpressionType.Literal,
                                    litteral: LiteralType.String,
                                    value: 'Youre not an adult'
                                }
                            }]
                        }
                    }]
                }
            }
        }
    ]
};
