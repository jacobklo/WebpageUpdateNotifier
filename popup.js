window.addEventListener("updateSource", function(e) {
  console.log ("listened to updateSource");
  console.log (e.data);
});

function doDown(event) {
  console.log ("doDown");
  requestCrossDomain("imgur.com");
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