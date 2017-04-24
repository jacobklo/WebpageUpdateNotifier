/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 20, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

//////////////////////////////////////////////////
/// HTML Manipulations
//////////////////////////////////////////////////

var HtmlManipulations = (function ($) {
	var resultModule = {};

	/// Private members
	function subHtmlAction(htmlString, actionFunction, manipulatedItems) {
		if (!$htmlObj || !actionFunction) { return {};}

		var $htmlObj = $("<div></div>");
    $htmlObj.append(htmlString);
    
		if ($htmlObj.next().length > 0) {
			while ($htmlObj.next().length > 0) {
				$.each($htmlObj.siblings(), function (index, value) {
	  			subHtmlAction(value.html(), actionFunction, manipulatedItems);
	  			console.log (value.html());
	  		});
			}
		}
		else {
			var doAction = actionFunction($htmlObj);
      if (doAction) {
        manipulatedItems.push(doAction);
      }
      var children = $htmlObj.children();
      while (children.next().length > 0) {
      	subHtmlAction(children.next().html(), actionFunction, manipulatedItems);
      }
		}

		return $htmlObj;
	}

	/// public methods
	resultModule.$ = $;

	resultModule.htmlAction = function(htmlString, actionFunction) {
		var manipulatedItems = [];
		console.log ("htmlAction");
		var result = subHtmlAction(htmlString, actionFunction, manipulatedItems);
		return {
			manipulatedItems : manipulatedItems
			, result : result
		}
	};
	return resultModule;
}(jQuery));