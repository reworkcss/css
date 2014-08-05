var fs = require('fs');
var path = require('path');
var parse = require('../').parse;
var stringify = require('../').stringify;

var cases = fs.readdirSync(path.join(__dirname, 'cases'));
cases.forEach(function(name) {
  describe('cases/' + name, function() {
    var dir = path.join(__dirname, 'cases', name);
    var inputFile = path.join(dir, 'input.css');
    var astFile = path.join(dir, 'ast.json');
    var outputFile = path.join(dir, 'output.css');
    var compressedFile = path.join(dir, 'compressed.css');

    it('should match ast.json', function() {
      var ast = parseInput();
      ast.should.containDeep(JSON.parse(readFile(astFile)));
    });

    it('should match output.css', function() {
      var output = stringify(parseInput());
      output.should.equal(readFile(outputFile).trim());
    });

    it('should match compressed.css', function() {
      var compressed = stringify(parseInput(), { compress: true });
      compressed.should.equal(readFile(compressedFile));
    });

    function parseInput() {
      return parse(readFile(inputFile), { source: 'input.css' });
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
