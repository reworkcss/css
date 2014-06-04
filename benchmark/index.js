
var bytes = require('bytes');
var parse = require('..').parse;
var fs = require('fs');

var small = fs.readFileSync('benchmark/small.css', 'utf8');
var large = fs.readFileSync('benchmark/large.css', 'utf8');
var huge = Array(8).join(large);

function lines(str) {
  return str.split(/\n/g).length;
}

console.log();
console.log('  small : %s : %s lines', bytes(Buffer.byteLength(small)), lines(small));
console.log('  large : %s : %s lines', bytes(Buffer.byteLength(large)), lines(large));
console.log('   huge : %s : %s lines', bytes(Buffer.byteLength(huge)), lines(huge));

suite('css parse', function(){
  bench('small', function(){
    parse(small);
  });

  bench('large', function(){
    parse(large);
  });

  bench('huge', function(){
    parse(huge);
  });
});
