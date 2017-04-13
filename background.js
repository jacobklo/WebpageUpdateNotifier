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

var globalData = {};
globalData.websites = [
    {
        "web" : "book.qidian.com/info/3513193"
        ,"rulesKey" : "data-eid"
        ,"rulesObj" : "qd_G19"
    }
    ,{
        "web" : "book.qidian.com/info/1004608738"
        ,"rulesKey" : "data-eid"
        ,"rulesObj" : "qd_G19"
    }
];

chrome.alarms.create(reloadWebsiteAlarm, {
    delayInMinutes: 0,
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === reloadWebsiteAlarm) {
        console.log ("Heel0o");
        for (var w in globalData.websites) {
            var obj = globalData.websites[w];
            console.log (obj);
            requestCrossDomain(obj.web);
        }
    }
});

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
  for (var w in globalData.websites) {
    var obj = globalData.websites[w];
    if ( key === obj.rulesKey && jsonObj[key]=== obj.rulesObj) {
        console.log ( " jsonGetRequired");
        return jsonObj;
    }
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