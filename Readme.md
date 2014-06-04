# css [![Build Status](https://travis-ci.org/reworkcss/css.svg?branch=master)](https://travis-ci.org/reworkcss/css)

  CSS parser / stringifier.

## Installation

    $ npm install css

## Usage

```javascript
var css = require('css')
var obj = css.parse('body { font-size: 12px; }', options)
css.stringify(obj, options);
```

## API

### css.parse(css, [options])

Accepts a CSS string and returns an AST `object`.

`options`:

- `silent` - silently fail on parse errors.
- `source` - the path to the file containing `css`. Makes errors and source
  maps more helpful, by letting them know where code comes from.
- `position` - record the line and column of the start and end of nodes.
  Required for source map generation. `true` by default.

For the `source` and `position` options, also see the parse tree
[examples](#examples) below.

### css.stringify(object, [options])

Accepts an AST `object` (as `css.parse` produces) and returns a CSS string.

`options`:

- `compress` - omit comments and extraneous whitespace.
- `sourcemap` - return a sourcemap along with the CSS output (requires the
  `position` option of `css.parse`, and its `source` option is strongly
  recommended).

```js
var ast = css.parse('body { font-size: 12px; }', { position: true, source: 'source.css' });

var css = css.stringify(ast);

var result = css.stringify(ast, { sourcemap: true });
result.code // string with CSS
result.map // source map object
```

### Errors

Errors will have `error.position`, with the following properties:

- `start` - start line and column numbers.
- `end` - end line and column numbers.
- `source` - `options.source` if passed to `css.parse`.

If you create any errors in plugins such as in
[rework](https://github.com/reworkcss/rework), you __must__ set the `position`
as well for consistency.

## Examples

CSS:

```css
body {
  background: #eee;
  color: #888;
}
```

Parse tree:

```json
{
  "type": "stylesheet",
  "stylesheet": {
    "rules": [
      {
        "type": "rule",
        "selectors": [
          "body"
        ],
        "declarations": [
          {
            "type": "declaration",
            "property": "background",
            "value": "#eee"
          },
          {
            "type": "declaration",
            "property": "color",
            "value": "#888"
          }
        ]
      }
    ]
  }
}
```

Parse tree with the `position` option enabled:

```json
{
  "type": "stylesheet",
  "stylesheet": {
    "rules": [
      {
        "type": "rule",
        "selectors": [
          "body"
        ],
        "declarations": [
          {
            "type": "declaration",
            "property": "background",
            "value": "#eee",
            "position": {
              "start": {
                "line": 3,
                "column": 3
              },
              "end": {
                "line": 3,
                "column": 19
              }
            }
          },
          {
            "type": "declaration",
            "property": "color",
            "value": "#888",
            "position": {
              "start": {
                "line": 4,
                "column": 3
              },
              "end": {
                "line": 4,
                "column": 14
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 2,
            "column": 1
          },
          "end": {
            "line": 5,
            "column": 2
          }
        }
      }
    ]
  }
}
```

`node.position.content` is set on each node to the full source string. If you
also pass in `source: 'path/to/source.css'` to `css.parse`, that will be set on
`node.position.source`.

## License

MIT
