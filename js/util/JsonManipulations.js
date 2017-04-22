/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 19, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

//////////////////////////////////////////////////
/// Json Manipulations
/// Use Module Pattern : http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
//////////////////////////////////////////////////
var JsonManipulations = (function () {
  var resultModule = {};
  //// Private members:
  function subJsonAction(jsonObj, actionFunction, manipulatedItems) {
    if (!jsonObj || !actionFunction) {
      return {};
    }
    if (jsonObj.constructor === Array) {
      for (var i = 0; i < jsonObj.length; i++) {
        subJsonAction(jsonObj[i], actionFunction, manipulatedItems);
      }
    }
    else {
      for (var key in jsonObj) {
        var doAction = actionFunction(jsonObj, key);
        if (doAction) {
          manipulatedItems.push(doAction);
        }
        else if (isNaN(key)) {
          subJsonAction(jsonObj[key], actionFunction, manipulatedItems);
        }
      }
    }
    return jsonObj;
  };

  //// Public Methods : 
  resultModule.jsonAction = function(jsonObj, actionFunction) {
    var manipulatedItems = [];
    var result = subJsonAction(jsonObj, actionFunction, manipulatedItems);
    return {
      manipulatedItems: manipulatedItems
      , result: result
    }
  };

  return resultModule;
}());
