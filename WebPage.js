/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 19, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

/////////////////////////////////////////////////////////////////////////////////////////
/// Webpage handler
/////////////////////////////////////////////////////////////////////////////////////////

class WebPage{
  constructor(website, rules) {
    this.name = "name"+Math.floor(Math.random() * 99999);
    this.website = website;
    this.webInTab = new WebInTab(this.website);
    this.rules = rules;
    this.setupAlarm();
    this.setupSourceListener();
  }

  setupAlarm() {
    /////////////////////////////////////////////////////////
    /// Alarm timer
    /////////////////////////////////////////////////////////
    var reloadWebsiteAlarm = "reloadWebsiteAlarm"+this.name;
    var that = this;
    chrome.alarms.create(reloadWebsiteAlarm, {
        delayInMinutes: 0,
        periodInMinutes: 1
    });

    function reloadTabCallback() {
      var datas = {
        "tabId" : that.currentTabId
        ,"webName": that.name
      }
      
      chrome.tabs.executeScript(that.currentTabId, {
          code: 'var datas = ' + JSON.stringify(datas)
      }, function() {
          chrome.tabs.executeScript(that.currentTabId, {file: "getPagesSource.js"});
      });
    }
    function newTabCallback(newTab) {
      that.currentTabId = newTab.id;
      reloadTabCallback();
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === reloadWebsiteAlarm) {
          that.currentTabId = that.webInTab.tabId;
          if (that.currentTabId > 0) {
            chrome.tabs.reload(that.currentTabId, reloadTabCallback);
          }
          else {
            chrome.tabs.create({url: "http://"+that.website, active : false}, newTabCallback);
          }
          // chrome.windows.create({url: "http://"+that.website, type: "popup", state : "minimized"}, newWindowsCallback);
          
        }
    });
  }

  setupSourceListener() {
    var that = this;
    chrome.runtime.onMessage.addListener(function(request, sender) {
      if (request.action == "getSource"+that.name) {
        if(request.source && request.source.datas && request.source.datas.tabId) {
          // chrome.tabs.remove(request.source.datas.tabId);
          
          var requiredJsonPage = html2json(request.source.html);
          
          that.handleUpdateSource(requiredJsonPage);
        }
      }
    });
  }

  handleUpdateSource(handlingJson) {
   var that = this;
    var getJson = JsonManipulations.jsonAction(handlingJson, jsonGetRequired);
    
    if (!this.webTitle) {
      var getTitleJson = JsonManipulations.jsonAction(handlingJson, jsonGetTitle);
      this.webTitle = getTitleJson.manipulatedItems;
    }
    
    // TODO : rewrite to handle adblock UI blue box for selection html element wrap
    this.getNeededJson = getJson.manipulatedItems[0]["title"];
    
    if (!this.lastGetNeededJson || this.getNeededJson != this.lastGetNeededJson) {
      console.log ("Old : " + this.lastGetNeededJson + " - New : " + this.getNeededJson);
    
      this.lastGetNeededJson = this.getNeededJson;
      var notificationSettings = {
        "webTitle" : this.webTitle
        ,"lastGetNeededJson" : this.lastGetNeededJson
        ,"website" : this.website
      }
      UIHandler.createNotification(notificationSettings);
    }

    function jsonGetRequired(jsonObj, key) {
      for (var i in that.rules) {
        var rule = that.rules[i];
        if (!(key === rule.ruleKey && jsonObj[key] == rule.ruleObj)) {
          return null;
        }
      }
      return jsonObj;
    }

    function jsonGetTitle(jsonObj, key) {
      if (key === 'tag' && jsonObj[key] === 'head') {
        var head = jsonObj['child'];
        for (var h in head) {
          var node = head[h];
          if (node['tag'] === 'title') {
            var title = node['child'][0];
            return title.text;
          }
        }
      }
      return null;
    }
  }
}

/*
requestCrossDomain() {
    // If no url was passed, exit.
    if ( !this.website ) {
      console.log('No site was passed.');
      return false;
    }

    var that = this;

    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + this.website + '"' );//  + '&format=xml&callback=cbFunc';
    yql += ' and xpath="/html"';
    yql += '&format=json';
    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    var response = $.getJSON( yql , saveSource);

    function saveSource(data) {
    
      var event; // The custom event that will be created

      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("updateSource", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "updateSource";
      }

      event.eventName = "updateSource";
      event.data = data;
      event.data.objName = that.name;
      if (document.createEvent) {
        document.dispatchEvent(event);
      } else {
        document.fireEvent("on" + event.eventType, event);
      }
    }
  }

  


window.addEventListener("updateSource", function(e) {
  for (var w in globalData.websites) {
    var ob = globalData.websites[w];
    
    if (ob.name === e.data.objName) {
      ob.event = e;
      ob.handleUpdateSource();
    }
  }
});

*/
