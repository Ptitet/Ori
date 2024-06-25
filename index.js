// interpreter.ts
var CharType;
(function(CharType2) {
  CharType2[CharType2["PunctuationOrQuote"] = 0] = "PunctuationOrQuote";
  CharType2[CharType2["Letter"] = 1] = "Letter";
  CharType2[CharType2["Digit"] = 2] = "Digit";
  CharType2[CharType2["Space"] = 3] = "Space";
  CharType2[CharType2["Operator"] = 4] = "Operator";
  CharType2[CharType2["EOF"] = 5] = "EOF";
})(CharType || (CharType = {}));

class Tokenizer {
  index = 0;
  row = 0;
  column = 0;
  current;
  input;
  constructor(input) {
    this.input = input;
    this.current = input.charAt(0);
  }
  next() {
    this.row++;
    let nextChar = this.input.charAt(++this.index);
    if (nextChar === "\n") {
      this.column++;
      this.row = 0;
    }
    this.current = nextChar;
    return nextChar;
  }
  peek() {
    return this.input.charAt(this.index + 1);
  }
  getCharType(input) {
    const char = input ?? this.current;
    const punctuationsOrQuote = ["(", ")", "{", "}", "'", '"'];
    const regularRegex = /[a-zA-Z_]/;
    if (punctuationsOrQuote.includes(char)) {
      return CharType.PunctuationOrQuote;
    } else if (regularRegex.test(char)) {
      return CharType.Letter;
    } else if (["\n", " "].includes(char)) {
      return CharType.Space;
    } else if (char === "") {
      return CharType.EOF;
    } else if (!Number.isNaN(Number.parseInt(char))) {
      return CharType.Digit;
    } else {
      return CharType.Operator;
    }
  }
  tokenize() {
    const tokens = [];
    let charType;
    while ((charType = this.getCharType()) !== CharType.EOF) {
      switch (charType) {
        case CharType.PunctuationOrQuote: {
          if (["'", '"'].includes(this.current)) {
            tokens.push(this.getStringLitteral());
          } else {
            tokens.push({
              type: TokenType.Punctuation,
              punctuation: this.current
            });
            this.next();
          }
          break;
        }
        case CharType.Digit: {
          tokens.push(this.getNumberLitteral());
          break;
        }
        case CharType.Letter: {
          tokens.push(this.getIdentifierOrKeyword());
          break;
        }
        case CharType.Space: {
          this.next();
          continue;
        }
        case CharType.Operator: {
          tokens.push(this.getOperator());
          break;
        }
      }
    }
    return tokens;
  }
  getStringLitteral() {
    let opener = this.current;
    let value = "";
    while (this.peek() !== opener) {
      value += this.next();
    }
    this.next();
    this.next();
    return {
      type: TokenType.Litteral,
      litteral: LitteralType.String,
      value
    };
  }
  getNumberLitteral() {
    let value = this.current;
    let dotHit = false;
    let currentChar;
    while (this.getCharType(currentChar = this.peek()) === CharType.Digit || currentChar === "." && !dotHit) {
      value += this.next();
    }
    return {
      type: TokenType.Litteral,
      litteral: LitteralType.Number,
      value: Number.parseFloat(value)
    };
  }
  getOperator() {
    let operator = this.current;
    while (this.getCharType(this.peek()) === CharType.Operator) {
      operator += this.next();
    }
    this.next();
    return {
      type: TokenType.Operator,
      operator
    };
  }
  getIdentifierOrKeyword() {
    let value = this.current;
    while (this.getCharType(this.peek()) === CharType.Letter) {
      value += this.next();
    }
    this.next();
    const keywords = ["if", "then", "else", "fn"];
    if (keywords.includes(value)) {
      return {
        type: TokenType.Keyword,
        keyword: value
      };
    } else {
      return {
        type: TokenType.Identifier,
        name: value
      };
    }
  }
}
var TokenType;
(function(TokenType2) {
  TokenType2[TokenType2["Identifier"] = 0] = "Identifier";
  TokenType2[TokenType2["Litteral"] = 1] = "Litteral";
  TokenType2[TokenType2["Punctuation"] = 2] = "Punctuation";
  TokenType2[TokenType2["Operator"] = 3] = "Operator";
  TokenType2[TokenType2["Keyword"] = 4] = "Keyword";
})(TokenType || (TokenType = {}));
var LitteralType;
(function(LitteralType2) {
  LitteralType2[LitteralType2["String"] = 0] = "String";
  LitteralType2[LitteralType2["Number"] = 1] = "Number";
  LitteralType2[LitteralType2["Boolean"] = 2] = "Boolean";
})(LitteralType || (LitteralType = {}));
var PunctuationType;
(function(PunctuationType2) {
  PunctuationType2["OpenParenthesis"] = "(";
  PunctuationType2["CloseParenthesis"] = ")";
  PunctuationType2["OpenBracket"] = "{";
  PunctuationType2["CloseBracket"] = "}";
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
})(OperatorType || (OperatorType = {}));
var KeywordType;
(function(KeywordType2) {
  KeywordType2["If"] = "if";
  KeywordType2["Then"] = "then";
  KeywordType2["Else"] = "else";
  KeywordType2["Function"] = "fn";
})(KeywordType || (KeywordType = {}));
var programString = `
input = in('age ? ')
age_max = 18

if { input > age_max } then {
    out('Youre an adult')
} else {
    out('Youre not an adult')
}

if { let i = 1; i > 0 } then {

}
`;
var tokenizer = new Tokenizer(programString);
var tokens = tokenizer.tokenize();
console.log(tokens);
