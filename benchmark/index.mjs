import bytes from 'bytes';
import {parse} from '../dist/index.mjs';
import * as fs from 'fs';
import benchmark from 'benchmark';

const small = fs.readFileSync('benchmark/small.css', 'utf8');
const large = fs.readFileSync('benchmark/large.css', 'utf8');
const huge = Array(8).join(large);

function lines(str) {
  return str.split(/\n/g).length;
}

console.log();
console.log(
  '  small : %s : %s lines',
  bytes(Buffer.byteLength(small)),
  lines(small)
);
console.log(
  '  large : %s : %s lines',
  bytes(Buffer.byteLength(large)),
  lines(large)
);
console.log(
  '   huge : %s : %s lines',
  bytes(Buffer.byteLength(huge)),
  lines(huge)
);

const suite = new benchmark.Suite();

suite
  .add('css parse - small', () => {
    parse(small);
  })
  .add('css parse - large', () => {
    parse(large);
  })
  .add('css parse - huge', () => {
    parse(huge);
  })
  .on('cycle', event => {
    console.log(String(event.target));
  })
  .run();
