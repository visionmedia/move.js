0.5.0 / 2015-05-09
==================

 * add npm / browserify support, closes #41 and #42 [axelpale]
 * remove `remotes` from component.json, closes #71 [axelpale]
 * add legacy IE browsers support [nobuti]

0.4.0 / 2014-09-08
==================

 * Add Move.matrix() [abliss]
 * Remove transition duration properties instead of setting them to 0 [kimmobrunfeldt]
 * add third argument to .setProperty [eivindfjeldstad]

0.3.3 / 2013-11-11
==================

 * add ie10 support, closes #32

0.3.2 / 2013-09-30
==================

 * use css component, closes #26
 * fix css number values, closes #30

0.3.1 / 2013-09-28
==================

 * reset duration on "end", closes #4

0.3.0 / 2013-09-28
==================

 * use after-transition, closes #25 and #22
 * move easing functions to a different component, closes #27

0.2.2 / 2013-09-27
==================

 * use .setProperty(), remove component/css dep, closes #24

0.2.1 / 2013-09-26
==================

 * update examples and docs
 * fixed typo in Move.prototype.ease function [olegomon]
 * use translate3d() when available

0.2.0 / 2013-09-16
==================

 * add component.json

0.1.1 / 2011-12-10
==================

  * Revert "Changed CSS property transition-properties to transition-property"

0.1.0 / 2011-11-16
==================

  * Added more cubic-bezier ease functions [onirame]

0.0.4 / 2011-10-25
==================

  * Remove resets in duration timeout causing undesired behaviour
  * Changed CSS property transition-properties to transition-property

0.0.3 / 2011-08-27
==================

  * Added: allow passing of element to `move()`

0.0.2 / 2011-06-04
==================

  * Added map of properties and defaults for numeric values
  * Fixed FireFox support [bluntworks]
  * Fixed easing example with html doctype
  * Fixed second notation for delay / duration
  * Fixed duration / delay, append "ms"

0.0.1 / 2011-06-01
==================

  * Initial release
