var bgPage = chrome.extension.getBackgroundPage();
var globalData = bgPage.globalData;

window.addEventListener("load", function() {
  document.getElementById("button").addEventListener("click", openApp);
});

function websiteTable(n, w, k, o) {
  var name = document.createElement('input');
  name.type = 'text';
  name.value = n;
  document.body.appendChild(name);
  
  var website = document.createElement('input');
  website.type = 'text';
  website.value = w;
  document.body.appendChild(website);

  var ruleKey = document.createElement('input');
  ruleKey.type = 'text';
  ruleKey.value = k;
  document.body.appendChild(ruleKey);
  
  var ruleObj = document.createElement('input');
  ruleObj.type = 'text';
  ruleObj.value = o;
  document.body.appendChild(ruleObj);
  
};

document.addEventListener('DOMContentLoaded', function () {
  for (var i in globalData.websites) {
    var web = globalData.websites[i];
    websiteTable(web.name, web.website, web.rules.ruleKey, web.rules.ruleObj);
  }
});


