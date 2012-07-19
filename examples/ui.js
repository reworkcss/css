
var css = require('..')
  , fs = require('fs')
  , read = fs.readFileSync
  , str = read('examples/ui.css', 'utf8');

var ast = css.parse(str);
console.log(JSON.stringify(ast, null, 2));

console.log(css.stringify(ast));