import { ComparisonOperator, ExpressionType, MathOperator, type Expression, type Inline } from "../types/parser2";
import { OperatorType, PunctuationType, TokenType, LiteralType, type Token } from "../types/tokenizer";

export default class Parser {

    static isMathOperator(operator: string): operator is MathOperator {
        return ['+', '-', '*', '/'].includes(operator);
    }

    index: number = -1;
    readonly tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    get current(): Token {
        return this.tokens[this.index];
    }

    next(): Token | undefined {
        return this.tokens.at(++this.index);
    }

    peek(n = 1): Token | undefined {
        return this.tokens.at(this.index + n);
    }

    parse(): Expression {
        let expressions: Expression = [];
        while (this.next()) {
            switch (this.current.type) {
                case TokenType.Identifier: {
                    const nextToken = this.peek();
                    if (!nextToken) continue;
                    switch (nextToken.type) {
                        case TokenType.Punctuation: {
                            if (nextToken.punctuation !== PunctuationType.OpenParenthesis) {
                                throw SyntaxError(`Expected (, found ${nextToken.punctuation}`);
                            }
                            const { name: func } = this.current;
                            this.next();
                            expressions.push({
                                type: ExpressionType.FunctionCall,
                                func,
                                args: this.parseFunctionCallArgs()
                            });
                            break;
                        }
                        case TokenType.Operator: {
                            const { operator }: { operator: string } = nextToken;
                            const { name } = this.current;
                            this.next() // skip operator
                            switch (operator as OperatorType) {
                                case OperatorType.Assignment: {
                                    expressions.push({
                                        type: ExpressionType.Assignment,
                                        variable: name,
                                        value: this.parse()
                                    })
                                    break;
                                }
                                case OperatorType.GreaterThan:
                                case OperatorType.GreaterThanOrEqual:
                                case OperatorType.LessThan:
                                case OperatorType.LessThanOrEqual:
                                case OperatorType.Equal:
                                case OperatorType.NotEqual: {
                                    expressions.push({
                                        type: ExpressionType.Comparison,
                                        left: {
                                            type: ExpressionType.Variable,
                                            name
                                        },
                                        operator: operator as ComparisonOperator,
                                        right: this.parse()
                                    })
                                    break;
                                }
                                case OperatorType.Plus:
                                case OperatorType.Minus:
                                case OperatorType.Multiply:
                                case OperatorType.Divide: {
                                    expressions.push({
                                        type: ExpressionType.Calculus,
                                        left: {
                                            type: ExpressionType.Variable,
                                            name
                                        },
                                        operator: operator as MathOperator,
                                        right: this.parse()
                                    })
                                    break;
                                }
                            }

                            break;
                        }
                        case TokenType.LineFeed: {
                            expressions.push({
                                type: ExpressionType.Variable,
                                name: this.current.name
                            });
                            break;
                        }
                        default: {
                            throw SyntaxError(`An identifier cannot be followed by a ${nextToken.type}`);
                        }
                    }
                    break;
                }
                case TokenType.Literal: {
                    // @ts-expect-error
                    expressions.push({
                        type: ExpressionType.Literal,
                        literal: this.current.literal,
                        value: this.current.value
                    });
                    const nextToken = this.peek();
                    if (nextToken) {
                        if (nextToken.type === TokenType.Operator && !Parser.isMathOperator(nextToken.operator)) {
                            throw SyntaxError('Expected +, -, * or /');
                        } else if (nextToken.type !== TokenType.LineFeed) {
                            throw SyntaxError('Expected newline');
                        }
                    }
                    break;
                }
                case TokenType.Punctuation: {
                    switch (this.current.punctuation) {
                        case PunctuationType.OpenBracket: {
                            this.next();
                            expressions.push(this.parse());
                            break;
                        }
                        case PunctuationType.CloseBracket: {
                            this.next();
                            return expressions;
                        }
                        default: {
                            throw SyntaxError(`Unexpected ${this.current.punctuation}`);
                        }
                    }
                    break;
                }
                case TokenType.Operator: {
                    
                }
                case TokenType.Keyword:
                case TokenType.LineFeed:
            }
        }
        if (expressions.length === 1) {
            return expressions[0];
        } else {
            return expressions;
        }
    }

    parseFunctionCallArgs(): Expression[] {
        const args: Expression[] = [];
        this.next(); // skip the (
        while (true) {
            const nextToken = this.peek();
            if (!nextToken) {
                throw SyntaxError('Expected expression');
            }
            if (nextToken.type !== TokenType.Punctuation) {
                throw SyntaxError('Expected , or )');
            }
            if (nextToken.punctuation === PunctuationType.CloseParenthesis) {
                break;
            }
            if (nextToken.punctuation === PunctuationType.Comma) {
                this.next();
            }
            args.push(this.parse());
        }
        return args;
    }
}