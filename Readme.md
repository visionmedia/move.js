
# Move.js

  CSS3 JavaScript animation framework.

## About

  Move.js is a small JavaScript library making CSS3 backed animation
  extremely simple and elegant. Be sure to view the `./examples`,
  and view the [documentation](http://visionmedia.github.com/move.js/).

## Installation

  With [component(1)](http://component.io):

    $ component install visionmedia/move.js

  With a stand-alone build

    <script src='move.min.js'></script>


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

## Easing functions

  Built-in easing functions are defined as:

```js
'in':                'ease-in'
'out':               'ease-out'
'in-out':            'ease-in-out'
'snap':              'cubic-bezier(0,1,.5,1)'
'linear':            'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
'ease-in-quad':      'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
'ease-in-cubic':     'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
'ease-in-quart':     'cubic-bezier(0.895, 0.030, 0.685, 0.220)'
'ease-in-quint':     'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
'ease-in-sine':      'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
'ease-in-expo':      'cubic-bezier(0.950, 0.050, 0.795, 0.035)'
'ease-in-circ':      'cubic-bezier(0.600, 0.040, 0.980, 0.335)'
'ease-in-back':      'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
'ease-out-quad':     'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
'ease-out-cubic':    'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
'ease-out-quart':    'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
'ease-out-quint':    'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
'ease-out-sine':     'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
'ease-out-expo':     'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
'ease-out-circ':     'cubic-bezier(0.075, 0.820, 0.165, 1.000)'
'ease-out-back':     'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
'ease-out-quad':     'cubic-bezier(0.455, 0.030, 0.515, 0.955)'
'ease-out-cubic':    'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
'ease-in-out-sine':  'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
'ease-in-out-expo':  'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
'ease-in-out-circ':  'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
'ease-in-out-back':  'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
```

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
