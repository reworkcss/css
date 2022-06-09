// Generates missing output source and AST files for the test cases
// IMPORTANT: Always verify the generated files when using this!

const fs = require('fs');
const path = require('path');
const parse = require('./').parse;
const stringify = require('./').stringify;

const casesDir = path.join(__dirname, 'test', 'cases');
const cases = fs.readdirSync(casesDir).map((f: string) => {
  return path.join(casesDir, f);
});

cases.forEach((dir: string) => {
  const inputFile = path.join(dir, 'input.css');
  if (!fs.existsSync(inputFile))
    throw new Error('Missing input file ' + inputFile);

  const input = fs.readFileSync(inputFile, 'utf8');
  let parsed;
  try {
    parsed = parse(input, {source: 'input.css'});
  } catch (e) {
    console.log('Failed to parse', inputFile);
    throw e;
  }

  const outputFile = path.join(dir, 'output.css');
  if (!fs.existsSync(outputFile)) {
    console.log('Generating', outputFile);
    const output = stringify(parsed);
    fs.writeFileSync(outputFile, output, 'utf8');
  }

  const compressedFile = path.join(dir, 'compressed.css');
  if (!fs.existsSync(compressedFile)) {
    console.log('Generating', compressedFile);
    const compressed = stringify(parsed, {compress: true});
    fs.writeFileSync(compressedFile, compressed, 'utf8');
  }

  const astFile = path.join(dir, 'ast.json');
  if (!fs.existsSync(astFile)) {
    console.log('Generating', astFile);
    const ast = JSON.stringify(parsed, null, '  ');
    fs.writeFileSync(astFile, ast, 'utf8');
  }
});
