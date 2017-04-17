/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 16, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

var bgPage = chrome.extension.getBackgroundPage();
var globalData = bgPage.globalData;

function doRenew(event) {
  var webJsonTextarea = document.getElementById('webJsonTextarea');
  globalData.webJson = webJsonTextarea.value;
  bgPage.renewJson();
}

document.addEventListener('DOMContentLoaded', function () {
  var webJsonTextarea = document.getElementById('webJsonTextarea');
  webJsonTextarea.value = JSON.stringify(globalData.webJson, null ,2);

  var renewButton = document.getElementById('renewButton');
  renewButton.addEventListener('click', doRenew);
});
