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

var HtmlManipulations = (function () {
	var resultModule = {};

	/// Private members
	function subHtmlAction(htmlString, actionFunction, manipulatedItems) {
		if (!htmlString || !actionFunction) { return {};}

		// TODO : Depth-First Search , pre-order
		
	}

	/// public methods
	resultModule.htmlAction = function(htmlString, actionFunction) {
		var manipulatedItems = [];
		var result = subHtmlAction(htmlString, actionFunction, manipulatedItems);
		return {
			manipulatedItems : manipulatedItems
			, result : result
		}
	};
	return resultModule;
}());