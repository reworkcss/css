var stringify = require('../').stringify;
var parse = require('../').parse;
var path = require('path');
var read = require('fs').readFileSync;
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var SourceMapGenerator = require('source-map').SourceMapGenerator;

describe('stringify(obj, {sourcemap: true})', function() {
  var file = 'test/source-map/test.css';
  var src = read(file, 'utf8');
  var stylesheet = parse(src, { source: file });
  function loc(line, column) {
    return { line: line, column: column, source: file, name: null };
  }

  var locs = {
    tobiSelector: loc(1, 0),
    tobiNameName: loc(2, 2),
    tobiNameValue: loc(2, 2),
    mediaBlock: loc(11, 0),
    mediaOnly: loc(12, 2),
    comment: loc(17, 0),
  };

  it('should generate source maps alongside when using identity compiler', function() {
    var result = stringify(stylesheet, { sourcemap: true });
    result.should.have.property('code');
    result.should.have.property('map');
    var map = new SourceMapConsumer(result.map);
    map.originalPositionFor({ line: 1, column: 0 }).should.eql(locs.tobiSelector);
    map.originalPositionFor({ line: 2, column: 2 }).should.eql(locs.tobiNameName);
    map.originalPositionFor({ line: 2, column: 8 }).should.eql(locs.tobiNameValue);
    map.originalPositionFor({ line: 11, column: 0 }).should.eql(locs.mediaBlock);
    map.originalPositionFor({ line: 12, column: 2 }).should.eql(locs.mediaOnly);
    map.originalPositionFor({ line: 17, column: 0 }).should.eql(locs.comment);
    map.sourceContentFor(file).should.eql(src);
  });

  it('should generate source maps alongside when using compress compiler', function() {
    var result = stringify(stylesheet, { compress: true, sourcemap: true });
    result.should.have.property('code');
    result.should.have.property('map');
    var map = new SourceMapConsumer(result.map);
    map.originalPositionFor({ line: 1, column: 0 }).should.eql(locs.tobiSelector);
    map.originalPositionFor({ line: 1, column: 5 }).should.eql(locs.tobiNameName);
    map.originalPositionFor({ line: 1, column: 10 }).should.eql(locs.tobiNameValue);
    map.originalPositionFor({ line: 1, column: 50 }).should.eql(locs.mediaBlock);
    map.originalPositionFor({ line: 1, column: 64 }).should.eql(locs.mediaOnly);
    map.sourceContentFor(file).should.eql(src);
  });

  it('should apply included source maps, with paths adjusted to CWD', function() {
    var file = 'test/source-map/apply.css';
    var src = read(file, 'utf8');
    var stylesheet = parse(src, { source: file });
    var result = stringify(stylesheet, { sourcemap: true });
    result.should.have.property('code');
    result.should.have.property('map');

    var map = new SourceMapConsumer(result.map);
    map.originalPositionFor({ line: 1, column: 0 }).should.eql({
      column: 0,
      line: 1,
      name: null,
      source: 'test/source-map/apply.scss'
    });

    map.originalPositionFor({ line: 2, column: 2 }).should.eql({
      column: 7,
      line: 1,
      name: null,
      source: 'test/source-map/apply.scss'
    });
  });

  it('should not apply included source maps when inputSourcemap is false', function() {
    var file = 'test/source-map/apply.css';
    var src = read(file, 'utf8');
    var stylesheet = parse(src, { source: file });
    var result = stringify(stylesheet, { sourcemap: true, inputSourcemaps: false });

    var map = new SourceMapConsumer(result.map);
    map.originalPositionFor({ line: 1, column: 0 }).should.eql({
      column: 0,
      line: 1,
      name: null,
      source: file
    });
  });

  it('should convert Windows-style paths to URLs', function() {
    var originalSep = path.sep;
    path.sep = '\\'; // Pretend we’re on Windows (if we aren’t already).

    var src = 'C:\\test\\source.css';
    var css = 'a { color: black; }'
    var stylesheet = parse(css, { source: src });
    var result = stringify(stylesheet, { sourcemap: true });

    result.map.sources.should.eql(['/test/source.css']);

    path.sep = originalSep;
  });

  it('should return source map generator when sourcemap: "generator"', function(){
    var css = 'a { color: black; }';
    var stylesheet = parse(css);
    var result = stringify(stylesheet, { sourcemap: 'generator' });

    result.map.should.be.an.instanceOf(SourceMapGenerator);
  });
});
