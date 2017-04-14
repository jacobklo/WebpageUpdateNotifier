var reloadWebsiteAlarm = "reloadWebsiteAlarm";

var notOptions = [
    {
        "type" : "basic",
        "title": "Basic Notification",
        "message": "Short message part",
        "expandedMessage": "Longer part of the message",
        "iconUrl" : "icon.png"
    }
]
chrome.alarms.create(reloadWebsiteAlarm, {
    delayInMinutes: 0,
    periodInMinutes: 1
});

var globalData = {};
globalData.disabled = false;

class WebPage{
  constructor(name, website, rules) {
    this.name = name;
    this.website = website;
    this.rules = rules;
    this.requestCrossDomain();
    this.handleUpdateSource();
  }

  requestCrossDomain() {
    
    // If no url was passed, exit.
    if ( !this.website ) {
      console.log('No site was passed.');
      return false;
    }

    var that = this;

    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + this.website + '"');//  + '&format=xml&callback=cbFunc';
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

  handleUpdateSource() {
    if (!this.event) {
      console.log ( "This.e is not set");
      return;
    }
    var e = this.event;
    var that = this;
    var getJson = jsonAction(e.data, jsonGetRequired);
    this.getNeededJson = getJson.manipulatedItems[0]["title"];
    console.log (this.getNeededJson);
    if (!this.lastGetNeededJson || this.getNeededJson != this.lastGetNeededJson) {
      console.log (this.lastGetNeededJson);
      console.log (this.getNeededJson);
      
      this.lastGetNeededJson = this.getNeededJson;
      chrome.notifications.create("id",notOptions[0] , creationCallback);
    }

    function jsonGetRequired(jsonObj, key) {
      if (key === that.rules.ruleKey && jsonObj[key] === that.rules.ruleObj) {
        return jsonObj;
      }
      return null;
    }

    function creationCallback(notID) {
      if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
      }
    }

    function jsonAction(jsonObj, actionFunction) {
      var manipulatedItems = [];
      var result = subJsonAction(jsonObj, actionFunction, manipulatedItems);
      return {
        manipulatedItems: manipulatedItems
        , result: result
      }

      function subJsonAction(jsonObj, actionFunction, manipulatedItems) {
        if (!jsonObj || !actionFunction) {
          return {};
        }
        if (jsonObj.constructor === Array) {
          for (var i = 0; i < jsonObj.length; i++) {
            subJsonAction(jsonObj[i], actionFunction, manipulatedItems);
          }
        }
        else {
          for (var key in jsonObj) {
            var doAction = actionFunction(jsonObj, key);
            if (doAction) {
              manipulatedItems.push(doAction);
            }
            else if (isNaN(key)) {
              subJsonAction(jsonObj[key], actionFunction, manipulatedItems);
            }
          }
        }
        return jsonObj;
      }
    }
  }
}

var website1 = new WebPage("website1" , "book.qidian.com/info/3513193", {
  "ruleKey" : "data-eid"
  ,"ruleObj" : "qd_G19"
});
var website2 = new WebPage("website2" , "book.qidian.com/info/1003694333", {
  "ruleKey" : "data-eid"
  ,"ruleObj" : "qd_G19"
});

globalData.websites = [ website1, website2 ];

window.addEventListener("updateSource", function(e) {
  for (var w in globalData.websites) {
    var ob = globalData.websites[w];
    
    if (ob.name === e.data.objName) {
      ob.event = e;
      ob.handleUpdateSource();
    }
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === reloadWebsiteAlarm) {
        for (var w in globalData.websites) {
         globalData.websites[w].requestCrossDomain();
        }
    }
});
