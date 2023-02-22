import * as fs from 'fs';
import * as path from 'path';
import {parse, stringify} from '../src/index';

const cases = fs.readdirSync(path.join(__dirname, 'cases'));
cases.forEach((name: string) => {
  describe('cases/' + name, () => {
    const dir = path.join(__dirname, 'cases', name);
    const inputFile = path.join(dir, 'input.css');
    const astFile = path.join(dir, 'ast.json');
    const outputFile = path.join(dir, 'output.css');
    const compressedFile = path.join(dir, 'compressed.css');

    it('should match ast.json', () => {
      const ast = parseInput();
      if (!fs.existsSync(astFile)) {
        writeFile(astFile, JSON.stringify(ast));
      }
      expect(ast).toMatchObject(JSON.parse(readFile(astFile)));
    });

    it('should match output.css', () => {
      const output = stringify(parseInput());
      if (!fs.existsSync(outputFile)) {
        writeFile(outputFile, output);
      }
      expect(output).toBe(readFile(outputFile).trim());
    });

    it('should match compressed.css', () => {
      const compressed = stringify(parseInput(), {compress: true});
      if (!fs.existsSync(compressedFile)) {
        writeFile(compressedFile, compressed);
      }
      expect(compressed).toBe(readFile(compressedFile));
    });

    function parseInput() {
      return parse(readFile(inputFile), {source: 'input.css'});
    }
  });
});

function readFile(file: string) {
  let src = fs.readFileSync(file, 'utf8');
  // normalize line endings
  src = src.replace(/\r\n/, '\n');
  // remove trailing newline
  src = src.replace(/\n$/, '');

  return src;
}

function writeFile(file: string, text: string) {
  // normalize line endings
  text = text.replace(/\r\n/, '\n');
  // remove trailing newline
  text = text.replace(/\n$/, '');
  fs.writeFileSync(file, text, 'utf8');
}
