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
	function subHtmlAction(htmlObj, actionFunction, manipulatedItems) {
		if (!htmlObj || !actionFunction) { return {};}

		// TODO : In order transversal
	}

	/// public methods
	resultModule.htmlAction = function(htmlObj, actionFunction) {
		var manipulatedItems = [];
		var result = subHtmlAction(htmlObj, actionFunction, manipulatedItems);
		return {
			manipulatedItems : manipulatedItems
			, result : result
		}
	};
	return resultModule;
}());