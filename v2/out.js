// types/tokenizer.ts
var TokenType;
(function(TokenType2) {
  TokenType2["Keyword"] = "keyword";
  TokenType2["Identifier"] = "identifier";
  TokenType2["Operator"] = "operator";
  TokenType2["Punctuation"] = "punctuation";
  TokenType2["Literal"] = "literal";
  TokenType2["LineFeed"] = "lineFeed";
})(TokenType || (TokenType = {}));
var KeywordType;
(function(KeywordType2) {
  KeywordType2["Fn"] = "fn";
  KeywordType2["If"] = "if";
  KeywordType2["Then"] = "then";
  KeywordType2["Else"] = "else";
  KeywordType2["While"] = "while";
  KeywordType2["For"] = "for";
  KeywordType2["In"] = "in";
  KeywordType2["Do"] = "do";
})(KeywordType || (KeywordType = {}));
var OperatorType;
(function(OperatorType2) {
  OperatorType2["Assign"] = "=";
  OperatorType2["Plus"] = "+";
  OperatorType2["Increment"] = "++";
  OperatorType2["PlusAndAssign"] = "+=";
  OperatorType2["Minus"] = "-";
  OperatorType2["Decrement"] = "--";
  OperatorType2["MinusAndAssign"] = "-=";
  OperatorType2["Multiply"] = "*";
  OperatorType2["MultiplyAndAssign"] = "*=";
  OperatorType2["Divide"] = "/";
  OperatorType2["DivideAndAssign"] = "/=";
  OperatorType2["Modulus"] = "%";
  OperatorType2["ModulusAndAssign"] = "%=";
  OperatorType2["Power"] = "**";
  OperatorType2["PowerAndAssign"] = "**=";
  OperatorType2["Greater"] = ">";
  OperatorType2["GreaterOrEqual"] = ">=";
  OperatorType2["Less"] = "<";
  OperatorType2["LessOrEqual"] = "<=";
  OperatorType2["Equal"] = "==";
  OperatorType2["LogicalOr"] = "||";
  OperatorType2["LogicalOrAndAssign"] = "||=";
  OperatorType2["LogicalAnd"] = "&&";
  OperatorType2["LogicalAndAndAssign"] = "&&=";
  OperatorType2["LogicalNot"] = "!";
  OperatorType2["At"] = "@";
  OperatorType2["Range"] = "..";
  OperatorType2["AccessMember"] = ".";
})(OperatorType || (OperatorType = {}));
var PunctuationType;
(function(PunctuationType2) {
  PunctuationType2["OpenCurly"] = "{";
  PunctuationType2["CloseCurly"] = "}";
  PunctuationType2["OpenParenthesis"] = "(";
  PunctuationType2["CloseParenthesis"] = ")";
  PunctuationType2["OpenSquare"] = "[";
  PunctuationType2["CloseSquare"] = "]";
  PunctuationType2["Comma"] = ",";
})(PunctuationType || (PunctuationType = {}));
var LiteralType;
(function(LiteralType2) {
  LiteralType2["Boolean"] = "boolean";
  LiteralType2["Number"] = "number";
  LiteralType2["String"] = "string";
})(LiteralType || (LiteralType = {}));

// types/parser.ts
var ExpressionType;
(function(ExpressionType2) {
  ExpressionType2["Assignment"] = "assignment";
  ExpressionType2["Math"] = "math";
  ExpressionType2["FunctionDeclaration"] = "functionDeclaration";
  ExpressionType2["FunctionCall"] = "functionCall";
  ExpressionType2["Condition"] = "condition";
  ExpressionType2["Comparison"] = "comparison";
  ExpressionType2["ForLoop"] = "forLoop";
  ExpressionType2["WhileLoop"] = "whileLoop";
  ExpressionType2["Boolean"] = "boolean";
  ExpressionType2["At"] = "at";
  ExpressionType2["Array"] = "array";
  ExpressionType2["Object"] = "object";
  ExpressionType2["Literal"] = "literal";
  ExpressionType2["Variable"] = "variable";
})(ExpressionType || (ExpressionType = {}));
var MathOperator;
(function(MathOperator2) {
  MathOperator2["Plus"] = "+";
  MathOperator2["Minus"] = "-";
  MathOperator2["Multiply"] = "*";
  MathOperator2["Divide"] = "/";
  MathOperator2["Modulus"] = "%";
  MathOperator2["Exponent"] = "**";
})(MathOperator || (MathOperator = {}));
var ComparisonOperator;
(function(ComparisonOperator2) {
  ComparisonOperator2["Greater"] = ">";
  ComparisonOperator2["GreaterOrEqual"] = ">=";
  ComparisonOperator2["Less"] = "<";
  ComparisonOperator2["LessOrEqual"] = "<=";
  ComparisonOperator2["Equal"] = "==";
})(ComparisonOperator || (ComparisonOperator = {}));
var BooleanOperator;
(function(BooleanOperator2) {
  BooleanOperator2["LogicalOr"] = "||";
  BooleanOperator2["LogicalAnd"] = "&&";
  BooleanOperator2["LogicalNot"] = "!";
})(BooleanOperator || (BooleanOperator = {}));
var ArrayType;
(function(ArrayType2) {
  ArrayType2["Range"] = "range";
  ArrayType2["List"] = "list";
})(ArrayType || (ArrayType = {}));
var program = [
  {
    type: ExpressionType.Assignment,
    variable: "input",
    value: {
      type: ExpressionType.Literal,
      literal: LiteralType.Number,
      value: 0
    }
  },
  {
    type: ExpressionType.Assignment,
    variable: "chosen",
    value: {
      type: ExpressionType.WhileLoop,
      condition: {
        type: ExpressionType.Comparison,
        left: {
          type: ExpressionType.Assignment,
          variable: "inp",
          value: {
            type: ExpressionType.FunctionCall,
            func: "input",
            args: [{
              type: ExpressionType.Literal,
              literal: LiteralType.String,
              value: "number plz"
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
          func: "output",
          args: [{
            type: ExpressionType.Literal,
            literal: LiteralType.String,
            value: "Error : input must be smaller than 3"
          }]
        },
        {
          type: ExpressionType.Variable,
          name: "inp"
        }
      ]
    }
  }
];

// tools/parser.ts
class TokensReader {
  _tokens;
  _index = -1;
  constructor(tokens) {
    this._tokens = tokens;
  }
  get current() {
    return this._tokens.at(this._index);
  }
  next() {
    return this._tokens.at(++this._index);
  }
  peek(n = 1) {
    return this._tokens.at(this._index + n);
  }
}

class Parser {
  _tokensReader;
  constructor(tokens) {
    this._tokensReader = new TokensReader(tokens);
  }
  _expectToBe(options) {
    let tokenToCheck;
    if (options.token === "current") {
      tokenToCheck = this._tokensReader.current;
    } else {
      tokenToCheck = this._tokensReader.peek();
    }
    if (!tokenToCheck) {
      throw SyntaxError("Unexpected end of file");
    }
    if (tokenToCheck.type !== options.tokenType) {
      throw SyntaxError(`Expected ${options.tokenType} received ${tokenToCheck.type}`);
    }
    if (tokenToCheck.type === TokenType.Punctuation && !options.raw.includes(tokenToCheck.punctuation)) {
      const formatter = new Intl.ListFormat("en-US", { type: "conjunction" });
      throw SyntaxError(`Expected ${formatter.format(options.raw)} received ${tokenToCheck.punctuation}`);
    } else if (tokenToCheck.type === TokenType.Keyword && !options.raw.includes(tokenToCheck.keyword)) {
      const formatter = new Intl.ListFormat("en-US", { type: "conjunction" });
      throw SyntaxError(`Expected ${formatter.format(options.raw)} received ${tokenToCheck.keyword}`);
    }
  }
  parse() {
    return this._parse();
  }
  _parse(options = {}) {
    const output = [];
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
                throw SyntaxError("Unexpected )");
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
                throw SyntaxError("Unexpected ]");
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
            output.push({
              type: ExpressionType.Literal,
              literal: current.literal,
              value: current.value
            });
          } else {
            switch (nextToken.type) {
              case TokenType.Keyword: {
                if (nextToken.keyword === KeywordType.Do && options.parsingWhileCondition) {
                  output.push({
                    type: ExpressionType.Literal,
                    literal: current.literal,
                    value: current.value
                  });
                  exit = true;
                  this._tokensReader.next();
                } else if (nextToken.keyword === KeywordType.Else) {
                  output.push({
                    type: ExpressionType.Literal,
                    literal: current.literal,
                    value: current.value
                  });
                  exit = true;
                } else if (nextToken.keyword === KeywordType.Then && options.parsingIfCondition) {
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
                      left: {
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      },
                      operator: nextToken.operator,
                      right: this._parse(options)
                    });
                    break;
                  }
                  case OperatorType.Greater:
                  case OperatorType.GreaterOrEqual:
                  case OperatorType.Less:
                  case OperatorType.LessOrEqual:
                  case OperatorType.Equal: {
                    output.push({
                      type: ExpressionType.Comparison,
                      left: {
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      },
                      operator: nextToken.operator,
                      right: this._parse(options)
                    });
                    break;
                  }
                  case OperatorType.LogicalOr:
                  case OperatorType.LogicalAnd: {
                    output.push({
                      type: ExpressionType.Boolean,
                      binary: true,
                      left: {
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      },
                      operator: nextToken.operator,
                      right: this._parse(options)
                    });
                    break;
                  }
                  case OperatorType.Range: {
                    if (options.parsingArray) {
                      output.push({
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      });
                      exit = true;
                    } else {
                      throw SyntaxError("Unexpected ..");
                    }
                  }
                }
                break;
              }
              case TokenType.Punctuation: {
                switch (nextToken.punctuation) {
                  case PunctuationType.CloseCurly: {
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
                      output.push({
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      });
                      exit = true;
                      break;
                    }
                    throw SyntaxError("Unexpected )");
                  }
                  case PunctuationType.CloseSquare: {
                    if (options.parsingArray) {
                      output.push({
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      });
                      exit = true;
                      break;
                    }
                    throw SyntaxError("Unexpected ]");
                  }
                  case PunctuationType.Comma: {
                    if (options.parsingArray) {
                      output.push({
                        type: ExpressionType.Literal,
                        literal: current.literal,
                        value: current.value
                      });
                      exit = true;
                      break;
                    }
                    throw SyntaxError("Unexpected ,");
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
            this._tokensReader.next();
          }
          break;
        }
      }
    }
    if (output.length === 0) {
      if (options.parsingObjectMemberValue || options.parsingIfCondition || options.parsingArray || options.parsingForIterator) {
        throw SyntaxError("Expected expression");
      }
      return [];
    } else if (output.length === 1) {
      return output[0];
    } else {
      return output;
    }
  }
  _handleArray() {
    let nextToken = this._tokensReader.peek();
    if (!nextToken) {
      throw SyntaxError("Unexpected end of file");
    }
    if (nextToken.type === TokenType.Operator && nextToken.operator === OperatorType.Range) {
      this._tokensReader.next();
      const to = this._parse({ parsingArray: true });
      const { current: current2 } = this._tokensReader;
      if (current2.type === TokenType.Punctuation && current2.punctuation === PunctuationType.CloseSquare) {
        return {
          type: ExpressionType.Array,
          array: ArrayType.Range,
          to
        };
      }
      if (current2.type === TokenType.Operator && current2.operator === OperatorType.Range) {
        const step = this._parse({ parsingArray: true });
        return {
          type: ExpressionType.Array,
          array: ArrayType.Range,
          to,
          step
        };
      }
      throw SyntaxError("Expected ] or ..");
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
        const values = [firstExpression];
        let current2;
        while ((current2 = this._tokensReader.current) && current2.type === TokenType.Punctuation && current2.punctuation === PunctuationType.Comma) {
          values.push(this._parse({ parsingArray: true }));
        }
        return {
          type: ExpressionType.Array,
          array: ArrayType.List,
          values
        };
      }
    }
    if (current.type === TokenType.Operator && current.operator === OperatorType.Range) {
      const to = this._parse({ parsingArray: true });
      const { current: current2 } = this._tokensReader;
      if (current2.type === TokenType.Punctuation && current2.punctuation === PunctuationType.CloseSquare) {
        return {
          type: ExpressionType.Array,
          array: ArrayType.Range,
          from: firstExpression,
          to
        };
      }
      if (current2.type === TokenType.Operator && current2.operator === OperatorType.Range) {
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
    throw SyntaxError("Expected ] .. or ,");
  }
  _getMember() {
    const key = this._tokensReader.current.name;
    this._tokensReader.next();
    this._expectToBe({
      token: "current",
      tokenType: TokenType.Operator,
      raw: [OperatorType.Assign]
    });
    return {
      key,
      value: this._parse({ parsingObjectMemberValue: true })
    };
  }
  _handleObjectDeclaration() {
    const members = [];
    let nextToken = this._tokensReader.peek();
    if (!nextToken) {
      throw SyntaxError("Unexpected end of file");
    }
    if (nextToken.type === TokenType.LineFeed) {
      this._tokensReader.next();
      nextToken = this._tokensReader.peek();
    }
    if (!nextToken) {
      throw SyntaxError("Unexpected end of file");
    }
    if (nextToken.type !== TokenType.Identifier && (nextToken.type === TokenType.Punctuation && nextToken.punctuation !== PunctuationType.CloseParenthesis)) {
      throw SyntaxError("Expected identifier or )");
    }
    while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Identifier) {
      this._tokensReader.next();
      members.push(this._getMember());
    }
    return {
      type: ExpressionType.Object,
      members
    };
  }
  _parseWhileLoop() {
    return {
      type: ExpressionType.WhileLoop,
      condition: this._parse({ parsingWhileCondition: true }),
      body: this._parse()
    };
  }
  _parseForLoop() {
    const identifier = this._tokensReader.next();
    this._expectToBe({
      token: "current",
      tokenType: TokenType.Identifier
    });
    this._tokensReader.next();
    this._expectToBe({
      token: "current",
      tokenType: TokenType.Keyword,
      raw: [KeywordType.In]
    });
    return {
      type: ExpressionType.ForLoop,
      variable: identifier.name,
      iterator: this._parse({ parsingForIterator: true }),
      body: this._parse()
    };
  }
  _handleKeyword() {
    switch (this._tokensReader.current.keyword) {
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
        throw SyntaxError(`Unexpected ${this._tokensReader.current.keyword}`);
      }
    }
  }
  _parseFunctionCallArgs() {
    let nextToken;
    const args = [];
    do {
      args.push(this._parse({ parsingFunctionCallArgs: true }));
    } while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Punctuation && nextToken.punctuation === PunctuationType.Comma);
    this._expectToBe({
      token: "next",
      tokenType: TokenType.Punctuation,
      raw: [PunctuationType.CloseParenthesis]
    });
    this._tokensReader.next();
    return args;
  }
  _parseFunctionCall(functionName) {
    this._tokensReader.next();
    return {
      type: ExpressionType.FunctionCall,
      func: functionName,
      args: this._parseFunctionCallArgs()
    };
  }
  _parseFunctionDeclarationArgs() {
    this._expectToBe({
      token: "next",
      tokenType: TokenType.Punctuation,
      raw: [PunctuationType.OpenParenthesis]
    });
    this._tokensReader.next();
    const args = [];
    let nextToken;
    while ((nextToken = this._tokensReader.peek()) && nextToken.type === TokenType.Identifier) {
      args.push(this._tokensReader.next().name);
      this._expectToBe({
        token: "next",
        tokenType: TokenType.Punctuation,
        raw: [PunctuationType.Comma, PunctuationType.CloseParenthesis]
      });
      this._tokensReader.next();
      if (this._tokensReader.current.punctuation === PunctuationType.CloseParenthesis) {
        break;
      }
    }
    return args;
  }
  _parseFunctionDeclaration() {
    const args = this._parseFunctionDeclarationArgs();
    const body = this._parse();
    const output = {
      type: ExpressionType.FunctionDeclaration,
      body
    };
    if (args.length) {
      output.args = args;
    }
    return output;
  }
  _parseCondition() {
    const condition = this._parse({ parsingIfCondition: true });
    const then = this._parse({ parsingIfThen: true });
    const conditionExpression = {
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
  _handleOperatorAndAssign(type, variableName, operator) {
    return {
      type: ExpressionType.Assignment,
      variable: variableName,
      value: {
        type: type === "math" ? ExpressionType.Math : ExpressionType.Boolean,
        binary: true,
        left: {
          type: ExpressionType.Variable,
          name: variableName
        },
        operator,
        right: this._parse()
      }
    };
  }
  _handleIdentifier(options = {}) {
    const name = this._tokensReader.current.name;
    const nextToken = this._tokensReader.next();
    if (!nextToken) {
      return {
        type: ExpressionType.Variable,
        name
      };
    }
    switch (nextToken.type) {
      case TokenType.Keyword: {
        if (!options.parsingIfCondition || nextToken.keyword !== KeywordType.Then) {
          throw SyntaxError(`Unexpected keyword ${nextToken.keyword}`);
        }
        return {
          type: ExpressionType.Variable,
          name
        };
      }
      case TokenType.Operator: {
        switch (nextToken.operator) {
          case OperatorType.Assign: {
            return {
              type: ExpressionType.Assignment,
              variable: name,
              value: this._parse()
            };
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
              operator: nextToken.operator,
              right: this._parse()
            };
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
            };
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
            };
          }
          case OperatorType.PlusAndAssign:
          case OperatorType.MinusAndAssign:
          case OperatorType.MultiplyAndAssign:
          case OperatorType.DivideAndAssign:
          case OperatorType.PowerAndAssign:
          case OperatorType.ModulusAndAssign: {
            return this._handleOperatorAndAssign("math", name, nextToken.operator);
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
              operator: nextToken.operator,
              right: this._parse()
            };
          }
          case OperatorType.LogicalOrAndAssign:
          case OperatorType.LogicalAndAndAssign: {
            return this._handleOperatorAndAssign("boolean", name, nextToken.operator);
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
              operator: nextToken.operator,
              right: this._parse()
            };
          }
          case OperatorType.At: {
            return {
              type: ExpressionType.At,
              variable: name,
              at: this._parse({ ...options, returnAfterLineFeed: true })
            };
          }
          case OperatorType.AccessMember: {
            return {
              type: ExpressionType.Variable,
              name: 1
            };
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
        };
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

// tools/tokenizer.ts
class StringReader {
  _source;
  _index = -1;
  column = -1;
  row = 0;
  lineFeed = "\n";
  constructor(source) {
    this._source = source;
  }
  get current() {
    return this._source.at(this._index);
  }
  next() {
    this._index++;
    this.column++;
    if (this.current === this.lineFeed) {
      this.column = 0;
      this.row++;
    }
    return this._source.at(this._index);
  }
  peek(n = 1) {
    return this._source.at(this._index + n);
  }
}
var CharType;
(function(CharType2) {
  CharType2["Letter"] = "letter";
  CharType2["Operator"] = "operator";
  CharType2["Punctuation"] = "punctuation";
  CharType2["Digit"] = "digit";
  CharType2["LineFeed"] = "lineFeed";
  CharType2["Space"] = "space";
  CharType2["Comment"] = "comment";
})(CharType || (CharType = {}));

class Tokenizer {
  _stringReader;
  _tokens = [];
  _letterRegex = /[a-zA-Z_]/;
  _punctuationChars = Object.values(PunctuationType);
  _digitRegex = /\d/;
  _lineFeed;
  _space = " ";
  _keywords = Object.values(KeywordType);
  _booleanLiterals = ["true", "false"];
  _allowedCharTypesForIdentifiers = [CharType.Letter, CharType.Digit];
  _quotes = ['"', "'"];
  _comment = ";";
  _operators = Object.values(OperatorType);
  _operatorsFirstChar = this._operators.map((operator) => operator.charAt(0));
  constructor(source) {
    this._stringReader = new StringReader(source);
    this._lineFeed = this._stringReader.lineFeed;
  }
  tokenize() {
    while (this._stringReader.next()) {
      switch (this._getCharType()) {
        case CharType.Letter: {
          this._getIdentifierOrKeywordOrBooleanLiteral();
          break;
        }
        case CharType.Operator: {
          this._getOperator();
          break;
        }
        case CharType.Punctuation: {
          const { current } = this._stringReader;
          if (this._quotes.includes(current)) {
            this._getStringLiteral();
          } else {
            this._tokens.push({
              type: TokenType.Punctuation,
              punctuation: this._stringReader.current
            });
          }
          break;
        }
        case CharType.Digit: {
          this._getNumberLiteral();
          break;
        }
        case CharType.LineFeed: {
          this._tokens.push({
            type: TokenType.LineFeed
          });
          break;
        }
        case CharType.Comment: {
          this._skipComment();
          break;
        }
      }
    }
    return this._tokens;
  }
  _getCharType(char) {
    char ??= this._stringReader.current;
    if (this._letterRegex.test(char)) {
      return CharType.Letter;
    } else if (this._punctuationChars.includes(char)) {
      return CharType.Punctuation;
    } else if (this._digitRegex.test(char)) {
      return CharType.Digit;
    } else if (char === this._lineFeed) {
      return CharType.LineFeed;
    } else if (char === this._space) {
      return CharType.Space;
    } else if (char === this._comment) {
      return CharType.Comment;
    } else if (this._operatorsFirstChar.includes(char)) {
      return CharType.Operator;
    } else {
      throw SyntaxError(`Bad character ${char} at ${this._stringReader.row}:${this._stringReader.column}`);
    }
  }
  _getIdentifierOrKeywordOrBooleanLiteral() {
    let value = this._stringReader.current;
    let nextChar;
    while ((nextChar = this._stringReader.peek()) && this._allowedCharTypesForIdentifiers.includes(this._getCharType(nextChar))) {
      value += this._stringReader.next();
    }
    const isBooleanLiteral = this._booleanLiterals.includes(value);
    if (isBooleanLiteral) {
      this._tokens.push({
        type: TokenType.Literal,
        literal: LiteralType.Boolean,
        value: value === "true"
      });
      return;
    }
    const isKeyword = this._keywords.includes(value);
    if (isKeyword) {
      this._tokens.push({
        type: TokenType.Keyword,
        keyword: value
      });
    } else {
      this._tokens.push({
        type: TokenType.Identifier,
        name: value
      });
    }
  }
  _getOperator() {
    let value = this._stringReader.current;
    let nextChar;
    while ((nextChar = this._stringReader.peek()) && this._getCharType(nextChar) === CharType.Operator) {
      value += this._stringReader.next();
    }
    if (!this._operators.includes(value)) {
      throw SyntaxError(`Unknown operator ${value} at ${this._stringReader.row}:${this._stringReader.column}`);
    }
    this._tokens.push({
      type: TokenType.Operator,
      operator: value
    });
  }
  _getNumberLiteral() {
    let value = this._stringReader.current;
    let nextChar;
    let dotHit = false;
    while ((nextChar = this._stringReader.peek()) && (this._getCharType(nextChar) === CharType.Digit || nextChar === ".")) {
      if (nextChar === ".") {
        if (this._stringReader.peek(2) === ".") {
          break;
        }
        if (dotHit) {
          throw SyntaxError(`Unexpected . at ${this._stringReader.row}:${this._stringReader.column + 1}`);
        } else {
          dotHit = true;
        }
      }
      value += this._stringReader.next();
    }
    this._tokens.push({
      type: TokenType.Literal,
      literal: LiteralType.Number,
      value: Number.parseFloat(value)
    });
  }
  _getStringLiteral() {
    let openQuote = this._stringReader.current;
    let value = "";
    let nextChar;
    while ((nextChar = this._stringReader.peek()) && nextChar !== openQuote) {
      value += this._stringReader.next();
    }
    if (!nextChar) {
      throw SyntaxError(`Expected string to be closed at ${this._stringReader.row}:${this._stringReader.column + 1}`);
    }
    this._tokens.push({
      type: TokenType.Literal,
      literal: LiteralType.String,
      value
    });
    this._stringReader.next();
  }
  _skipComment() {
    let nextChar;
    while ((nextChar = this._stringReader.peek()) && this._getCharType(nextChar) !== CharType.LineFeed) {
      this._stringReader.next();
    }
  }
}

// index.ts
var programs = [
  "1 + 3",
  "1 / 2 + 3 / 4",
  "1 + {2 / 3}",
  "[1, 3 + 2]",
  "[0..3]",
  "[..3]",
  "[..3..1]",
  "[1..4..2]",
  `{
        a = 1
    }`,
  "fn (a, b) a + b",
  "fn (a, b) { a + b }",
  "fn () 1",
  "if true then true",
  "if { 1 + 1 } true else false",
  "if true { true } else false"
];
var index = 9;
var tokenizer5 = new Tokenizer(programs[index]);
var tokens = tokenizer5.tokenize();
console.log(tokens);
var parser3 = new Parser(tokens);
var ast = parser3.parse();
console.log(ast);
