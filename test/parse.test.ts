import CssParseError from '../src/CssParseError';
import {parse} from '../src/index';
import {CssMediaAST, CssRuleAST} from '../src/type';

describe('parse(str)', () => {
  it('should save the filename and source', () => {
    const css = 'booty {\n  size: large;\n}\n';
    const ast = parse(css, {
      source: 'booty.css',
    });

    expect(ast.stylesheet.source).toBe('booty.css');

    const position = ast.stylesheet.rules[0].position;
    expect(position.start).toBeDefined();
    expect(position.end).toBeDefined();
    expect(position.source).toBe('booty.css');
    // expect(position.content).toBe(css);
  });

  it('should throw when a selector is missing', () => {
    expect(() => {
      parse('{size: large}');
    }).toThrow();

    expect(() => {
      parse('b { color: red; }\n{ color: green; }\na { color: blue; }');
    }).toThrow();
  });

  it('should throw when a broken comment is found', () => {
    expect(() => {
      parse('thing { color: red; } /* b { color: blue; }');
    }).toThrow();

    expect(() => {
      parse('/*');
    }).toThrow();

    /* Nested comments should be fine */
    expect(() => {
      parse('/* /* */');
    }).not.toThrow();
  });

  it('should allow empty property value', () => {
    expect(() => {
      parse('p { color:; }');
    }).not.toThrow();
  });

  it('should not throw with silent option', () => {
    expect(() => {
      parse('thing { color: red; } /* b { color: blue; }', {silent: true});
    }).not.toThrow();
  });

  it('should list the parsing errors and continue parsing', () => {
    const result = parse(
      'foo { color= red; } bar { color: blue; } baz {}} boo { display: none}',
      {
        silent: true,
        source: 'foo.css',
      }
    );

    const rules = result.stylesheet.rules;
    expect(rules.length).toBeGreaterThan(2);

    const errors = result.stylesheet.parsingErrors;
    expect(errors).toBeDefined();
    expect(errors?.length).toBe(2);

    const firstError = (errors as unknown as Array<CssParseError>)[0];

    expect(firstError).toHaveProperty('message');
    expect(firstError).toHaveProperty('reason');
    expect(firstError).toHaveProperty('filename');
    expect(firstError.filename).toBe('foo.css');
    expect(firstError).toHaveProperty('line');
    expect(firstError).toHaveProperty('column');
    expect(firstError).toHaveProperty('source');
  });

  it('should set parent property', () => {
    const result = parse(
      'thing { test: value; }\n' +
        '@media (min-width: 100px) { thing { test: value; } }'
    );

    // expect(result).not.toHaveProperty('parent');

    const rules = result.stylesheet.rules;
    expect(rules.length).toBe(2);

    let rule = rules[0] as CssRuleAST;
    expect(rule.parent).toBe(result);
    expect(rule.declarations.length).toBe(1);

    let decl = rule.declarations[0];
    expect(decl.parent).toBe(rule);

    const media = rules[1] as CssMediaAST;
    expect(media.parent).toBe(result);
    expect(media.rules.length).toBe(1);

    rule = media.rules[0] as CssRuleAST;
    expect(rule.parent).toBe(media);

    expect(rule.declarations.length).toBe(1);
    decl = rule.declarations[0];
    expect(decl.parent).toBe(rule);
  });
});
