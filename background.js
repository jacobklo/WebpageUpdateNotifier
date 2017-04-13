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
    console.log ("WebPage.prototype.requestCrossDomain");
    
    // If no url was passed, exit.
    if ( !this.website ) {
      console.log('No site was passed.');
      return false;
    }

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
      event.name = this.name;
      event.data = data;

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
    console.log ("listened to handleUpdateSource");
    var getJson = this.jsonAction(e.data, jsonGetRequired);
    this.getNeededJson = getJson.manipulatedItems[0]["title"];
    console.log (this.getNeededJson);
    if (!this.lastGetNeededJson || this.getNeededJson != this.lastGetNeededJson) {
      console.log (this.lastGetNeededJson);
      console.log (this.getNeededJson);
      
      this.lastGetNeededJson = this.getNeededJson;
      chrome.notifications.create("id",notOptions[0] , creationCallback);
      console.log ("updateSource updateSource");
    }

    function jsonGetRequired(jsonObj, key) {
      if (key === this.rules.ruleKey && jsonObj[key] === this.rules.ruleObj) {
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

globalData.websites = [ website1 ];

window.addEventListener("updateSource", function(e) {
  for (var w in globalData.websites) {
    if (globalData.websites[w].name === e.name) {
      globalData.websites[w].event = e;
      globalData.websites[w].handleUpdateSource();
    }
  }
});

class Shape {
  constructor (id, x ,y) {
    this.id = id;
    this.move(x,y);
  }
  move(x,y) {
    this.x = x;
    this.y = y;
    console.log( this.x + this.y);
  }
  move2(x,y) {
    this.move(x,y);
  }
};
//////////////////////////////////////////////////
///
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === reloadWebsiteAlarm) {
        console.log ("Heel0o");
        for (var w in globalData.websites) {
         globalData.websites[w].requestCrossDomain();
        }
    }
});

/*
function creationCallback(notID) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    }
}


window.addEventListener("updateSource", function(e) {
  console.log ("listened to updateSource");
  var getJson = jsonAction(e.data, jsonGetRequired);
  globalData.getNeededJson = getJson.manipulatedItems[0]["title"];
  console.log (globalData.getNeededJson);
  if (!globalData.lastGetNeededJson || globalData.getNeededJson != globalData.lastGetNeededJson) {
    console.log (globalData.lastGetNeededJson);
    console.log (globalData.getNeededJson);
    
    globalData.lastGetNeededJson = globalData.getNeededJson;
    chrome.notifications.create("id",notOptions[0] , creationCallback);
    console.log ("updateSource updateSource");
  }
});

function jsonGetRequired(jsonObj, key) {
  if (key === 'data-eid' && jsonObj[key] === "qd_G19") {
    return jsonObj;
  }
  return null;
}

function requestCrossDomain(site) {
  console.log ("requestCrossDomain");
  
  // If no url was passed, exit.
  if ( !site ) {
    console.log('No site was passed.');
    return false;
  }

  // Take the provided url, and add it to a YQL query. Make sure you encode it!
  var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"');//  + '&format=xml&callback=cbFunc';
  yql += '&format=json';
  // Request that YSQL string, and run a callback function.
  // Pass a defined function to prevent cache-busting.
  var response = $.getJSON( yql , saveSource);
}

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

  if (document.createEvent) {
    document.dispatchEvent(event);
  } else {
    document.fireEvent("on" + event.eventType, event);
  }
}

function jsonAction(jsonObj, actionFunction) {
  var manipulatedItems = [];
  var result = subJsonAction(jsonObj, actionFunction, manipulatedItems);
  return {
    manipulatedItems: manipulatedItems
    , result: result
  }
  }

function subJsonAction(jsonObj, actionFunction, manipulatedItems) {
  if (!jsonObj || !actionFunction) {
    return {};
  }
  if (jsonObj.constructor === Array) {
    for (var i = 0; i < jsonObj.length; i++) {
      this.subJsonAction(jsonObj[i], actionFunction, manipulatedItems);
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
*/