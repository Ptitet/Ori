import type { TokenType, PunctuationType, KeywordType, OperatorType } from './tokenizer';


export interface ParsingOptions {
    parsingIfCondition?: boolean;
    parsingFunctionCallArgs?: boolean;
    parsingObjectMemberValue?: boolean;
    parsingWhileCondition?: boolean;
    parsingForIterator?: boolean;
    parsingIfThen?: boolean;
    parsingArray?: boolean;
    returnAfterLineFeed?: boolean;
}
interface ExpectToBeAny {
    token: 'next' | 'current';
    tokenType: Exclude<TokenType, TokenType.Keyword | TokenType.Punctuation>;
}
export interface ExpectToBePunctuation {
    token: 'next' | 'current';
    tokenType: TokenType.Punctuation;
    raw: PunctuationType[];
}
export interface ExpectToBeKeyword {
    token: 'next' | 'current';
    tokenType: TokenType.Keyword;
    raw: KeywordType[];
}
interface ExpectToBeOperator {
    token: 'next' | 'current';
    tokenType: TokenType.Operator;
    raw: OperatorType[];
}
export type ExpectToBeOptions = ExpectToBeAny | ExpectToBePunctuation | ExpectToBeKeyword | ExpectToBeOperator;
