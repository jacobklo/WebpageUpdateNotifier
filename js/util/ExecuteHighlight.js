
var ClickWatcherEvent = (function() {
  var resultModule = {};

  resultModule.sendClickWatcherEvent = function(webUrl, DOMObj) {
    
    chrome.runtime.sendMessage({
      action: "ClickWatcherEvent"
      ,result : {
        "webUrl" : webUrl
        ,"DOMObj" : DOMObj
      }
    });
  }
  
  return resultModule;
}());


// From Adblock, Author: Adblock's developers
// GNU GENERAL PUBLIC LICENSE
// 
// Highlight DOM elements with an overlayed box, similar to Webkit's inspector.
// Creates an absolute-positioned div that is translated & scaled following
// mousemove events. Holds a pointer to target DOM element.
var Highlighter = (function ($) {
  var resultModule = {};

  resultModule.target = null;
  var enabled = false;
  var then = Date.now();
  var boxStyle = 
  {
    "background-color": "rgba(130, 180, 230, 0.5)"
    ,"outline": "solid 1px #0F4D9A"
    ,"box-sizing": "border-box"
    ,"position": "absolute"
    ,"display": "none"
  };
  var box = $("<div/>").css(boxStyle).appendTo("body");
  resultModule.box = box;

  resultModule.getCurrentNode = function(el) {
    return el === box[0] ? resultModule.target : el;
  };
  resultModule.enable = function() {
    if (box && !enabled) {
      $("body").bind("mousemove", movehandler);
    }
    enabled = true;
  };
  resultModule.disable = function() {
    if (box && enabled) {
      box.hide();
      $("body").unbind("mousemove", movehandler);
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

  // additional condition to temporary disable the box
  resultModule.TemporaryDisableOption = false;
  resultModule.TemporaryDisablefunction = null;

  function movehandler(e) {
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
    if (el === resultModule.target) {
      box.show();
      return;
    }
    if (el === document.body || resultModule.TemporaryDisableOption) {
      box.hide();
      return;
    }
    if (resultModule.TemporaryDisable && resultModule.TemporaryDisable(e.pageX, e.pageY)) {
      box.hide();
      return;
    }

    el = $(el);
    resultModule.target = el[0];
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

var ClickWatcher = (function (Highlighter, $) {
  
  var resultModule = {};

  resultModule.show = function() {
    var btn = {};
    btn["close"] = function() {
      selectDialog.dialog('close');
    };

    var selectDialogInfo = $("<p/>")
      .text("Select a element in this web page, We will help you monitor that element to see if it has updates");
    var selectDialog = $("<div/>")
      .attr("class", "selectDialog")
      .attr("title", "Select a element you want to monitor")
      .append(selectDialogInfo)
      .dialog({
        buttons: btn
        ,close: function() {
          Highlighter.disable();
        }
      });

      Highlighter.TemporaryDisable = function (x,y) {
        if (!selectDialog) { return false; }

        var o = selectDialog.dialog("open").closest('.ui-dialog').offset();
        var left = o.left;
        var right = o.left + selectDialog.outerWidth();
        var top = o.top;
        var bottom = o.top + selectDialog.outerHeight()+100;

        var isXInside = x > left && x < right;
        var isYInside = y > top && y < bottom;
        
        return isXInside && isYInside;
      };
      Highlighter.box.click(function(eventData) {
        if (selectDialog) {
          selectDialog.dialog('close');
          Highlighter.disable();
          ClickWatcherEvent.sendClickWatcherEvent(eventData.currentTarget.baseURI, Highlighter.target.outerHTML);
        }
      });
      Highlighter.enable();

  };

  return resultModule;
}(Highlighter, jQuery));

