const fs = require('fs/promises');
const path = require('path');
const { parse, stringify } = require('./');

const casesDir = path.join(__dirname, 'test', 'cases');

async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function generateFile(file, content) {
  console.log(`Generating ${file}`);
  await fs.writeFile(file, content, 'utf8');
}

async function processCase(dir) {
  const inputFile = path.join(dir, 'input.css');
  if (!(await fileExists(inputFile))) {
    throw new Error(`Missing input file ${inputFile}`);
  }

  const input = await fs.readFile(inputFile, 'utf8');
  let parsed;
  try {
    parsed = parse(input, { source: 'input.css' });
  } catch (e) {
    console.error(`Failed to parse ${inputFile}`);
    throw e;
  }

  // Generate output.css
  const outputFile = path.join(dir, 'output.css');
  if (!(await fileExists(outputFile))) {
    await generateFile(outputFile, stringify(parsed));
  }

  // Generate compressed.css
  const compressedFile = path.join(dir, 'compressed.css');
  if (!(await fileExists(compressedFile))) {
    await generateFile(compressedFile, stringify(parsed, { compress: true }));
  }

  // Generate ast.json
  const astFile = path.join(dir, 'ast.json');
  if (!(await fileExists(astFile))) {
    await generateFile(astFile, JSON.stringify(parsed, null, 2));
  }
}

async function main() {
  try {
    const caseDirs = (await fs.readdir(casesDir, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(casesDir, dirent.name));

    await Promise.all(caseDirs.map(processCase));
  } catch (err) {
    console.error('Error processing test cases:', err);
    process.exit(1);
  }
}

main();
