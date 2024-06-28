import type { Token } from '../../types/tokenizer';

export default class TokensReader {

    private _tokens: Token[];
    private _index = -1;

    constructor(tokens: Token[]) {
        this._tokens = tokens;
    }

    get current(): Token {
        return this._tokens.at(this._index)!;
    }

    next(): Token | undefined {
        return this._tokens.at(++this._index);
    }

    peek(n = 1): Token | undefined {
        return this._tokens.at(this._index + n);
    }
}
