// ESM
import {parse, stringify} from '@adobe/css-tools';
const css = "foo {bar: 'baz';}";
console.log('Input:');
console.dir(css);
console.log('Example of parse:');
const parsed = parse(css);
console.dir(parsed);
console.log('Example of stringify:');
console.dir(stringify(parsed, {indent: true}));
