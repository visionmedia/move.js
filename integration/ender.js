/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build ../
  * =============================================================
  */

/*!
  * Ender-JS: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * https://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context;

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {};

  function require (identifier) {
    var module = modules[identifier] || window[identifier];
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.");
    return module;
  }

  function provide (name, what) {
    return modules[name] = what;
  }

  context['provide'] = provide;
  context['require'] = require;

  // Implements Ender's $ global access object
  // =========================================

  function aug(o, o2) {
    for (var k in o2) {
      k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k]);
    }
    return o;
  }

  function boosh(s, r, els) {
                          // string || node || nodelist || window
    if (ender._select && (typeof s == 'string' || s.nodeName || s.length && 'item' in s || s == window)) {
      els = ender._select(s, r);
      els.selector = s;
    } else {
      els = isFinite(s.length) ? s : [s];
    }
    return aug(els, boosh);
  }

  function ender(s, r) {
    return boosh(s, r);
  }

  aug(ender, {
    _VERSION: '0.2.5',
    ender: function (o, chain) {
      aug(chain ? boosh : ender, o);
    },
    fn: context.$ && context.$.fn || {} // for easy compat to jQuery plugins
  });

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) {
        i in this && fn.call(scope || this[i], this[i], i, this);
      }
      // return self for chaining
      return this;
    },
    $: ender // handy reference to self
  });

  var old = context.$;
  ender.noConflict = function () {
    context.$ = old;
    return this;
  };

  (typeof module !== 'undefined') && module.exports && (module.exports = ender);
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender;

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Qwery - A Blazing Fast query selector engine
    * https://github.com/ded/qwery
    * copyright Dustin Diaz & Jacob Thornton 2011
    * MIT License
    */
  
  !function (context, doc) {
  
    var c, i, j, k, l, m, o, p, r, v,
        el, node, len, found, classes, item, items, token,
        html = doc.documentElement,
        id = /#([\w\-]+)/,
        clas = /\.[\w\-]+/g,
        idOnly = /^#([\w\-]+$)/,
        classOnly = /^\.([\w\-]+)$/,
        tagOnly = /^([\w\-]+)$/,
        tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/,
        normalizr = /\s*([\s\+\~>])\s*/g,
        splitters = /[\s\>\+\~]/,
        splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\])/,
        dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g'),
        tokenizr = new RegExp(splitters.source + splittersMore.source),
        specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g,
        simple = /^([a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/,
        attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/,
        pseudo = /:([\w\-]+)(\(['"]?(\w+)['"]?\))?/,
        chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?'),
        walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      },
      '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode;
      },
      '~': function (node) {
        return node && node.previousSibling;
      },
      '+': function (node, contestant, p1, p2) {
        if (!node) {
          return false;
        }
        p1 = previous(node);
        p2 = previous(contestant);
        return p1 && p2 && p1 == p2 && p1;
      }
    };
    function cache() {
      this.c = {};
    }
    cache.prototype = {
      g: function (k) {
        return this.c[k] || undefined;
      },
      s: function (k, v) {
        this.c[k] = v;
        return v;
      }
    };
  
    var classCache = new cache(),
        cleanCache = new cache(),
        attrCache = new cache(),
        tokenCache = new cache();
  
    function array(ar) {
      r = [];
      for (i = 0, len = ar.length; i < len; i++) {
        r[i] = ar[i];
      }
      return r;
    }
  
    function previous(n) {
      while (n = n.previousSibling) {
        if (n.nodeType == 1) {
          break;
        }
      }
      return n
    }
  
    function q(query) {
      return query.match(chunker);
    }
  
    // this next method expect at most these args
    // given => div.hello[title="world"]:foo('bar')
  
    // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  
    function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
      var m, c, k;
      if (tag && this.tagName.toLowerCase() !== tag) {
        return false;
      }
      if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) {
        return false;
      }
      if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
        for (i = classes.length; i--;) {
          c = classes[i].slice(1);
          if (!(classCache.g(c) || classCache.s(c, new RegExp('(^|\\s+)' + c + '(\\s+|$)'))).test(this.className)) {
            return false;
          }
        }
      }
      if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) {
        return false;
      }
      if (wholeAttribute && !value) {
        o = this.attributes;
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
            return this;
          }
        }
      }
      if (wholeAttribute && !checkAttr(qualifier, this.getAttribute(attribute) || '', value)) {
        return false;
      }
      return this;
    }
  
    function clean(s) {
      return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'));
    }
  
    function checkAttr(qualify, actual, val) {
      switch (qualify) {
      case '=':
        return actual == val;
      case '^=':
        return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, new RegExp('^' + clean(val))));
      case '$=':
        return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, new RegExp(clean(val) + '$')));
      case '*=':
        return actual.match(attrCache.g(val) || attrCache.s(val, new RegExp(clean(val))));
      case '~=':
        return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, new RegExp('(?:^|\\s+)' + clean(val) + '(?:\\s+|$)')));
      case '|=':
        return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, new RegExp('^' + clean(val) + '(-|$)')));
      }
      return 0;
    }
  
    function _qwery(selector) {
      var r = [], ret = [], i, j = 0, k, l, m, p, token, tag, els, root, intr, item, children,
          tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr)),
          dividedTokens = selector.match(dividers), dividedToken;
      tokens = tokens.slice(0); // this makes a copy of the array so the cached original is not effected
      if (!tokens.length) {
        return r;
      }
  
      token = tokens.pop();
      root = tokens.length && (m = tokens[tokens.length - 1].match(idOnly)) ? doc.getElementById(m[1]) : doc;
      if (!root) {
        return r;
      }
      intr = q(token);
      els = dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ? function (r) {
          while (root = root.nextSibling) {
            root.nodeType == 1 && (intr[1] ? intr[1] == root.tagName.toLowerCase() : 1) && r.push(root)
          }
          return r
        }([]) :
        root.getElementsByTagName(intr[1] || '*');
      for (i = 0, l = els.length; i < l; i++) {
        if (item = interpret.apply(els[i], intr)) {
          r[j++] = item;
        }
      }
      if (!tokens.length) {
        return r;
      }
  
      // loop through all descendent tokens
      for (j = 0, l = r.length, k = 0; j < l; j++) {
        p = r[j];
        // loop through each token backwards crawling up tree
        for (i = tokens.length; i--;) {
          // loop through parent nodes
          while (p = walker[dividedTokens[i]](p, r[j])) {
            if (found = interpret.apply(p, q(tokens[i]))) {
              break;
            }
          }
        }
        found && (ret[k++] = r[j]);
      }
      return ret;
    }
  
    function boilerPlate(selector, _root, fn) {
      var root = (typeof _root == 'string') ? fn(_root)[0] : (_root || doc);
      if (selector === window || isNode(selector)) {
        return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : [];
      }
      if (selector && typeof selector === 'object' && isFinite(selector.length)) {
        return array(selector);
      }
      if (m = selector.match(idOnly)) {
        return (el = doc.getElementById(m[1])) ? [el] : [];
      }
      if (m = selector.match(tagOnly)) {
        return array(root.getElementsByTagName(m[1]));
      }
      return false;
    }
  
    function isNode(el) {
      return (el && el.nodeType && (el.nodeType == 1 || el.nodeType == 9));
    }
  
    function uniq(ar) {
      var a = [], i, j;
      label:
      for (i = 0; i < ar.length; i++) {
        for (j = 0; j < a.length; j++) {
          if (a[j] == ar[i]) {
            continue label;
          }
        }
        a[a.length] = ar[i];
      }
      return a;
    }
  
    function qwery(selector, _root) {
      var root = (typeof _root == 'string') ? qwery(_root)[0] : (_root || doc);
      if (!root || !selector) {
        return [];
      }
      if (m = boilerPlate(selector, _root, qwery)) {
        return m;
      }
      return select(selector, root);
    }
  
    var isAncestor = 'compareDocumentPosition' in html ?
      function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16;
      } : 'contains' in html ?
      function (element, container) {
        container = container == doc || container == window ? html : container;
        return container !== element && container.contains(element);
      } :
      function (element, container) {
        while (element = element.parentNode) {
          if (element === container) {
            return 1;
          }
        }
        return 0;
      },
  
    select = (doc.querySelector && doc.querySelectorAll) ?
      function (selector, root) {
        if (doc.getElementsByClassName && (m = selector.match(classOnly))) {
          return array((root).getElementsByClassName(m[1]));
        }
        return array((root).querySelectorAll(selector));
      } :
      function (selector, root) {
        selector = selector.replace(normalizr, '$1');
        var result = [], collection, collections = [], i;
        if (m = selector.match(tagAndOrClass)) {
          items = root.getElementsByTagName(m[1] || '*');
          r = classCache.g(m[2]) || classCache.s(m[2], new RegExp('(^|\\s+)' + m[2] + '(\\s+|$)'));
          for (i = 0, l = items.length, j = 0; i < l; i++) {
            r.test(items[i].className) && (result[j++] = items[i]);
          }
          return result;
        }
        for (i = 0, items = selector.split(','), l = items.length; i < l; i++) {
          collections[i] = _qwery(items[i]);
        }
        for (i = 0, l = collections.length; i < l && (collection = collections[i]); i++) {
          var ret = collection;
          if (root !== doc) {
            ret = [];
            for (j = 0, m = collection.length; j < m && (element = collection[j]); j++) {
              // make sure element is a descendent of root
              isAncestor(element, root) && ret.push(element);
            }
          }
          result = result.concat(ret);
        }
        return uniq(result);
      };
  
    qwery.uniq = uniq;
    qwery.pseudos = {};
  
    var oldQwery = context.qwery;
    qwery.noConflict = function () {
      context.qwery = oldQwery;
      return this;
    };
    context['qwery'] = qwery;
  
  }(this, document);

  provide("qwery", module.exports);

  !function (doc) {
    var q = qwery.noConflict();
    var table = 'table',
        nodeMap = {
          thead: table,
          tbody: table,
          tfoot: table,
          tr: 'tbody',
          th: 'tr',
          td: 'tr',
          fieldset: 'form',
          option: 'select'
        }
    function create(node, root) {
      var tag = /^<([^\s>]+)/.exec(node)[1]
      var el = (root || doc).createElement(nodeMap[tag] || 'div'), els = [];
      el.innerHTML = node;
      var nodes = el.childNodes;
      el = el.firstChild;
      els.push(el);
      while (el = el.nextSibling) {
        (el.nodeType == 1) && els.push(el);
      }
      return els;
    }
    $._select = function (s, r) {
      return /^\s*</.test(s) ? create(s, r) : q(s, r);
    };
    $.pseudos = q.pseudos;
    $.ender({
      find: function (s) {
        var r = [], i, l, j, k, els;
        for (i = 0, l = this.length; i < l; i++) {
          els = q(s, this[i]);
          for (j = 0, k = els.length; j < k; j++) {
            r.push(els[j]);
          }
        }
        return $(q.uniq(r));
      }
      , and: function (s) {
        var plus = $(s);
        for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
          this[i] = plus[j];
        }
        return this;
      }
    }, true);
  }(document);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

  
  /*!
   * move
   * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
   * MIT Licensed
   */
  
  !function(context){
  
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
  
    move = function(selector) {
      return new Move(move.select(selector));
    };
  
    /**
     * Library version.
     */
  
    move.version = '0.0.3';
  
    /**
     * Defaults.
     * 
     *   `duration` - default duration of 500ms
     * 
     */
  
    move.defaults = {
      duration: 500
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
  
    Move = function Move(el) {
      if (!(this instanceof Move)) return new Move(el);
      EventEmitter.call(this);
      this.el = el;
      this._props = {};
      this._rotate = 0;
      this._transitionProps = [];
      this._transforms = [];
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
      return this.setVendorProperty('transition-timing-function', fn);
    };
  
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
      return this.setVendorProperty('transition-duration', n + 'ms');
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
      return this.setVendorProperty('transition-delay', n + 'ms');
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
     * Set a vendor prefixed `prop` with the given `val`.
     *
     * @param {String} prop
     * @param {String} val
     * @return {Move} for chaining
     * @api public
     */
  
    Move.prototype.setVendorProperty = function(prop, val){
      this.setProperty('-webkit-' + prop, val);
      this.setProperty('-moz-' + prop, val);
      this.setProperty('-ms-' + prop, val);
      this.setProperty('-o-' + prop, val);
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
     * Commit style properties, aka apply them to `el.style`.
     *
     * @return {Move} for chaining
     * @see Move#end()
     * @api private
     */
  
    Move.prototype.applyProperties = function(){
      var props = this._props
        , el = this.el;
  
      for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
          el.style.setProperty(prop, props[prop], '');
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
        this.setVendorProperty('transform', this._transforms.join(' '));
      }
  
      // transition properties
      this.setVendorProperty('transition-properties', this._transitionProps.join(', '));
      this.applyProperties();
  
      // callback given
      if (fn) this.then(fn);
  
      // emit "end" when complete
      setTimeout(function(){
        self.emit('end');
      }, this._duration);
  
      return this;
    };
    
    
    
    var oldMove = context.move;
    move.noConflict = function() {
      context.move = oldMove;
      return this;
    };
    (typeof module !== 'undefined' && module.exports && (module.exports = move));
    context['move'] = move;
  
  }(this);
  

  provide("movejs", module.exports);

  !function ($) {
    var move = require('movejs');
    
    move.select = function (selector) {
      return $(selector)[0];
    };
    
    $.ender({
      move: function () {
        return move(this);
      }
    }, true);
  }(ender);

}();