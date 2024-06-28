import { ComparisonOperator, ExpressionType, StatementType, type Block, type Comparison, type FunctionCall, type Inline, type Statement, type Variable, type VariableAssignment } from '../types/parser';
import { OperatorType, PunctuationType, TokenType, type Identifier, type Operator, type Token } from '../types/tokenizer';

interface ParseContext {
    inline?: boolean;
    functionArgs?: boolean;
}

export default class Parser {

    readonly tokens: Token[];
    index = -1;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    get current() {
        return this.tokens[this.index];
    }

    next(): Token | undefined {
        return this.tokens.at(++this.index);
    }

    peek(): Token | undefined {
        return this.tokens.at(this.index + 1);
    }

    parse(ctx: ParseContext = {}): Statement {
        const statement: Block = {
            type: StatementType.Block,
            statements: []
        };
        while (this.next()) {
            switch (this.current.type) {
                case TokenType.Identifier: {
                    const nextToken = this.peek();
                    if (nextToken) {
                        switch (nextToken.type) {
                            case TokenType.LineFeed: {
                                const parsed: Inline = {
                                    type: StatementType.Inline,
                                    expression: this.getVariableExpression()
                                };
                                if (ctx.inline) {
                                    return parsed;
                                } else {
                                    statement.statements.push(parsed);
                                }
                                break;
                            }
                            case TokenType.Punctuation: {
                                if (nextToken.punctuation !== PunctuationType.OpenParenthesis) {
                                    throw new SyntaxError(`A ${nextToken.type} cannot follow an identifier`);
                                }
                                const parsed: Inline = {
                                    type: StatementType.Inline,
                                    expression: this.getFunctionCallExpression()
                                };
                                if (ctx.inline) {
                                    return parsed;
                                } else {
                                    statement.statements.push(parsed);
                                }
                                break;
                            }
                            case TokenType.Operator: {
                                switch (nextToken.operator) {
                                    case OperatorType.Assignment: {
                                        const parsed: Inline = {
                                            type: StatementType.Inline,
                                            expression: this.getVariableAssignmentExpression()
                                        };
                                        if (ctx.inline ?? ctx.functionArgs) {
                                            return parsed;
                                        } else {
                                            statement.statements.push(parsed);
                                        }
                                        break;
                                    }
                                    case OperatorType.GreaterThan: {
                                        const parsed: Inline = {
                                            type: StatementType.Inline,
                                            expression: this.getComparisonExpression()
                                        };
                                        if (ctx.inline ?? ctx.functionArgs) {
                                            return parsed;
                                        } else {
                                            statement.statements.push(parsed);
                                        }
                                        break;
                                    }
                                    case OperatorType.GreaterThanOrEqual:
                                    case OperatorType.LessThan:
                                    case OperatorType.LessThanOrEqual:
                                    case OperatorType.Equal:
                                    case OperatorType.NotEqual:
                                    case OperatorType.Plus:
                                    case OperatorType.Minus:
                                    case OperatorType.Multiply:
                                    case OperatorType.Divide:
                                }
                                break;
                            }
                            default: {
                                throw new SyntaxError(`A ${nextToken.type} cannot follow an identifier`);
                            }
                        }
                    }
                    break;
                }
                case TokenType.Literal: {

                    break;
                }
                case TokenType.Punctuation: {
                    switch (this.current.punctuation) {
                        case PunctuationType.OpenParenthesis: {
                            throw new SyntaxError('Unexpected open parenthesis');
                        }
                        case PunctuationType.CloseParenthesis: {
                            if (ctx.functionArgs) {
                                return statement;
                            } else {
                                throw SyntaxError('Unexpected close parenthesis');
                            }
                        }
                        case PunctuationType.OpenBracket: {
                            statement.statements.push(this.parse());
                            break;
                        }
                        case PunctuationType.CloseBracket: {
                            this.next();
                            return statement;
                        }
                        case PunctuationType.Comma: {
                            if (ctx.functionArgs) {
                                return statement;
                            } else {
                                throw SyntaxError('Unexpected comma');
                            }
                        }
                    }

                    break;
                }
                case TokenType.Operator: {

                    break;
                }
                case TokenType.Keyword: {

                    break;
                }
            }
        }

        return statement;
    }

    parseFunctionArguments(): Statement[] {
        const functionArgs: Statement[] = [];
        while (true) {
            const nextToken: Token = this.peek()!;
            if (nextToken.type === TokenType.Punctuation && nextToken.punctuation === PunctuationType.CloseParenthesis) {
                break;
            } else {
                this.next();
                functionArgs.push(this.parse({ functionArgs: true, inline: true }));
            }
        }
        return functionArgs;
    }

    getVariableExpression(): Variable {
        return {
            type: ExpressionType.Variable,
            name: (this.current as Identifier).name
        };
    }

    getFunctionCallExpression(): FunctionCall {
        const { name } = this.next() as Identifier;
        this.next();
        return {
            type: ExpressionType.FunctionCall,
            name,
            args: this.parseFunctionArguments()
        };
    }

    getVariableAssignmentExpression(): VariableAssignment {
        const { name } = this.current as Identifier;
        this.next();
        this.next();
        return {
            type: ExpressionType.Assignment,
            variable: name,
            value: this.parse()
        };
    }

    getComparisonExpression(): Comparison {
        const { operator } = this.next() as Operator;
        return {
            type: ExpressionType.Comparison,
            left: {
                type: StatementType.Inline,
                expression: this.getVariableExpression()
            },
            operator: operator as unknown as ComparisonOperator,
            right: this.parse() 
        };
    }
}
