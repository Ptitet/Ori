import { ArrayType, BooleanOperator, ComparisonOperator, ExpressionType, MathOperator, type ArrayAt, type Assignment, type OriBoolean, type BooleanBinary } from '../types/ast';
import { KeywordType, LiteralType, OperatorType, PunctuationType, TokenType } from '../types/tokenizer';
import type { OriArray, Comparison, Condition, Expression, ForLoop, FunctionCall, FunctionDeclaration, Inline, Math, MathBinary, Member, OriObject, Variable, WhileLoop } from '../types/ast';
import type { Identifier, Keyword, Punctuation, Token } from '../types/tokenizer';
import type { ExpectToBeOptions, ExpectToBePunctuation, ExpectToBeKeyword, ParsingOptions } from '../types/parser';
import TokensReader from './readers/tokens';

export default class Parser {

    private _tokensReader: TokensReader;

    constructor(tokens: Token[]) {
        this._tokensReader = new TokensReader(tokens);
    }

    private _expectToBe(options: ExpectToBeOptions): void {
        let tokenToCheck: Token | undefined;
        if (options.token === 'current') {
            tokenToCheck = this._tokensReader.current;
        } else {
            tokenToCheck = this._tokensReader.peek();
        }
        if (!tokenToCheck) {
            throw SyntaxError('Unexpected end of file');
        }
        if (tokenToCheck.type !== options.tokenType) {
            throw SyntaxError(`Expected ${options.tokenType} received ${tokenToCheck.type}`);
        }
        if (tokenToCheck.type === TokenType.Punctuation && !(options as ExpectToBePunctuation).raw.includes(tokenToCheck.punctuation)) {
            const formatter = new Intl.ListFormat('en-US', { type: 'conjunction' });
            throw SyntaxError(`Expected ${formatter.format((options as ExpectToBePunctuation).raw)} received ${tokenToCheck.punctuation}`);
        } else if (tokenToCheck.type === TokenType.Keyword && !(options as ExpectToBeKeyword).raw.includes(tokenToCheck.keyword)) {
            const formatter = new Intl.ListFormat('en-US', { type: 'conjunction' });
            throw SyntaxError(`Expected ${formatter.format((options as ExpectToBePunctuation).raw)} received ${tokenToCheck.keyword}`);
        }
    }

    parse(): Expression {
        return this._parse();
    }

    private _parse(options: ParsingOptions = {}): Expression {
        const output: Expression[] = [];
        let exit = false;
        while (!exit && this._tokensReader.next()) {
            const { current } = this._tokensReader;
            switch (current.type) {
                case TokenType.Keyword: {
                    if (options.parsingIfCondition) {
                        if ([KeywordType.Then, KeywordType.Else].includes(current.keyword)) {
                            exit = true;
                        } else {
                            throw SyntaxError(`Unexpected keyword ${current.keyword}`);
                        }
                    }
                    if (options.parsingFunctionCallArgs) {
                        throw SyntaxError(`Unexpected keyword ${current.keyword}`);
                    }
                    output.push(this._handleKeyword());
                    break;
                }
                case TokenType.Identifier: {
                    output.push(this._handleIdentifier(options));
                    break;
                }
                case TokenType.Operator: {
                    switch (current.operator) {
                        case OperatorType.Plus: {
                            output.push({
                                type: ExpressionType.Math,
                                operator: MathOperator.Plus,
                                right: this._parse()
                            });
                            break;
                        }
                        case OperatorType.Minus: {
                            output.push({
                                type: ExpressionType.Math,
                                operator: MathOperator.Minus,
                                right: this._parse()
                            });
                            break;
                        }
                        case OperatorType.LogicalNot: {
                            output.push({
                                type: ExpressionType.Boolean,
                                operator: BooleanOperator.LogicalNot,
                                right: this._parse()
                            });
                            break;
                        }
                        default: {
                            throw SyntaxError(`Unexpected operator ${current.operator}`);
                        }
                    }
                    break;
                }
                case TokenType.Punctuation: {
                    switch (current.punctuation) {
                        case PunctuationType.OpenCurly: {
                            output.push(this._parse());
                            break;
                        }
                        case PunctuationType.CloseCurly: {
                            exit = true;
                            break;
                        }
                        case PunctuationType.OpenParenthesis: {
                            output.push(this._handleObjectDeclaration());
                            break;
                        }
                        case PunctuationType.CloseParenthesis: {
                            if (!options.parsingObjectMemberValue) {
                                throw SyntaxError('Unexpected )');
                            }
                            exit = true;
                            break;
                        }
                        case PunctuationType.OpenSquare: {
                            output.push(this._handleArray());
                            break;
                        }
                        case PunctuationType.CloseSquare: {
                            if (options.parsingArray) {
                                exit = true;
                            } else {
                                throw SyntaxError('Unexpected ]');
                            }
                            break;
                        }
                        case PunctuationType.Comma: {
                            if (options.parsingArray || options.parsingFunctionCallArgs) {
                                exit = true;
                            } else {
                                throw SyntaxError(`Unexpected ${current.punctuation}`);
                            }
                        }
                    }
                    break;
                }
                case TokenType.Literal: {
                    const nextToken = this._tokensReader.next();
                    if (!nextToken) {
                        // @ts-expect-error typescript is weird
                        output.push({
                            type: ExpressionType.Literal,
                            literal: current.literal,
                            value: current.value
                        });
                    } else {
                        switch (nextToken.type) {
                            case TokenType.Keyword: {
                                if (nextToken.keyword === KeywordType.Do && options.parsingWhileCondition) {
                                    // @ts-expect-error typescript is weird
                                    output.push({
                                        type: ExpressionType.Literal,
                                        literal: current.literal,
                                        value: current.value
                                    });
                                    exit = true;
                                    this._tokensReader.next(); // consume do
                                } else if (nextToken.keyword === KeywordType.Else) {
                                    // @ts-expect-error typescript is weird
                                    output.push({
                                        type: ExpressionType.Literal,
                                        literal: current.literal,
                                        value: current.value
                                    });
                                    exit = true;
                                } else if (nextToken.keyword === KeywordType.Then && options.parsingIfCondition) {
                                    // @ts-expect-error typescript is weird
                                    output.push({
                                        type: ExpressionType.Literal,
                                        literal: current.literal,
                                        value: current.value
                                    });
                                    exit = true;
                                } else {
                                    throw SyntaxError(`Unexpected keyword ${nextToken.keyword}`);
                                }
                                break;
                            }
                            case TokenType.Operator: {
                                switch (nextToken.operator) {
                                    case OperatorType.Plus:
                                    case OperatorType.Minus:
                                    case OperatorType.Multiply:
                                    case OperatorType.Modulus:
                                    case OperatorType.Power:
                                    case OperatorType.Divide: {
                                        output.push({
                                            type: ExpressionType.Math,
                                            binary: true,
                                            // @ts-expect-error  typescript is weird
                                            left: {
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            },
                                            operator: nextToken.operator as unknown as MathOperator,
                                            right: this._parse(options)
                                        });
                                        break;
                                    }
                                    case OperatorType.Greater:
                                    case OperatorType.GreaterOrEqual:
                                    case OperatorType.Less:
                                    case OperatorType.LessOrEqual:
                                    case OperatorType.Equal: { // ? check types now
                                        output.push({
                                            type: ExpressionType.Comparison,
                                            // @ts-expect-error  typescript is weird
                                            left: {
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            },
                                            operator: nextToken.operator as unknown as ComparisonOperator,
                                            right: this._parse(options)
                                        });
                                        break;
                                    }
                                    case OperatorType.LogicalOr:
                                    case OperatorType.LogicalAnd: {
                                        // @ts-expect-error typescript is weird
                                        output.push({
                                            type: ExpressionType.Boolean,
                                            binary: true,
                                            left: {
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            },
                                            operator: nextToken.operator as unknown as BooleanOperator,
                                            right: this._parse(options)
                                        });
                                        break;
                                    }
                                    case OperatorType.Range: {
                                        if (options.parsingArray) {
                                            // @ts-expect-error typescript is weird
                                            output.push({
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            });
                                            exit = true;
                                        } else {
                                            throw SyntaxError('Unexpected ..');
                                        }
                                    }
                                }
                                break;
                            }
                            case TokenType.Punctuation: {
                                switch (nextToken.punctuation) {
                                    case PunctuationType.CloseCurly: {
                                        // @ts-expect-error typescript is weird
                                        output.push({
                                            type: ExpressionType.Literal,
                                            literal: current.literal,
                                            value: current.value
                                        });
                                        exit = true;
                                        break;
                                    }
                                    case PunctuationType.CloseParenthesis: {
                                        if (options.parsingFunctionCallArgs || options.parsingObjectMemberValue) {
                                            // @ts-expect-error typescript is weird
                                            output.push({
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            });
                                            exit = true;
                                            break;
                                        }
                                        throw SyntaxError('Unexpected )');
                                    }
                                    case PunctuationType.CloseSquare: {
                                        if (options.parsingArray) {
                                            // @ts-expect-error typescript is weird
                                            output.push({
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            });
                                            exit = true;
                                            break;
                                        }
                                        throw SyntaxError('Unexpected ]');
                                    }
                                    case PunctuationType.Comma: {
                                        if (options.parsingArray) {
                                            // @ts-expect-error typescript is weird
                                            output.push({
                                                type: ExpressionType.Literal,
                                                literal: current.literal,
                                                value: current.value
                                            });
                                            exit = true;
                                            break;
                                        }
                                        throw SyntaxError('Unexpected ,');
                                    }
                                }
                                break;
                            }
                            case TokenType.Identifier: {
                                throw SyntaxError(`Unexpected identifier ${nextToken.name}`);
                            }
                            case TokenType.Literal: {
                                throw SyntaxError(`Unexpected literal ${nextToken.value}`);
                            }
                        }
                    }
                    break;
                }
                case TokenType.LineFeed: {
                    if (options.parsingObjectMemberValue || options.returnAfterLineFeed) {
                        exit = true;
                        this._tokensReader.next(); // consume line feed
                    }
                    break;
                }
            }
        }
        if (output.length === 0) {
            if (options.parsingObjectMemberValue || options.parsingIfCondition || options.parsingArray || options.parsingForIterator) {
                throw SyntaxError('Expected expression');
            }
            return [];
        } else if (output.length === 1) {
            return output[0];
        } else {
            return output;
        }
    }

    private _handleArray(): OriArray {
        const nextToken = this._tokensReader.peek();
        if (!nextToken) {
            throw SyntaxError('Unexpected end of file');
        }
        if (nextToken.type === TokenType.Operator && nextToken.operator === OperatorType.Range) {
            this._tokensReader.next(); // consume ..
            const to = this._parse({ parsingArray: true });
            const { current } = this._tokensReader;
            if (current.type === TokenType.Punctuation && current.punctuation === PunctuationType.CloseSquare) {
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.Range,
                    to
                };
            }
            if (current.type === TokenType.Operator && current.operator === OperatorType.Range) {
                const step = this._parse({ parsingArray: true });
                // this._expectToBe({
                //     token: 'current',
                //     tokenType: TokenType.Punctuation,
                //     raw: [PunctuationType.CloseSquare]
                // });
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.Range,
                    to,
                    step
                };
            }
            throw SyntaxError('Expected ] or ..');
        }
        const firstExpression = this._parse({ parsingArray: true });
        const { current } = this._tokensReader;
        if (current.type === TokenType.Punctuation) {
            if (current.punctuation === PunctuationType.CloseSquare) {
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.List,
                    values: [firstExpression]
                };
            }
            if (current.punctuation === PunctuationType.Comma) {
                const values: Expression[] = [firstExpression];
                let { current } = this._tokensReader;
                while (current.type === TokenType.Punctuation && current.punctuation === PunctuationType.Comma) {
                    values.push(this._parse({ parsingArray: true }));
                    current = this._tokensReader.current;
                }
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.List,
                    values
                };
                // this._expectToBe({
                //     token: 'current',
                //     tokenType: TokenType.Punctuation,
                //     raw: [PunctuationType.CloseSquare]
                // });
            }
        }
        if (current.type === TokenType.Operator && current.operator === OperatorType.Range) {
            const to = this._parse({ parsingArray: true });
            const { current } = this._tokensReader;
            if (current.type === TokenType.Punctuation && current.punctuation === PunctuationType.CloseSquare) {
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.Range,
                    from: firstExpression,
                    to
                };
            }
            if (current.type === TokenType.Operator && current.operator === OperatorType.Range) {
                const step = this._parse({ parsingArray: true });
                return {
                    type: ExpressionType.Array,
                    array: ArrayType.Range,
                    from: firstExpression,
                    to,
                    step
                };
            }
        }
        throw SyntaxError('Expected ] .. or ,');
    }

    private _getMember(): Member {
        const key = (this._tokensReader.current as Identifier).name;
        this._tokensReader.next(); // consume =
        this._expectToBe({
            token: 'current',
            tokenType: TokenType.Operator,
            raw: [OperatorType.Assign]
        });
        return {
            key,
            value: this._parse({ parsingObjectMemberValue: true, })
        };
    }

    private _handleObjectDeclaration(): OriObject {
        const members: Member[] = [];
        let nextToken: Token | undefined = this._tokensReader.peek();
        if (!nextToken) {
            throw SyntaxError('Unexpected end of file');
        }
        if (nextToken.type === TokenType.LineFeed) {
            this._tokensReader.next(); // consume line feed
            nextToken = this._tokensReader.peek();
        }
        if (!nextToken) {
            throw SyntaxError('Unexpected end of file');
        }
        if (nextToken.type !== TokenType.Identifier && (nextToken.type === TokenType.Punctuation && nextToken.punctuation !== PunctuationType.CloseParenthesis)) {
            throw SyntaxError('Expected identifier or )');
        }
        while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Identifier) {
            this._tokensReader.next(); // consume the identifier
            members.push(this._getMember());
        }
        return {
            type: ExpressionType.Object,
            members
        };
    }

    private _parseWhileLoop(): WhileLoop {
        return {
            type: ExpressionType.WhileLoop,
            condition: this._parse({ parsingWhileCondition: true }),
            body: this._parse()
        };
    }

    private _parseForLoop(): ForLoop {
        const identifier = this._tokensReader.next(); // consume identifier
        this._expectToBe({
            token: 'current',
            tokenType: TokenType.Identifier
        });
        this._tokensReader.next(); // consume in
        this._expectToBe({
            token: 'current',
            tokenType: TokenType.Keyword,
            raw: [KeywordType.In]
        });
        return {
            type: ExpressionType.ForLoop,
            variable: (identifier as Identifier).name,
            iterator: this._parse({ parsingForIterator: true }),
            body: this._parse()
        };
    }

    private _handleKeyword(): Inline {
        switch ((this._tokensReader.current as Keyword).keyword) {
            case KeywordType.Fn: {
                return this._parseFunctionDeclaration();
            }
            case KeywordType.If: {
                return this._parseCondition();
            }
            case KeywordType.While: {
                return this._parseWhileLoop();
            }
            case KeywordType.For: {
                return this._parseForLoop();
            }

            case KeywordType.In:
            case KeywordType.Do:
            case KeywordType.Else:
            case KeywordType.Then: {
                throw SyntaxError(`Unexpected ${(this._tokensReader.current as Keyword).keyword}`);
            }
        }
    }

    private _parseFunctionCallArgs(): Expression[] {
        let nextToken: Token | undefined;
        const args: Expression[] = [];
        do {
            args.push(this._parse({ parsingFunctionCallArgs: true }));
        } while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Punctuation && nextToken.punctuation === PunctuationType.Comma);
        this._expectToBe({
            token: 'next',
            tokenType: TokenType.Punctuation,
            raw: [PunctuationType.CloseParenthesis]
        });
        this._tokensReader.next(); // consume )
        return args;
    }

    private _parseFunctionCall(functionName: string): FunctionCall {
        this._tokensReader.next(); // consume the (
        return {
            type: ExpressionType.FunctionCall,
            func: functionName,
            args: this._parseFunctionCallArgs()
        };
    }

    private _parseFunctionDeclarationArgs(): string[] {
        this._tokensReader.next();
        this._expectToBe({
            token: 'current',
            tokenType: TokenType.Punctuation,
            raw: [PunctuationType.OpenParenthesis]
        });
        const args: string[] = [];
        let nextToken: Token | undefined;
        while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Identifier) {
            args.push((this._tokensReader.next() as Identifier).name);
            const current = this._tokensReader.next();
            this._expectToBe({
                token: 'current',
                tokenType: TokenType.Punctuation,
                raw: [PunctuationType.Comma, PunctuationType.CloseParenthesis] // , or ) if syntax is good
            });
            if ((current as Punctuation).punctuation === PunctuationType.CloseParenthesis) {
                break;
            }
        }
        return args;
    }

    private _parseFunctionDeclaration(): FunctionDeclaration {
        const args: string[] = this._parseFunctionDeclarationArgs();
        const body: Expression = this._parse({ returnAfterLineFeed: true});
        const output: FunctionDeclaration = {
            type: ExpressionType.FunctionDeclaration,
            body
        };
        if (args.length) {
            output.args = args;
        }
        return output;
    }

    private _parseCondition(): Condition {
        const condition: Expression = this._parse({ parsingIfCondition: true });
        const then = this._parse({ parsingIfThen: true });
        const conditionExpression: Condition = {
            type: ExpressionType.Condition,
            if: condition,
            then
        };
        const { current } = this._tokensReader;
        if (current.type === TokenType.Keyword && current.keyword === KeywordType.Else) {
            conditionExpression.else = this._parse({ returnAfterLineFeed: true });
        }
        return conditionExpression;
    }

    private _handleOperatorAndAssign(type: 'math', variableName: string, operator: MathOperator): Assignment;
    private _handleOperatorAndAssign(type: 'boolean', variableName: string, operator: BooleanOperator): Assignment;
    private _handleOperatorAndAssign(type: 'math' | 'boolean', variableName: string, operator: MathOperator | BooleanOperator): Assignment {
        // @ts-expect-error  typescript is weird
        return {
            type: ExpressionType.Assignment,
            variable: variableName,
            value: {
                // @ts-expect-error  typescript is weird
                type: type === 'math' ? ExpressionType.Math : ExpressionType.Boolean,
                binary: true,
                left: {
                    type: ExpressionType.Variable,
                    name: variableName
                },
                operator,
                right: this._parse()
            }
        } satisfies Assignment;
    }

    private _handleIdentifier(options: ParsingOptions = {}): Variable | FunctionCall | Math | Comparison | OriBoolean | Assignment | ArrayAt {
        const name = (this._tokensReader.current as Identifier).name;
        const nextToken = this._tokensReader.next(); // consume identifier
        if (!nextToken) {
            return {
                type: ExpressionType.Variable,
                name
            } as Variable;
        }
        switch (nextToken.type) {
            case TokenType.Keyword: {
                if (!options.parsingIfCondition || nextToken.keyword !== KeywordType.Then) {
                    throw SyntaxError(`Unexpected keyword ${nextToken.keyword}`);
                }
                return {
                    type: ExpressionType.Variable,
                    name
                } as Variable;
            }
            case TokenType.Operator: {
                switch (nextToken.operator) {
                    case OperatorType.Assign: {
                        return {
                            type: ExpressionType.Assignment,
                            variable: name,
                            value: this._parse()
                        } satisfies Assignment;
                    }
                    case OperatorType.Plus:
                    case OperatorType.Minus:
                    case OperatorType.Multiply:
                    case OperatorType.Modulus:
                    case OperatorType.Power:
                    case OperatorType.Divide: {
                        return {
                            type: ExpressionType.Math,
                            binary: true,
                            left: {
                                type: ExpressionType.Variable,
                                name
                            },
                            operator: nextToken.operator as unknown as MathOperator,
                            right: this._parse()
                        } satisfies MathBinary;
                    }
                    case OperatorType.Increment: {
                        return {
                            type: ExpressionType.Assignment,
                            variable: name,
                            value: {
                                type: ExpressionType.Math,
                                binary: true,
                                left: {
                                    type: ExpressionType.Variable,
                                    name
                                },
                                operator: MathOperator.Plus,
                                right: {
                                    type: ExpressionType.Literal,
                                    literal: LiteralType.Number,
                                    value: 1
                                }
                            }
                        } satisfies Assignment;
                    }
                    case OperatorType.Decrement: {
                        return {
                            type: ExpressionType.Assignment,
                            variable: name,
                            value: {
                                type: ExpressionType.Math,
                                binary: true,
                                left: {
                                    type: ExpressionType.Variable,
                                    name
                                },
                                operator: MathOperator.Minus,
                                right: {
                                    type: ExpressionType.Literal,
                                    literal: LiteralType.Number,
                                    value: 1
                                }
                            }
                        } satisfies Assignment;
                    }
                    case OperatorType.PlusAndAssign:
                    case OperatorType.MinusAndAssign:
                    case OperatorType.MultiplyAndAssign:
                    case OperatorType.DivideAndAssign:
                    case OperatorType.PowerAndAssign:
                    case OperatorType.ModulusAndAssign: {
                        return this._handleOperatorAndAssign('math', name, nextToken.operator as unknown as MathOperator);
                    }
                    case OperatorType.Greater:
                    case OperatorType.GreaterOrEqual:
                    case OperatorType.Less:
                    case OperatorType.LessOrEqual:
                    case OperatorType.Equal: {
                        return {
                            type: ExpressionType.Comparison,
                            left: {
                                type: ExpressionType.Variable,
                                name
                            },
                            operator: nextToken.operator as unknown as ComparisonOperator,
                            right: this._parse()
                        } satisfies Comparison;
                    }
                    case OperatorType.LogicalOrAndAssign:
                    case OperatorType.LogicalAndAndAssign: {
                        return this._handleOperatorAndAssign('boolean', name, nextToken.operator as unknown as BooleanOperator);
                    }
                    case OperatorType.LogicalOr:
                    case OperatorType.LogicalAnd: {
                        return {
                            type: ExpressionType.Boolean,
                            binary: true,
                            left: {
                                type: ExpressionType.Variable,
                                name
                            },
                            operator: nextToken.operator as unknown as Exclude<BooleanOperator, BooleanOperator.LogicalNot>,
                            right: this._parse()
                        } satisfies BooleanBinary;
                    }
                    case OperatorType.At: {
                        return {
                            type: ExpressionType.At,
                            variable: name,
                            at: this._parse({ ...options, returnAfterLineFeed: true })
                        } satisfies ArrayAt;
                    }
                    case OperatorType.AccessMember: {
                        // @ts-expect-error don't know how to implement this for now
                        return {
                            type: ExpressionType.Variable,
                            // @ts-expect-error don't know how to implement this for now
                            name: 1
                        } satisfies Variable;
                    }
                    default: {
                        throw SyntaxError(`Unexpected ${nextToken.operator}`);
                    }
                }
            }
            case TokenType.Punctuation: {
                switch (nextToken.punctuation) {
                    case PunctuationType.OpenParenthesis: {
                        return this._parseFunctionCall(name);
                    }
                    default: {
                        throw SyntaxError(`Unexpected ${nextToken.punctuation}`);
                    }
                }
            }
            case TokenType.LineFeed: {
                return {
                    type: ExpressionType.Variable,
                    name
                } satisfies Variable;
            }
            case TokenType.Literal: {
                throw SyntaxError(`Unexpected literal ${nextToken.value}`);
            }
            case TokenType.Identifier: {
                throw SyntaxError(`Unexpected identifier ${nextToken.name}`);
            }
        }
    }
}
