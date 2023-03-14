import {default as parseFn} from './parse';
import {default as stringifyFn} from './stringify';
export const parse = parseFn;
export const stringify = stringifyFn;
export * from './type';
export * from './CssParseError';
export * from './CssPosition';
export default {parse, stringify};
