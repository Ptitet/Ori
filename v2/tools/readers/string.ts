export default class StringReader {

    private _source: string;
    private _index = -1;
    column = -1;
    row = 0;
    lineFeed = '\n';

    constructor(source: string) {
        this._source = source;
    }

    get current(): string {
        return this._source.at(this._index)!;
    }

    next(): string | undefined {
        this._index++;
        this.column++;
        if (this.current === this.lineFeed) {
            this.column = 0;
            this.row++;
        }
        return this._source.at(this._index);
    }

    peek(n = 1): string | undefined {
        return this._source.at(this._index + n);
    }
}
