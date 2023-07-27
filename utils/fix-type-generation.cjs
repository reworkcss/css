// Due to a bug in parcel 2, the type definition contains bad path.
// See : https://github.com/parcel-bundler/parcel/issues/8908
// Might also relate to: https://github.com/parcel-bundler/parcel/issues/7790

const typePath = require('../package.json').types;
const {readFileSync, writeFileSync} = require('fs');
let content = readFileSync(typePath, 'utf8');
content = content.replace(
  /import\("src\/type"\)\.CssStylesheetAST/g,
  'CssStylesheetAST'
);
writeFileSync(typePath, content, 'utf8');
