
# css

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

- `silent` - silently fail on parse errrors.
- `source` - recommended for debugging.
- `position` - `true` by default.

### css.stringify(object, [options])

Accepts an AST `object` from `parse` and returns a CSS string.

`options`:

- `compress` - compress the output
- `sourcemap` - return a sourcemap along with the CSS output (requires use of `position` with `css.parse`).

```js
var ast = css.parse('body { font-size: 12px; }', { position: true });
var css = css.stringify(ast);
var result = css.stringify(ast, { sourcemap: true });

result.code // string with CSS
result.map // source map
```

### Errors

Errors will have `err.position` where `position` is:

- `start` - start line and column numbers
- `end` - end line and column numbers
- `source` - `options.source` if passed to options

If you create any errors in plugins such as in
[rework](https://github.com/reworkcss/rework), you __must__ set the `position`
as well for consistency.

## Example

css:

```css
body {
  background: #eee;
  color: #888;
}
```

parse tree:

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

parse tree with `.position` enabled:

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
also pass in `source: 'path/to/original.css'`, that will be set on
`node.position.source`.

## License

MIT
