import { ComparisonOperator, ExpressionType, MathOperator, type Expression, type FunctionDeclaration } from "../types/parser2";

enum Type {
    Number = 'number',
    String = 'string',
    Boolean = 'boolean',
    Function = 'function',
}

interface StringVariable {
    type: Type.String,
    value: string
}

interface BooleanVariable {
    type: Type.Boolean,
    value: boolean
}

interface NumberVariable {
    type: Type.Number,
    value: number
}

type RegularVariable = StringVariable | BooleanVariable | NumberVariable;

interface FunctionVariable {
    type: Type.Function,
    args?: string[],
    body: Expression
}

type Variable = RegularVariable | FunctionVariable;

interface StringInfo {
    type: Type.String,
    value: string
}

interface BooleanInfo {
    type: Type.Boolean,
    value: boolean
}

interface NumberInfo {
    type: Type.Number,
    value: number
}

interface FunctionInfo {
    type: Type.Function,
    value: Expression,
    args?: string[]
}

type EvaluationInfo = StringInfo | BooleanInfo | NumberInfo | FunctionInfo;


export default class Interpreter {

    programm: Expression[];
    variables: Map<string, Variable> = new Map();

    constructor(programm: Expression[]) {
        this.programm = programm;
    }

    run() {
        let last;
        for (const expression of this.programm) {
            last = this.evaluate(expression);
        }
        return last;
    }
    // @ts-expect-error
    evaluate(expression: Expression): EvaluationInfo {
        if (Array.isArray(expression)) {
            for (const inline of expression) {
                return this.evaluate(inline);
            }
        } else {
            switch (expression.type) {
                case ExpressionType.Assignment: {
                    const infos = this.evaluate(expression.value);
                    if (infos.type === Type.Function) {
                        this.variables.set(expression.variable, {
                            type: Type.Function,
                            body: expression.value,
                            args: infos.args
                        });
                    } else {
                        this.variables.set(expression.variable, {
                            type: infos.type,
                            // @ts-expect-error
                            value: infos.value
                        });
                    }
                    return infos;
                }
                case ExpressionType.Comparison: {
                    const leftInfos = this.evaluate(expression.left);
                    const rightInfos = this.evaluate(expression.right);
                    if (leftInfos.type !== rightInfos.type) {
                        throw TypeError(`Cannot compare a ${leftInfos.type} and a ${rightInfos.type}`)
                    }
                    switch (expression.operator) {
                        case ComparisonOperator.Equal: {
                            return {
                                type: Type.Boolean,
                                value: leftInfos.value === rightInfos.value
                            }
                        }
                        case ComparisonOperator.NotEqual: {
                            return {
                                type: Type.Boolean,
                                value: leftInfos.value !== rightInfos.value
                            }
                        }
                        case ComparisonOperator.GreaterThan: {
                            if (leftInfos.type !== Type.Number) {
                                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
                            }
                            return {
                                type: Type.Boolean,
                                // @ts-expect-error
                                value: leftInfos.value > rightInfos.value
                            }
                        }
                        case ComparisonOperator.GreaterThanOrEqual: {
                            if (leftInfos.type !== Type.Number) {
                                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
                            }
                            return {
                                type: Type.Boolean,
                                // @ts-expect-error
                                value: leftInfos.value >= rightInfos.value
                            }
                        }
                        case ComparisonOperator.LessThan: {
                            if (leftInfos.type !== Type.Number) {
                                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
                            }
                            return {
                                type: Type.Boolean,
                                // @ts-expect-error
                                value: leftInfos.value < rightInfos.value
                            }
                        }
                        case ComparisonOperator.LessThanOrEqual: {
                            if (leftInfos.type !== Type.Number) {
                                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
                            }
                            return {
                                type: Type.Boolean,
                                // @ts-expect-error
                                value: leftInfos.value <= rightInfos.value
                            }
                        }
                    }
                }
                case ExpressionType.Calculus: {
                    const leftInfos = this.evaluate(expression.left);
                    const rightInfos = this.evaluate(expression.right);
                    if (leftInfos.type !== rightInfos.type && leftInfos.type !== Type.Number) {
                        throw TypeError(`Cannot perform math on a ${leftInfos.type} and a ${rightInfos.type}`)
                    }
                    switch (expression.operator) {
                        case MathOperator.Plus: {
                            return {
                                type: Type.Number,
                                // @ts-expect-error
                                value: leftInfos.value + rightInfos.value
                            }
                        }
                        case MathOperator.Minus: {
                            return {
                                type: Type.Number,
                                // @ts-expect-error
                                value: leftInfos.value - rightInfos.value
                            }
                        }
                        case MathOperator.Multiply: {
                            return {
                                type: Type.Number,
                                // @ts-expect-error
                                value: leftInfos.value * rightInfos.value
                            }
                        }
                        case MathOperator.Divide: {
                            return {
                                type: Type.Number,
                                // @ts-expect-error
                                value: leftInfos.value / rightInfos.value
                            }
                        }
                    }
                }
                case ExpressionType.Literal: {
                    // @ts-expect-error
                    return {
                        type: expression.literal as unknown as Type,
                        value: expression.value
                    }
                }
                case ExpressionType.Variable: {
                    const variable = this.variables.get(expression.name);
                    if (!variable) {
                        throw ReferenceError(`Unknown identifier ${expression.name}`);
                    }
                    if (variable.type === Type.Function) {
                        return {
                            type: Type.Function,
                            value: variable.body
                        }
                    } else {
                        // @ts-expect-error
                        return {
                            type: variable.type,
                            value: variable.value
                        }
                    }
                }
                case ExpressionType.Condition: {
                    const conditionInfos = this.evaluate(expression.condition);
                    if (conditionInfos.type !== Type.Boolean) {
                        throw new TypeError(`Expected boolean in condition, received ${conditionInfos.type}`);
                    }
                    if (conditionInfos.value) {
                        return this.evaluate(expression.true);
                    } else if (expression.false) {
                        return this.evaluate(expression.false);
                    }
                    break;
                }
                case ExpressionType.FunctionCall: {
                    const func = this.variables.get(expression.func) as FunctionVariable | undefined;
                    if (!func) {
                        throw ReferenceError(`Unknown identifier ${expression.func}`);
                    }
                    if ((func.args?.length ?? 0) !== expression.args.length) {
                        throw new RangeError(`Invalid number of arguments for ${expression.func}`);
                    }
                    const backup = new Map<string, Variable>;
                    for (const [i, v] of Object.entries((func.args ?? []) as string[])) {
                        const potentialExisting = this.variables.get(v);
                        if (potentialExisting) {
                            backup.set(v, potentialExisting);
                        }
                        const argInfos = this.evaluate(expression.args[+i]);
                        if (argInfos.type === Type.Function) {
                            this.variables.set(v, {
                                type: Type.Function,
                                body: argInfos.value
                            });
                        } else {
                            this.variables.set(v, {
                                type: argInfos.type,
                                // @ts-expect-error
                                value: argInfos.value
                            });
                        }
                    }
                    const infos = this.evaluate(func.body);
                    for (const [n, v] of backup) {
                        this.variables.set(n, v);
                    }
                    return infos;
                }
                case ExpressionType.FunctionDeclaration: {
                    return {
                        type: Type.Function,
                        value: expression.body,
                        args: expression.args
                    }
                }
            }
        }
    }
}