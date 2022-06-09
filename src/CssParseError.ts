export default class CssParseError extends Error {
  readonly reason: string;
  readonly filename?: string;
  readonly line: number;
  readonly column: number;
  readonly source: string;

  constructor(
    filename: string,
    msg: string,
    lineno: number,
    column: number,
    css: string
  ) {
    super(filename + ':' + lineno + ':' + column + ': ' + msg);
    this.reason = msg;
    this.filename = filename;
    this.line = lineno;
    this.column = column;
    this.source = css;
  }
}
