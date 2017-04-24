/*
 * Webpage Updates Notifier
 * Version : v0.1
 * Author : Jacob Lo
 * Date : April 24, 2017
 * Lisence : Apache License Version 2.0, January 2004 http://www.apache.org/licenses/
 */

//////////////////////////////////////////////////
/// HTML Manipulations
//////////////////////////////////////////////////

var HtmlManipulations = (function ($) {
	var resultModule = {};

	/// Private members
	function subHtmlAction(htmlElement, actionFunction, manipulatedItems) {
		if (!htmlElement || !actionFunction) { return {};}

		var $htmlObj = $(htmlElement);

		var doAction = actionFunction(htmlElement);
		if (doAction) {
			manipulatedItems.push(doAction);
		}
		$htmlObj.children().each(function (index, value) {
			subHtmlAction(value, actionFunction, manipulatedItems);
		});

		return htmlElement;
	}

	/// public methods
	resultModule.htmlAction = function(htmlString, actionFunction) {
		var manipulatedItems = [];

		var $htmlEle = $("<html/>").html(htmlString);
		$htmlEle = $htmlEle.get()[0];
		
		var result = subHtmlAction($htmlEle, actionFunction, manipulatedItems);
		return {
			manipulatedItems : manipulatedItems
			, result : result
		}
	};

	// sample usage
	resultModule.htmlGetTitle = function(htmlElement) {
		var $htmlObj = $(htmlElement);
		if ($htmlObj.prop("tagName").toUpperCase() == "TITLE") {
			return $htmlObj.text();
		}
		return null;
	}

	return resultModule;
}(jQuery));