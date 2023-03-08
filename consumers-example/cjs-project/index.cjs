// CJS
const cssTools = require('@adobe/css-tools');
const css = "foo {bar: 'baz';}";
console.log('Input:');
console.dir(css);
console.log('Example of parse:');
const parse = cssTools.parse(css);
console.dir(parse);
console.log('Example of stringify:');
console.dir(cssTools.stringify(parse, {indent: true}));
