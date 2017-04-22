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
  resultModule.createNotification = function(settings) {
    var options = {
        "type" : "list"
        ,"title": "Webpage Update Notifier"
        ,"message": "New updates : "  // Not using
        ,"expandedMessage": "Go to : " // Not using
        ,"iconUrl" : "icon.png"
        ,"requireInteraction" : true // so it wont close for default 5 sec until i set so
        ,"items": [
          { "title": "New updates!", "message": "Click to open."}
          ,{ "title": ""+settings.webTitle, "message": ""}
          ,{ "title": "", "message": ""+settings.lastGetNeededJson}
        ]
      }
      var nid = "nid" + Math.floor(Math.random() * 999999);
      chrome.notifications.create(nid, options , creationNotificationCallback);

      function creationNotificationCallback(id) {
        chrome.notifications.onClicked.addListener( function (id) {
            if (nid === id) {
                chrome.tabs.create({
                    "url" : "http://" + settings.website
                    ,"active" : true
                }, creationCallback);
            }
        });
        setTimeout(function() {
            chrome.notifications.clear(id, function(wasCleared) {
                
            });
        }, 2000);
      }

      function creationCallback(notID) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
        }
      }

  };

  return resultModule;
}());
