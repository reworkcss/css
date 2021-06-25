const fs = require('fs');
const path = require('path');
const parse = require('../').parse;
const stringify = require('../').stringify;

const cases = fs.readdirSync(path.join(__dirname, 'cases'));
cases.forEach(function(name) {
  describe('cases/' + name, function() {
    const dir = path.join(__dirname, 'cases', name);
    const inputFile = readFile(path.join(dir, 'input.css'));
    const astFile = readFile(path.join(dir, 'ast.json'));
    const outputFile = readFile(path.join(dir, 'output.css'));
    const compressedFile = readFile(path.join(dir, 'compressed.css'));

    const parsedFile = parseFile(inputFile);

    it('should match ast.json', function() {
      parsedFile.should.containDeep(JSON.parse(astFile));
    });

    it('should match output.css', function() {
      const stringOutput = stringify(parsedFile)
      stringOutput.should.equal(outputFile.trim());
    });

    it('should match compressed.css', function() {
      const compressedOutput = stringify(parsedFile,{ compress: true })
      compressedOutput.should.equal(compressedFile);
    });

  });
});

function parseFile(file){
  try {
    return parse(file, {source: 'input.css'});
  } catch (e){
    console.error("Error in Parsing",e);
    return {};
  }
}

function readFile(file) {
  return fs.readFileSync(file, 'utf8')
      .replace(/\r\n/g, '\n')// normalize line endings
      .replace(/\n$/g, '');// remove trailing newline
}
