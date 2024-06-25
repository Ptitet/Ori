import Interpreter from "./v1/tools/interpreter";
import { ComparisonOperator, ExpressionType, type Expression } from "./v1/types/parser2";
import { LiteralType } from "./v1/types/tokenizer";

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
                        type: ExpressionType.Literal,
                        literal: LiteralType.Number,
                        value: 18
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
                        operator: ComparisonOperator.GreaterThanOrEqual,
                        right: {
                            type: ExpressionType.Variable,
                            name: 'age_max'
                        }
                    },
                    true: {
                        type: ExpressionType.Literal,
                        literal: LiteralType.String,
                        value: 'Adult'
                    },
                    false: {
                        type: ExpressionType.Literal,
                        literal: LiteralType.String,
                        value: 'Child'
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

const interpreter = new Interpreter(program);
console.log(interpreter.run());