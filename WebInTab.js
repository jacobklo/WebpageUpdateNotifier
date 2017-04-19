class WebInTab {
  constructor (url) {
    this.url = url;
    this.tabId = -1;
    this.checkIfUrlExistInTabs(this.url);

    var that = this;

    chrome.tabs.onCreated.addListener(function (tab) {
      that.doCreate(tab);
    });
    chrome.tabs.onUpdated.addListener(function () {
      that.checkIfUrlExistInTabs(that.url);
    });
    chrome.tabs.onRemoved.addListener(function (tabId) {
      that.doRemove(tabId);
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

  checkIfUrlExistInTabs(url) {
    if (!url) { this.tabId = -1; }
    
    var that = this;
    chrome.tabs.query({},function(tabs){     
      tabs.forEach(function(tab){
        if (that.compareUrls(url, tab.url)) {
          console.log (tab.id + " ::: " + url + " ::: " + tab.url);
          that.tabId = tab.id;
          return;
        }
      });
    });
    this.tabId = -1;
  }
}
