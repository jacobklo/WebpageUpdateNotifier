class WebInTab {
  constructor (url) {
    this.url = url;
    this.tabId = this.checkIfUrlExistInTabs(this.url, null);

    var that = this;

    chrome.tabs.onCreated.addListener(function (tab) {
      that.doCreate(tab);
    });
    chrome.tabs.onUpdated.addListener(function () {
      that.tabId = that.checkIfUrlExistInTabs(that.url, null);
    });
    chrome.tabs.onRemoved.addListener(function (tabId) {
      that.doRemove(tabId);
    });

    var rechecktabAlarm = "rechecktabAlarm"+Math.floor(Math.random()*99999);
    var that = this;
    chrome.alarms.create(rechecktabAlarm, {
        delayInMinutes: 0,
        periodInMinutes: 2
    });
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if (alarm.name === rechecktabAlarm) {
        that.tabId = that.checkIfUrlExistInTabs(that.url, null);
      }
    });
  }

  doCreate(tab) {
    if (this.compareUrls(this.url, tab.url)) {
      this.tabId = tab.id;
    }
  }

  doRemove(tabId) {
    if (this.tabId === tabId) {
      this.tabId = -1;
    }
  }

  compareUrls(url1, url2) {
    var prefix = /^https?:\/\//;
    url1 = url1.replace(prefix, "");
    url2 = url2.replace(prefix, "");
    return (url1.includes(url2) || url2.includes(url1));
  }

  checkIfUrlExistInTabs(url, callback) {
    if (!url) { return -1; }
    
    var that = this;
    chrome.tabs.query({},function(tabs){     
      tabs.forEach(function(tab){
        if (that.compareUrls(url, tab.url)) {
          // console.log (tab.id + " ::: " + url + " ::: " + tab.url);
          if (callback ) { callback(tab.id); }
          return tab.id;
        }
      });
    });
    if (callback ) { callback(-1); }
    return -1;
  }
}
