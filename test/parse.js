var parse = require('../').parse;
var assert = require('node:assert');
var { describe, it } = require('node:test');

describe('parse(str)', function() {
  it('should save the filename and source', function() {
    var css = 'booty {\n  size: large;\n}\n';
    var ast = parse(css, {
      source: 'booty.css'
    });

    assert.strictEqual(ast.stylesheet.source, 'booty.css');

    var position = ast.stylesheet.rules[0].position;
    assert.ok(position.start);
    assert.ok(position.end);
    assert.strictEqual(position.source, 'booty.css');
    assert.strictEqual(position.content, css);
  });

  it('should throw when a selector is missing', function() {
    assert.throws(function() {
      parse('{size: large}');
    });

    assert.throws(function() {
      parse('b { color: red; }\n{ color: green; }\na { color: blue; }');
    });
  });

  it('should throw when a broken comment is found', function () {
    assert.throws(function() {
      parse('thing { color: red; } /* b { color: blue; }');
    });

    assert.throws(function() {
      parse('/*');
    });

    /* Nested comments should be fine */
    assert.doesNotThrow(function() {
      parse('/* /* */');
    });
  });

  it('should allow empty property value', function() {
    assert.doesNotThrow(function() {
      parse('p { color:; }');
    });
  });

  it('should not throw with silent option', function () {
    assert.doesNotThrow(function() {
      parse('thing { color: red; } /* b { color: blue; }', { silent: true });
    });
  });

  it('should list the parsing errors and continue parsing', function() {
    var result = parse('foo { color= red; } bar { color: blue; } baz {}} boo { display: none}', {
      silent: true,
      source: 'foo.css'
    });

    var rules = result.stylesheet.rules;
    assert.ok(rules.length > 2);

    var errors = result.stylesheet.parsingErrors;
    assert.strictEqual(errors.length, 2);

    assert.ok('message' in errors[0]);
    assert.ok('reason' in errors[0]);
    assert.ok('filename' in errors[0]);
    assert.strictEqual(errors[0].filename, 'foo.css');
    assert.ok('line' in errors[0]);
    assert.ok('column' in errors[0]);
    assert.ok('source' in errors[0]);

  });

  it('should set parent property', function() {
    var result = parse(
      'thing { test: value; }\n' +
      '@media (min-width: 100px) { thing { test: value; } }');

    assert.strictEqual(result.parent, null);

    var rules = result.stylesheet.rules;
    assert.strictEqual(rules.length, 2);

    var rule = rules[0];
    assert.strictEqual(rule.parent, result);
    assert.strictEqual(rule.declarations.length, 1);

    var decl = rule.declarations[0];
    assert.strictEqual(decl.parent, rule);

    var media = rules[1];
    assert.strictEqual(media.parent, result);
    assert.strictEqual(media.rules.length, 1);

    rule = media.rules[0];
    assert.strictEqual(rule.parent, media);

    assert.strictEqual(rule.declarations.length, 1);
    decl = rule.declarations[0];
    assert.strictEqual(decl.parent, rule);
  });

});
