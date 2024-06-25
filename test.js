// types/tokenizer.ts
var CharType;
(function(CharType2) {
  CharType2[CharType2["Punctuation"] = 0] = "Punctuation";
  CharType2[CharType2["Quote"] = 1] = "Quote";
  CharType2[CharType2["Letter"] = 2] = "Letter";
  CharType2[CharType2["Digit"] = 3] = "Digit";
  CharType2[CharType2["Space"] = 4] = "Space";
  CharType2[CharType2["Operator"] = 5] = "Operator";
  CharType2[CharType2["EOF"] = 6] = "EOF";
  CharType2[CharType2["LineFeed"] = 7] = "LineFeed";
})(CharType || (CharType = {}));
var TokenType;
(function(TokenType2) {
  TokenType2["Identifier"] = "identifier";
  TokenType2["Literal"] = "litteral";
  TokenType2["Punctuation"] = "punctuation";
  TokenType2["Operator"] = "operator";
  TokenType2["Keyword"] = "keyword";
  TokenType2["LineFeed"] = "linefeed";
})(TokenType || (TokenType = {}));
var LiteralType;
(function(LiteralType2) {
  LiteralType2["String"] = "string";
  LiteralType2["Number"] = "number";
  LiteralType2["Boolean"] = "boolean";
})(LiteralType || (LiteralType = {}));
var PunctuationType;
(function(PunctuationType2) {
  PunctuationType2["OpenParenthesis"] = "(";
  PunctuationType2["CloseParenthesis"] = ")";
  PunctuationType2["OpenBracket"] = "{";
  PunctuationType2["CloseBracket"] = "}";
  PunctuationType2["Comma"] = ",";
})(PunctuationType || (PunctuationType = {}));
var OperatorType;
(function(OperatorType2) {
  OperatorType2["Assignment"] = "=";
  OperatorType2["GreaterThan"] = ">";
  OperatorType2["GreaterThanOrEqual"] = ">=";
  OperatorType2["LessThan"] = "<";
  OperatorType2["LessThanOrEqual"] = "<=";
  OperatorType2["Equal"] = "==";
  OperatorType2["NotEqual"] = "!=";
  OperatorType2["Plus"] = "+";
  OperatorType2["Minus"] = "-";
  OperatorType2["Multiply"] = "*";
  OperatorType2["Divide"] = "/";
})(OperatorType || (OperatorType = {}));
var KeywordType;
(function(KeywordType2) {
  KeywordType2["If"] = "if";
  KeywordType2["Then"] = "then";
  KeywordType2["Else"] = "else";
  KeywordType2["Function"] = "fn";
})(KeywordType || (KeywordType = {}));

// types/parser2.ts
var ExpressionType;
(function(ExpressionType2) {
  ExpressionType2["Assignment"] = "assignment";
  ExpressionType2["Condition"] = "condition";
  ExpressionType2["FunctionCall"] = "functionCall";
  ExpressionType2["Comparison"] = "comparison";
  ExpressionType2["Literal"] = "literal";
  ExpressionType2["Variable"] = "variable";
  ExpressionType2["Calculus"] = "calculus";
  ExpressionType2["FunctionDeclaration"] = "functionDeclaration";
})(ExpressionType || (ExpressionType = {}));
var ComparisonOperator;
(function(ComparisonOperator2) {
  ComparisonOperator2["Equal"] = "==";
  ComparisonOperator2["NotEqual"] = "!=";
  ComparisonOperator2["GreaterThan"] = ">";
  ComparisonOperator2["GreaterThanOrEqual"] = ">=";
  ComparisonOperator2["LessThan"] = "<";
  ComparisonOperator2["LessThanOrEqual"] = "<=";
})(ComparisonOperator || (ComparisonOperator = {}));
var MathOperator;
(function(MathOperator2) {
  MathOperator2["Plus"] = "+";
  MathOperator2["Minus"] = "-";
  MathOperator2["Multiply"] = "*";
  MathOperator2["Divide"] = "/";
})(MathOperator || (MathOperator = {}));
var program = [
  {
    type: ExpressionType.Assignment,
    variable: "check",
    value: {
      type: ExpressionType.FunctionDeclaration,
      args: ["age_max"],
      body: [
        {
          type: ExpressionType.Assignment,
          variable: "input",
          value: {
            type: ExpressionType.FunctionCall,
            func: "in",
            args: [{
              type: ExpressionType.Literal,
              literal: LiteralType.String,
              value: "age ? "
            }]
          }
        },
        {
          type: ExpressionType.Condition,
          condition: {
            type: ExpressionType.Comparison,
            left: {
              type: ExpressionType.Variable,
              name: "input"
            },
            operator: ComparisonOperator.LessThanOrEqual,
            right: {
              type: ExpressionType.Variable,
              name: "age_max"
            }
          },
          true: {
            type: ExpressionType.FunctionCall,
            func: "out",
            args: [{
              type: ExpressionType.Literal,
              literal: LiteralType.String,
              value: "Adult"
            }]
          },
          false: {
            type: ExpressionType.FunctionCall,
            func: "out",
            args: [{
              type: ExpressionType.Literal,
              literal: LiteralType.String,
              value: "Child"
            }]
          }
        }
      ]
    }
  },
  {
    type: ExpressionType.Assignment,
    variable: "age_max",
    value: {
      type: ExpressionType.Literal,
      literal: LiteralType.Number,
      value: 18
    }
  },
  {
    type: ExpressionType.FunctionCall,
    func: "check",
    args: [{
      type: ExpressionType.Variable,
      name: "age_max"
    }]
  }
];

// tools/interpreter.ts
var Type;
(function(Type2) {
  Type2["Number"] = "number";
  Type2["String"] = "string";
  Type2["Boolean"] = "boolean";
  Type2["Function"] = "function";
})(Type || (Type = {}));

class Interpreter {
  programm;
  variables = new Map;
  constructor(programm) {
    this.programm = programm;
  }
  run() {
    let last;
    for (const expression of this.programm) {
      last = this.evaluate(expression);
    }
    return last;
  }
  evaluate(expression) {
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
              value: infos.value
            });
          }
          return infos;
        }
        case ExpressionType.Comparison: {
          const leftInfos = this.evaluate(expression.left);
          const rightInfos = this.evaluate(expression.right);
          if (leftInfos.type !== rightInfos.type) {
            throw TypeError(`Cannot compare a ${leftInfos.type} and a ${rightInfos.type}`);
          }
          switch (expression.operator) {
            case ComparisonOperator.Equal: {
              return {
                type: Type.Boolean,
                value: leftInfos.value === rightInfos.value
              };
            }
            case ComparisonOperator.NotEqual: {
              return {
                type: Type.Boolean,
                value: leftInfos.value !== rightInfos.value
              };
            }
            case ComparisonOperator.GreaterThan: {
              if (leftInfos.type !== Type.Number) {
                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
              }
              return {
                type: Type.Boolean,
                value: leftInfos.value > rightInfos.value
              };
            }
            case ComparisonOperator.GreaterThanOrEqual: {
              if (leftInfos.type !== Type.Number) {
                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
              }
              return {
                type: Type.Boolean,
                value: leftInfos.value >= rightInfos.value
              };
            }
            case ComparisonOperator.LessThan: {
              if (leftInfos.type !== Type.Number) {
                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
              }
              return {
                type: Type.Boolean,
                value: leftInfos.value < rightInfos.value
              };
            }
            case ComparisonOperator.LessThanOrEqual: {
              if (leftInfos.type !== Type.Number) {
                throw TypeError(`Expected two numbers, received ${leftInfos.type} and ${rightInfos.type}`);
              }
              return {
                type: Type.Boolean,
                value: leftInfos.value <= rightInfos.value
              };
            }
          }
        }
        case ExpressionType.Calculus: {
          const leftInfos = this.evaluate(expression.left);
          const rightInfos = this.evaluate(expression.right);
          if (leftInfos.type !== rightInfos.type && leftInfos.type !== Type.Number) {
            throw TypeError(`Cannot perform math on a ${leftInfos.type} and a ${rightInfos.type}`);
          }
          switch (expression.operator) {
            case MathOperator.Plus: {
              return {
                type: Type.Number,
                value: leftInfos.value + rightInfos.value
              };
            }
            case MathOperator.Minus: {
              return {
                type: Type.Number,
                value: leftInfos.value - rightInfos.value
              };
            }
            case MathOperator.Multiply: {
              return {
                type: Type.Number,
                value: leftInfos.value * rightInfos.value
              };
            }
            case MathOperator.Divide: {
              return {
                type: Type.Number,
                value: leftInfos.value / rightInfos.value
              };
            }
          }
        }
        case ExpressionType.Literal: {
          return {
            type: expression.literal,
            value: expression.value
          };
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
            };
          } else {
            return {
              type: variable.type,
              value: variable.value
            };
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
          const func = this.variables.get(expression.func);
          if (!func) {
            throw ReferenceError(`Unknown identifier ${expression.func}`);
          }
          if ((func.args?.length ?? 0) !== expression.args.length) {
            throw new RangeError(`Invalid number of arguments for ${expression.func}`);
          }
          const backup = new Map;
          for (const [i, v] of Object.entries(func.args ?? [])) {
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
          };
        }
      }
    }
  }
}

// test.ts
var program2 = [
  {
    type: ExpressionType.Assignment,
    variable: "check",
    value: {
      type: ExpressionType.FunctionDeclaration,
      args: ["age_max"],
      body: [
        {
          type: ExpressionType.Assignment,
          variable: "input",
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
              name: "input"
            },
            operator: ComparisonOperator.GreaterThanOrEqual,
            right: {
              type: ExpressionType.Variable,
              name: "age_max"
            }
          },
          true: {
            type: ExpressionType.Literal,
            literal: LiteralType.String,
            value: "Adult"
          },
          false: {
            type: ExpressionType.Literal,
            literal: LiteralType.String,
            value: "Child"
          }
        }
      ]
    }
  },
  {
    type: ExpressionType.Assignment,
    variable: "age_max",
    value: {
      type: ExpressionType.Literal,
      literal: LiteralType.Number,
      value: 18
    }
  },
  {
    type: ExpressionType.FunctionCall,
    func: "check",
    args: [{
      type: ExpressionType.Variable,
      name: "age_max"
    }]
  }
];
var interpreter2 = new Interpreter(program2);
console.log(interpreter2.run());
