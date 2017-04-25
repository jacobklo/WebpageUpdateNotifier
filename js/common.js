//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: chrome.extension.getURL("/"),
    paths: {
        app: '../background'
    }
});

require(['js/lib/jQuery/jQuery']);
require(['js/lib/jQuery/jQuery-ui']);