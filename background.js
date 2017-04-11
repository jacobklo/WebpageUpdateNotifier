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

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === reloadWebsiteAlarm) {
        console.log ("Heelo");
        chrome.notifications.create("id",notOptions[0] , creationCallback);
    }
});

function creationCallback(notID) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        // Tab exists
    }
}
