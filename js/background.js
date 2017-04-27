/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 16, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */
'use strict';

var globalData = {};

require(['./common'], function() {
  require(['js/background/loadLib'], function() {
    require(['js/background/loadUtil'], function() {
      require(['js/background/UIHandler','js/background/WebPage','defaultWebJson.js'], function() {

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "ClickWatcherEvent") {
    if (request.result && request.result.webUrl && request.result.DOMObj) {
      if (!globalData.websites) {
        var newWeb = new WebPage(request.result.webUrl, request.result.DOMObj);
        globalData.websites = [];
        globalData.websites.push(newWeb);
      }
      else {
        for (var w in globalData.websites) {
          var web = globalData.websites[w];
          if (web.website == request.result.webUrl) {
            web.DOMObj = request.result.DOMObj;
            return;
          }
        }
      }
    }
  }
});

      });
    });
  });


});

/*
/////////////////////////////////////////////////////////////////////////////////////////
/// Start of background handler, loading default websites json
/////////////////////////////////////////////////////////////////////////////////////////

function parseWebsites(webJson) {
  var result = [];
  for ( var i in webJson ) {
    var web = webJson[i];
    if ( web.website && web.rules) {
      var newWeb = new WebPage(web.website , web.rules);
      result.push(newWeb);
    }
  }
  return result;
}

function parseJson(webJsonString) {
  if (!webJsonString) { return null; }
  var webJson = JSON.parse(webJsonString);
  if (!webJson) { return null; }
  if (webJson.constructor !== Array ) { return null; }
  return webJson;
}

function renewJson() {

  var newJson = parseJson(globalData.webJson);
  if (newJson) {
    globalData.websites = parseWebsites(newJson);
  }
}

globalData.webJson = webJson;
globalData.websites = parseWebsites(webJson);
 */