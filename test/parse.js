var parse = require('../').parse;
var should = require('should');

describe('parse(str)', function() {
  it('should save the filename and source', function() {
    var css = 'booty {\n  size: large;\n}\n';
    var ast = parse(css, {
      source: 'booty.css'
    });

    ast.stylesheet.source.should.equal('booty.css');

    var position = ast.stylesheet.rules[0].position;
    position.start.should.be.ok;
    position.end.should.be.ok;
    position.source.should.equal('booty.css');
    position.content.should.equal(css);
  });

  it('should throw when a selector is missing', function() {
    should(function() {
      parse('{size: large}');
    }).throw();

    should(function() {
      parse('b { color: red; }\n{ color: green; }\na { color: blue; }');
    }).throw();
  });

  it('should throw when a broken comment is found', function () {
    should(function() {
      parse('thing { color: red; } /* b { color: blue; }');
    }).throw();

    should(function() {
      parse('/*');
    }).throw();

    /* Nested comments should be fine */
    should(function() {
      parse('/* /* */');
    }).not.throw();
  });

  it('should allow empty property value', function() {
    should(function() {
      parse('p { color:; }');
    }).not.throw();
  });

  it('should not throw with silent option', function () {
    should(function() {
      parse('thing { color: red; } /* b { color: blue; }', { silent: true });
    }).not.throw();
  });

  it('should list the parsing errors and continue parsing', function() {
    var result = parse('foo { color= red; } bar { color: blue; } baz {}} boo { display: none}', {
      silent: true,
      source: 'foo.css'
    });

    var rules = result.stylesheet.rules;
    rules.length.should.be.above(2);

    var errors = result.stylesheet.parsingErrors;
    errors.length.should.equal(2);

    errors[0].should.have.a.property('message');
    errors[0].should.have.a.property('reason');
    errors[0].should.have.a.property('filename');
    errors[0].filename.should.equal('foo.css');
    errors[0].should.have.a.property('line');
    errors[0].should.have.a.property('column');
    errors[0].should.have.a.property('source');

  });

  it('should set parent property', function() {
    var result = parse(
      'thing { test: value; }\n' +
      '@media (min-width: 100px) { thing { test: value; } }');

    should(result.parent).equal(null);

    var rules = result.stylesheet.rules;
    rules.length.should.equal(2);

    var rule = rules[0];
    rule.parent.should.equal(result);
    rule.declarations.length.should.equal(1);

    var decl = rule.declarations[0];
    decl.parent.should.equal(rule);

    var media = rules[1];
    media.parent.should.equal(result);
    media.rules.length.should.equal(1);

    rule = media.rules[0];
    rule.parent.should.equal(media);

    rule.declarations.length.should.equal(1);
    decl = rule.declarations[0];
    decl.parent.should.equal(rule);
  });

});
