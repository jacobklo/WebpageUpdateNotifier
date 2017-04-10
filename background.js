var reloadWebsiteAlarm = "reloadWebsiteAlarm";

var notOptions = [
    {
        type : "basic",
        title: "Basic Notification",
        message: "Short message part",
        expandedMessage: "Longer part of the message",
        
    }
]
chrome.alarms.create(reloadWebsiteAlarm, {
    delayInMinutes: 0,
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === reloadWebsiteAlarm) {
        console.log ("Heelo");
        chrome.notifications.create("id"+notID++,notOptions[0] , creationCallback);
    }
});

function creationCallback(notID) {
    console.log ("finish");
}