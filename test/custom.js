var fs = require('fs');
var path = require('path');
var parse = require('../').parse;

var customs = fs.readdirSync(path.join(__dirname, 'customs'));
customs.forEach(function(name) {
  describe('customs/' + name, function() {
    var dir = path.join(__dirname, 'customs', name);
    var inputFile = path.join(dir, 'input.scss');

    it('should match ast.json', function() {
      var ast = parseInput();
      console.log('ast', JSON.stringify(ast));
    });

    function parseInput() {
      return parse(readFile(inputFile), { source: 'input.scss' });
    }
  });
});

function readFile(file) {
  var src = fs.readFileSync(file, 'utf8');
  // normalize line endings
  src = src.replace(/\r\n/, '\n');
  // remove trailing newline
  src = src.replace(/\n$/, '');

  return src;
}
