// Generates missing output source and AST files for the test cases
// IMPORTANT: Always verify the generated files when using this!

var fs = require('fs');
var path = require('path');
var parse = require('./').parse;
var stringify = require('./').stringify;

var casesDir = path.join(__dirname, 'test', 'cases');
var cases = fs.readdirSync(casesDir)
    .map(function(f) { return path.join(casesDir, f); });

cases.forEach(function(dir) {
    var inputFile = path.join(dir, 'input.css');
    if (!fs.existsSync(inputFile))
        throw new Error('Missing input file ' + inputFile);

    var input = fs.readFileSync(inputFile, 'utf8');
    var parsed;
    try {
        parsed = parse(input, { source: 'input.css' });
    } catch(e) {
        console.log('Failed to parse', inputFile);
        throw e;
    }

    var outputFile = path.join(dir, 'output.css');
    if (!fs.existsSync(outputFile)) {
        console.log('Generating', outputFile);
        var output = stringify(parsed);
        fs.writeFileSync(outputFile, output, 'utf8');
    }

    var compressedFile = path.join(dir, 'compressed.css');
    if (!fs.existsSync(compressedFile)) {
        console.log('Generating', compressedFile);
        var compressed = stringify(parsed, { compress: true });
        fs.writeFileSync(compressedFile, compressed, 'utf8');
    }

    var astFile = path.join(dir, 'ast.json');
    if (!fs.existsSync(astFile)) {
        console.log('Generating', astFile);
        var ast = JSON.stringify(parsed, null, '  ');
        fs.writeFileSync(astFile, ast, 'utf8');
    }
});
