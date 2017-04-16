var bgPage = chrome.extension.getBackgroundPage();
var globalData = bgPage.globalData;

function addRules(rule, tableId) {
  var trName = document.createElement('tr');
  document.getElementById("table"+tableId).appendChild(trName);
  
  var tdRuleKey = document.createElement('td');
  trName.appendChild(tdRuleKey);
  var ruleKey = document.createElement('input');
  ruleKey.type = 'text';
  ruleKey.value = "ruleKey";
  tdRuleKey.appendChild(ruleKey);
  
  var tdRuleKeyInput = document.createElement('td');
  trName.appendChild(tdRuleKeyInput);
  var ruleKeyInput = document.createElement('input');
  ruleKeyInput.type = 'text';
  ruleKeyInput.value = rule.ruleKey;
  tdRuleKeyInput.appendChild(ruleKeyInput);


}

function websiteTable(n, w, r) {
  
  var div = document.createElement('div');
  document.body.appendChild(div);
  var info = document.createElement('p');
  if (n && w) {
    info.value = n;
  }
  else {
    info.value = "Create new website to monitor :";
  }
  div.appendChild(info);

  var table = document.createElement('table');
  var tableId = Math.floor(Math.random() * 9999);
  table.id = "table"+tableId;
  div.appendChild(table);
  var trName = document.createElement('tr');
  table.appendChild(trName);
  
  var tdName = document.createElement('td');
  trName.appendChild(tdName);
  var name = document.createElement('input');
  name.type = 'text';
  name.value = "Web Name : ";
  tdName.appendChild(name);
  
  var tdNameInput = document.createElement('td');
  trName.appendChild(tdNameInput);
  var nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = n;
  tdNameInput.appendChild(nameInput);

  var trWebsite = document.createElement('tr');
  table.appendChild(trWebsite);
  
  var tdWebsite = document.createElement('td');
  trWebsite.appendChild(tdWebsite);
  var website = document.createElement('input');
  website.type = 'text';
  website.value = "Url : ";
  tdWebsite.appendChild(website);

  var tdWebsiteInput = document.createElement('td');
  trWebsite.appendChild(tdWebsiteInput);
  var websiteInput = document.createElement('input');
  websiteInput.type = 'text';
  websiteInput.value = w;
  tdWebsiteInput.appendChild(websiteInput);

  if (r) {
    for (var i in r) {
      var rule = r[i];
      addRules(rule, tableId);
    }
  }
  var spacer = document.createElement('p');
  spacer.value = '--';
  div.appendChild(spacer);
  
};

document.addEventListener('DOMContentLoaded', function () {
  for (var i in globalData.websites) {
    var web = globalData.websites[i];
    //websiteTable(web.name, web.website, web.rules);
  }
});


