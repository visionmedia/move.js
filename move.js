
/*!
 * move
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

;(function(exports){

  /**
   * Computed style.
   */

  var current = getComputedStyle || currentStyle;

  /**
   * Map of prop -> type for numeric values.
   */

  var map = {
      'top': 'px'
    , 'bottom': 'px'
    , 'left': 'px'
    , 'right': 'px'
    , 'width': 'px'
    , 'height': 'px'
    , 'font-size': 'px'
    , 'margin': 'px'
    , 'margin-top': 'px'
    , 'margin-bottom': 'px'
    , 'margin-left': 'px'
    , 'margin-right': 'px'
    , 'padding': 'px'
    , 'padding-top': 'px'
    , 'padding-bottom': 'px'
    , 'padding-left': 'px'
    , 'padding-right': 'px'
  };

  /**
   * Initialize a `Move` instance with the given `selector`.
   *
   * @param {String} selector
   * @return {Move}
   * @api public
   */

  exports.move = function(selector) {
    return new Move(move.select(selector));
  };

  /**
   * Library version.
   */

  exports.move.version = '0.0.3';

  /**
   * Defaults.
   * 
   *   `duration` - default duration of 500ms
   * 
   */

  move.defaults = {
    duration: 500
  };

  move.utils = {};

  /**
   * Get stylesheet with title 'move' (creates it if doesn't exist).
   *
   * @return {Object}
   * @api public
   */

  move.utils.__defineGetter__('sheet', function(){
    if (!move.sheet){
      sheet = document.createElement('style');
      sheet.title = 'move';
      sheet.type = 'text/css';
      move.select('head').appendChild(sheet);
      move.sheet = document.styleSheets[document.styleSheets.length-1];
    }
    return move.sheet;
  });

  /**
   * Get browser supported property given a CSS `prop`.
   *
   * @param {String} prop
   * @return {String}
   * @api public
   */
  
  move.utils.getSupportedProperty = function(prop){
    var vendorProp, bodyStyle = document.body.style, capProp = prop.charAt(0).toUpperCase().replace(/-(\w)/g,RegExp.$1.toUpperCase()) + prop.slice(1), prefixes = [ "Moz", "Webkit", "O", "ms" ];
    if (prop in bodyStyle) {
      return prop;
    }else{
      for (var i = prefixes.length - 1; i >= 0; i--) {
        vendorProp = prefixes[i] + capProp;
        if (vendorProp in bodyStyle){
          return '-' + prefixes[i].toLowerCase() + '-' + prop;    
        }
      }
    }
  };

  /**
   * Get browser prefix given a CSS `prop`.
   *
   * @param {String} prop
   * @return {String}
   * @api public
   */

  move.utils.getPrefix = function(prop) {
    var prefix = move.utils.getSupportedProperty(prop).match(/-\w+-/);
    return prefix?prefix[0]:'';
  };

  /**
   * Easing functions.
   */

  move.ease = {
      'in': 'ease-in'
    , 'out': 'ease-out'
    , 'in-out': 'ease-in-out'
    , 'snap': 'cubic-bezier(0,1,.5,1)'
  };

  /**
   * Default element selection utilized by `move(selector)`.
   *
   * Override to implement your own selection, for example
   * with jQuery one might write:
   *
   *     move.select = function(selector) {
   *       return jQuery(selector).get(0);
   *     };
   *
   * @param {Object|String} selector
   * @return {Element}
   * @api public
   */

  move.select = function(selector){
    if ('string' != typeof selector) return selector;
    return document.getElementById(selector)
      || document.querySelectorAll(selector)[0];
  };

  /**
   * EventEmitter.
   */

  function EventEmitter() {
    this.callbacks = {};
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  EventEmitter.prototype.on = function(event, fn){
    (this.callbacks[event] = this.callbacks[event] || [])
      .push(fn);
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   */

  EventEmitter.prototype.emit = function(event){
    var args = Array.prototype.slice.call(arguments, 1)
      , callbacks = this.callbacks[event]
      , len;

    if (callbacks) {
      len = callbacks.length;
      for (var i = 0; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }

    return this;
  };

  /**
   * Initialize a new `Move` with the given `el`.
   *
   * @param {Element} el
   * @api public
   */

  exports.Move = function Move(el) {
    if (!(this instanceof Move)) return new Move(el);
    EventEmitter.call(this);
    this.el = el;
    this._props = {};
    this._rotate = 0;
    this._transitionProps = [];
    this._transforms = [];
    this._animations = [];
    this.duration(move.defaults.duration)
  };

  /**
   * Inherit from `EventEmitter.prototype`.
   */

  Move.prototype = new EventEmitter;
  Move.prototype.constructor = Move;

  /**
   * Buffer `transform`.
   *
   * @param {String} transform
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transform = function(transform){
    this._transforms.push(transform);
    return this;
  };

  /**
   * Skew `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skew = function(x, y){
    y = y || 0;
    return this.transform('skew('
      + x + 'deg, '
      + y + 'deg)');
  };

  /**
   * Skew x by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewX = function(n){
    return this.transform('skewX(' + n + 'deg)');
  };

  /**
   * Skew y by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewY = function(n){
    return this.transform('skewY(' + n + 'deg)');
  };

  /**
   * Translate `x` and `y` axis.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translate = 
  Move.prototype.to = function(x, y){
    y = y || 0;
    return this.transform('translate('
      + x + 'px, '
      + y + 'px)');
  };

  /**
   * Translate on the x axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateX =
  Move.prototype.x = function(n){
    return this.transform('translateX(' + n + 'px)');
  };

  /**
   * Translate on the y axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateY =
  Move.prototype.y = function(n){
    return this.transform('translateY(' + n + 'px)');
  };

  /**
   * Scale the x and y axis by `x`, or 
   * individually scale `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scale = function(x, y){
    y = null == y ? x : y;
    return this.transform('scale('
      + x + ', '
      + y + ')');
  };

  /**
   * Scale x axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleX = function(n){
    return this.transform('scaleX(' + n + ')')
  };

  /**
   * Scale y axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleY = function(n){
    return this.transform('scaleY(' + n + ')')
  };

  /**
   * Rotate `n` degrees.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.rotate = function(n){
    return this.transform('rotate(' + n + 'deg)');
  };

  /**
   * Set transition easing function to to `fn` string.
   *
   * When:
   *
   *   - null "ease" is used
   *   - "in" "ease-in" is used
   *   - "out" "ease-out" is used
   *   - "in-out" "ease-in-out" is used
   *
   * @param {String} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.ease = function(fn){
    fn = move.ease[fn] || fn || 'ease';
    return this.setProperty('transition-timing-function', fn);
  };

  /**
   * Set animation properties
   *
   * @param {String} name
   * @param {Object} props
   * @param {Object|String} props
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.animate = function(keyframe, props, name){
    name = name || 'move-animation-'+(+this._animations.length+1);
    var keyframeStr = '@' + move.utils.getPrefix('animation') + 'keyframes ' + name + '  {';
    for (var i in keyframe){
      var percentage = keyframe[i];
      keyframeStr += i;
      if (i.indexOf('%') === -1 && i !== 'from' && i !== 'to'){
        keyframeStr += '%';
      }
      keyframeStr += ' { ';
      for(var j in percentage){
        keyframeStr += move.utils.getSupportedProperty(j) + ':' + percentage[j] + '; ';
      }
      keyframeStr += ' }';
    }
    keyframeStr += '}';
    move.utils.sheet.insertRule(keyframeStr, move.utils.sheet.cssRules.length);
    if (typeof props === 'object'){
      props = (props.duration || '') + ' ' + (props['timing-function'] || '') + ' ' + (props.delay || '') + ' ' + (props['iteration-count'] || '') + ' ' + (props.direction || '');
    }
    this._animations.push(name + ' ' + props);
    return this;
  }

  /**
   * Set duration to `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.duration = function(n){
    n = this._duration = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setProperty('transition-duration', n + 'ms');
  };

  /**
   * Delay the animation by `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.delay = function(n){
    n = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setProperty('transition-delay', n + 'ms');
  };

  /**
   * Set `prop` to `val`, deferred until `.end()` is invoked.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.setProperty = function(prop, val){
    this._props[prop] = val;
    return this;
  };

  
  /**
   * Set `prop` to `value`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.set = function(prop, val){
    this.transition(prop);
    if ('number' == typeof val && map[prop]) val += map[prop]; 
    this._props[prop] = val;
    return this;
  };

  /**
   * Increment `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.add = function(prop, val){
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr + val + 'px');
    });
  };

  /**
   * Decrement `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.sub = function(prop, val){
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr - val + 'px');
    });
  };

  /**
   * Get computed or "current" value of `prop`.
   *
   * @param {String} prop
   * @return {String}
   * @api public
   */

  Move.prototype.current = function(prop){
    return current(this.el).getPropertyValue(prop);
  };

  /**
   * Add `prop` to the list of internal transition properties.
   *
   * @param {String} prop
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transition = function(prop){
    if (!this._transitionProps.indexOf(prop)) return this;
    this._transitionProps.push(prop);
    return this;
  };


/**
   * Apply a CSS `prop` with the given `val`.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.applyProperty = function(prop, val){
    this.el.style.setProperty(move.utils.getSupportedProperty(prop), val, '');
    return this;
  };


  /**
   * Commit style properties, aka apply them to `el.style`.
   *
   * @return {Move} for chaining
   * @see Move#end()
   * @api private
   */

  Move.prototype.applyProperties = function(){
    var props = this._props;
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        this.applyProperty(prop, props[prop]);
      }
    }
    return this;
  };

  /**
   * Re-select element via `selector`, replacing
   * the current element.
   *
   * @param {String} selector
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.move =
  Move.prototype.select = function(selector){
    this.el = move.select(selector);
    return this;
  };

  /**
   * Defer the given `fn` until the animation
   * is complete. `fn` may be one of the following:
   *
   *   - a function to invoke
   *   - an instanceof `Move` to call `.end()`
   *   - nothing, to return a clone of this `Move` instance for chaining
   *
   * @param {Function|Move} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.then = function(fn){
    // invoke .end()
    if (fn instanceof Move) {
      this.on('end', function(){
        fn.end();
      });
    // callback
    } else if ('function' == typeof fn) {
      this.on('end', fn);
    // chain
    } else {
      var clone = new Move(this.el);
      clone._transforms = this._transforms.slice(0);
      this.then(clone);
      clone.parent = this;
      return clone;
    }

    return this;
  };

  /**
   * Pop the move context.
   *
   * @return {Move} parent Move
   * @api public
   */

  Move.prototype.pop = function(){
    return this.parent;
  };

  /**
   * Start animation, optionally calling `fn` when complete.
   *
   * @param {Function} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.end = function(fn){
    var self = this;

    // emit "start" event
    this.emit('start');

    // transforms
    if (this._transforms.length) {
      this.setProperty('transform', this._transforms.join(' '));
    }
    if (this._animations.length) {
      this.setProperty('animation', this._animations.join(', '));
    }
    // transition properties
    this.setProperty('transition-property', this._transitionProps.join(', ') + ', ' + move.utils.getSupportedProperty('transform'));
    this.applyProperties();

    // callback given
    if (fn) this.then(fn);

    // emit "end" when complete
    setTimeout(function(){
      self.setProperty('transform', null);
      self.setProperty('animation', null);
      self.setProperty('transition-property', null);
      self.emit('end');
    }, this._duration);

    return this;
  };

})(this);
