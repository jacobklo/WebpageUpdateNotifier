/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 19, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

var UIHandler = (function() {
  var resultModule = {};
  
  //// Constructor
  chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.windows.create(
        {url: "app.html", type: "popup", width: 500, height: 800}
        , function(newWin) {
          
        });
  });
  //// Private Members
  var menuCreateNewUpdate = chrome.contextMenus.create(
    {"title": "Create New Update", "contexts": ["all"], "onclick": createNewUpdate});
  var menuAbout = chrome.contextMenus.create(
    {"title": "About", "contexts": ["all"], "onclick": createNewUpdate});

  //// Private Methods
  function createNewUpdate(info, tab) {
    chrome.tabs.insertCSS(tab.id, {
      file: 'box.css'
    });
    chrome.tabs.executeScript(tab.id, {
      file: 'jQuery.min.js'
    });
    chrome.tabs.executeScript(tab.id, {
      file: 'executeHighlight.js'
    });
    console.log("tab: " + JSON.stringify(tab));
  };

  //// Public Methods
  
  return resultModule;
}());
