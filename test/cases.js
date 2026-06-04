var fs = require('fs');
var path = require('path');
var assert = require('node:assert');
var { describe, it } = require('node:test');
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
      containDeep(ast, JSON.parse(readFile(astFile)));
    });

    it('should match output.css', function() {
      var output = stringify(parseInput());
      assert.strictEqual(output, readFile(outputFile).trim());
    });

    it('should match compressed.css', function() {
      var compressed = stringify(parseInput(), { compress: true });
      assert.strictEqual(compressed, readFile(compressedFile));
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

// Assert that `actual` deeply contains every property/element of `expected`.
function containDeep(actual, expected) {
  if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual));
    expected.forEach(function(item, i) {
      containDeep(actual[i], item);
    });
  } else if (expected && typeof expected === 'object') {
    assert.ok(actual && typeof actual === 'object');
    Object.keys(expected).forEach(function(key) {
      containDeep(actual[key], expected[key]);
    });
  } else {
    assert.strictEqual(actual, expected);
  }
}
