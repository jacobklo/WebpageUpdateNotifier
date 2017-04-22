
// From Adblock, Author: Adblock's developers
// GNU GENERAL PUBLIC LICENSE
// 
// Highlight DOM elements with an overlayed box, similar to Webkit's inspector.
// Creates an absolute-positioned div that is translated & scaled following
// mousemove events. Holds a pointer to target DOM element.
function Highlighter() {
  var target = null;
  var enabled = false;
  var then = Date.now();
  var box = $("<div class='adblock-highlight-node'></div>");
  box.appendTo("body");

  this.getCurrentNode = function(el) {
    return el === box[0] ? target : el;
  };
  this.enable = function() {
    if (box && !enabled) {
      $("body").bind("mousemove", handler);
    }
    enabled = true;
  };
  this.disable = function() {
    if (box && enabled) {
      box.hide();
      $("body").unbind("mousemove", handler);
    }
    enabled = false;
  };
  this.destroy = function() {
    this.disable();
    if (box) {
      box.remove();
      box = null;
    }
  };

  function handler(e) {
    var offset, el = e.target;
    var now = Date.now();
    if (now - then < 25) {
      return;
    }
    then = now;
    if (el === box[0]) {
      box.hide();
      el = document.elementFromPoint(e.clientX, e.clientY);
    }
    if (el === target) {
      box.show();
      return;
    }
    if (el === document.body || el.className === "adblock-killme-overlay") {
      box.hide();
      return;
    }

    el = $(el);
    target = el[0];
    offset = el.offset();
    box.css({
      height: el.outerHeight(),
      width: el.outerWidth(),
      left: offset.left,
      top: offset.top
    });
    box.show();
  }
}

this._highlighter = new Highlighter();
this._highlighter.enable();