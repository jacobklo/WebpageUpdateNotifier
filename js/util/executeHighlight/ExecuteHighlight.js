
// From Adblock, Author: Adblock's developers
// GNU GENERAL PUBLIC LICENSE
// 
// Highlight DOM elements with an overlayed box, similar to Webkit's inspector.
// Creates an absolute-positioned div that is translated & scaled following
// mousemove events. Holds a pointer to target DOM element.
var Highlighter = (function ($) {
  var resultModule = {};

  var target = null;
  var enabled = false;
  var then = Date.now();
  var box = $("<div class='adblock-highlight-node'></div>");
  box.appendTo("body");

  resultModule.getCurrentNode = function(el) {
    return el === box[0] ? target : el;
  };
  resultModule.enable = function() {
    if (box && !enabled) {
      $("body").bind("mousemove", handler);
    }
    enabled = true;
  };
  resultModule.disable = function() {
    if (box && enabled) {
      box.hide();
      $("body").unbind("mousemove", handler);
    }
    enabled = false;
  };
  resultModule.destroy = function() {
    resultModule.disable();
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
    console.log (el.id);
    if (el === document.body || el.className === "selectDialog" || el.className === "selectDialogInfo") {
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

  return resultModule;
}(jQuery));

var ClickWatcher = (function ($) {
  
  var resultModule = {};

  resultModule.show = function() {
    console.log ("ClickWatcher.show()");
    var selectDialogInfo = $("<p/>")
      .attr("class", "selectDialogInfo")
      .text("Select a element in this web page, We will help you monitor that element to see if it has updates");
    var selectDialog = $("<div/>")
      .attr("class", "selectDialog")
      .attr("title", "Select a element you want to monitor")
      .append(selectDialogInfo)
      .dialog();
  };

  return resultModule;
}(jQuery));

