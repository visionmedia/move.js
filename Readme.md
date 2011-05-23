
# Move.js

  CSS3 JavaScript animation framework.

## About

  Move.js is a small JavaScript library making CSS3 backed animation
  extremely simple and elegant. Be sure to view the `./examples`,
  and view the [documentation](http://visionmedia.github.com/move.js/).

## Example

  For example below we translate to the point `(500px, 200px)`,
  rotate by `180deg`, scale by `.5`, skew, and alter colors within a 2 second
  duration. Once the animation is complete we `then()` fade out the element by setting the `opacity` to `0`, and shrink it with `scale(0.1)`.

    move('.square')
      .to(500, 200)
      .rotate(180)
      .scale(.5)
      .set('background-color', '#888')
      .set('border-color', 'black')
      .duration('2s')
      .skew(50, -10)
      .then()
        .set('opacity', 0)
        .duration('0.3s')
        .scale(0.1)
        .pop()
      .end();

## Build

 Move is packaged with a minified version, re-built each release. To do this yourself simply execute:

     $ make move.min.js

 We can also pass flags to uglifyjs:
 
     $ make UGLIFY_FLAGS=--no-mangle

## More Information

  - [cubic-bezier()](http://www.roblaplaca.com/examples/bezierBuilder) generator

## License 

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.