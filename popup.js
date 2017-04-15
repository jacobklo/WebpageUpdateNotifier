var bgPage = chrome.extension.getBackgroundPage();
var globalData = bgPage.globalData;


document.addEventListener('DOMContentLoaded', function () {
  for (var i in globalData.websites) {
    var web = globalData.websites[i];
    alert(web);
  }
});


/*
function websiteTable(n, w, k, o) {
  var name = document.createElement('input');
  name.type = 'text';
  name.value = n;
  document.body.appendChild(name);
  
  var website = document.createElement('input');
  website.type = 'text';
  website.value = w;
  document.body.appendChild(websites);

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
  console.log ("DOMContentLoaded");
  for (var i in globalData.websites) {
    var web = globalData.websites[i];
    console.log (web);
    websiteTable(web.name, web.wesite web.rules.ruleKey, web.rules.ruleObj);
  }
});

 */


