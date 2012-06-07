/*vim: et:ts=4:sw=4:sts=4 */
/*jslint regexp: true, nomen: true */
/*global window, jasmine, jQuery */

if (!window.HL) { var HL = {}; }

HL.addStyleSheetElem = function (url) {
    document.write('<link rel="stylesheet" href="'+url+'">');
};

HL.addScriptElem = function (url) {
    document.write('<script type="text/javascript" src="'+url+'"></script>');
};

HL.addRJSScriptElem = function (url, rlsUrl) {
    document.write('<script data-main="'+url+'" src="'+rlsUrl+'"></script>');
};

// https://developer.mozilla.org/en/DOM/Creating_and_triggering_events
HL.initTestingFrameworkEvent = (function () {
    var evt = document.createEvent('Event');
    evt.initEvent('initTestingFramework', true, true);
    return evt;
}());
// use: document.dispatchEvent(HL.initTestingFrameworkEvent);

HL.initTestingFramework = function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    var trivialReporter = new jasmine.TrivialReporter();
    jasmineEnv.addReporter(trivialReporter);
    jasmineEnv.specFilter = function(spec) {
        return trivialReporter.specFilter(spec);
    };
    jasmineEnv.execute();
};

HL.setupTestEnv = function (jQuery) {
    if (document.addEventListener) {
        document.addEventListener('initTestingFramework', HL.initTestingFramework, false); 
    } else if (document.attachEvent)  {
        document.attachEvent('initTestingFramework', HL.initTestingFramework);
    } else {
        HL.initTestingFramework();
    }
};

HL.addStyleSheetElem('/test/lib/jasmine.css');
HL.addScriptElem('/test/lib/jasmine.js');
HL.addScriptElem('/test/lib/jasmine-html.js');
HL.addScriptElem('/test/lib/jasmine-jquery.js');
HL.addScriptElem('/test/lib/sinon-1.3.4.js');
HL.addRJSScriptElem('/main', '/vendor/require.js');
