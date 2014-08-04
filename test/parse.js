var parse = require('../').parse;
var fs = require('fs');
var path = require('path');
var read = fs.readFileSync;
var readdir = fs.readdirSync;
var assert = require('assert');

describe('parse(str)', function(){
  it('should save the filename and source', function(){
    var css = 'booty {\n  size: large;\n}\n';
    var ast = parse(css, {
      source: 'booty.css'
    });

    var position = ast.stylesheet.rules[0].position;
    position.start.should.be.ok;
    position.end.should.be.ok;
    position.source.should.equal('booty.css');
    position.content.should.equal(css);
  });

  it('should throw when a selector is missing', function(){
    assert.throws(function(){
      parse('{size: large}');
    });

    assert.throws(function(){
      parse('b { color: red; }\n{ color: green; }\na {color: blue; }');
    });
  });

  it('should throw when a broken comment is found', function () {
    assert.throws(function(){
      parse('thing { color: red; } /* b { color: blue; }');
    });

    assert.throws(function(){
      parse('/*');
    });

    /* Nested comments should be fine */
    assert.doesNotThrow(function(){
      parse('/* /* */');
    });
  });

  it('should allow empty property value', function() {
    assert.doesNotThrow(function() {
      parse('p { color:; }');
    });
  });

  it('should not throw with silent option', function () {
    assert.doesNotThrow(function(){
      parse('thing { color: red; } /* b { color: blue; }',{ silent: true });
    });
  });

  it('should set parent property', function() {
    var result = parse(
      'thing { test: value; }\n' +
      '@media (min-width: 100px) { thing { test: value; } }');

    assert.equal(result.parent, null);

    var rules = result.stylesheet.rules;
    assert.equal(rules.length, 2);

    var rule = rules[0];
    assert.equal(rule.parent, result);
    assert.equal(rule.declarations.length, 1);

    var decl = rule.declarations[0];
    assert.equal(decl.parent, rule);

    var media = rules[1];
    assert.equal(media.parent, result);
    assert.equal(media.rules.length, 1);

    rule = media.rules[0];
    assert.equal(rule.parent, media);

    assert.equal(rule.declarations.length, 1);
    decl = rule.declarations[0];
    assert.equal(decl.parent, rule);
  });

});
