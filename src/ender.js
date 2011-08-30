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