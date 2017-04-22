/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 16, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

var globalData = {};

require(['./common'], function() {
  require(['js/background/loadLib'], function() {
    require(['js/background/loadUtil'], function() {
      require(['js/background/loadBackground'], function() {

        /////////////////////////////////////////////////////////////////////////////////////////
        /// Start of background handler, loading default websites json
        /////////////////////////////////////////////////////////////////////////////////////////

        function parseWebsites(webJson) {
          var result = [];
          for ( var i in webJson ) {
            var web = webJson[i];
            if ( web.website && web.rules) {
              var newWeb = new WebPage(web.website , web.rules);
              result.push(newWeb);
            }
          }
          return result;
        }

        function parseJson(webJsonString) {
          if (!webJsonString) { return null; }
          var webJson = JSON.parse(webJsonString);
          if (!webJson) { return null; }
          if (webJson.constructor !== Array ) { return null; }
          return webJson;
        }

        function renewJson() {

          var newJson = parseJson(globalData.webJson);
          if (newJson) {
            globalData.websites = parseWebsites(newJson);
          }
        }

        globalData.webJson = webJson;
        globalData.websites = parseWebsites(webJson);



      });

    });
  });


});
