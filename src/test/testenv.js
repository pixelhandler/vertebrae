/*vim: et:ts=4:sw=4:sts=4 */
/*jslint regexp: true, nomen: true */
/*global window, jasmine, jQuery */

if (!window.HL) { window.HL = {}; }

// utils/debug module will disable logging when true...
HL.disableDebugMode = true;

HL.addStyleSheetElem = function (url) {
    document.write('<link rel="stylesheet" href="'+url+'">');
};

HL.addScriptElem = function (url) {
    document.write('<script type="text/javascript" src="'+url+'"></script>');
};

// RequireJS script with data-main attribute for config
HL.addRJSScriptElem = function (url, rlsUrl) {
    document.write('<script data-main="'+url+'" src="'+rlsUrl+'"></script>');
};

// Use native JS event for initializing the Jasmine test environment
// See: https://developer.mozilla.org/en/DOM/Creating_and_triggering_events
HL.initTestingFrameworkEvent = (function () {
    var evt = document.createEvent('Event');
    evt.initEvent('initTestingFramework', true, true);
    return evt;
}());
// use: document.dispatchEvent(HL.initTestingFrameworkEvent);

// Some defaults
HL.testingEnvActive = false;
HL.testingReporter = 'html';

// Jasmine reporters for console, trivial, and html (v 1.2)
HL.initTestingFramework = function() {
    var reporter = HL.testingReporter || 'html',
        jasmineEnv;

    if (HL.testingEnvActive) {
        return;
    }
    jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    
    function setupHtmlReporter() {
        var htmlReporter = new jasmine.HtmlReporter();
        jasmineEnv.addReporter(htmlReporter);
        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };
    }
    function setupTrivialReporter() {
        var trivialReporter = new jasmine.TrivialReporter();
        jasmineEnv.addReporter(trivialReporter);
        jasmineEnv.specFilter = function(spec) {
            return trivialReporter.specFilter(spec);
        };
    }
    function setupConsoleReporter() {
        var consoleReporter = new jasmine.ConsoleReporter();
        jasmineEnv.addReporter(new jasmine.HtmlReporter());
        jasmineEnv.addReporter(consoleReporter);
    }
    
    if (reporter === 'console') {
        setupConsoleReporter();
    } else if (reporter === 'trivial') {
        setupTrivialReporter();
    } else if (reporter === 'html') {
        setupHtmlReporter();
    } else {
        setupHtmlReporter();
    }

    jasmineEnv.execute();
    HL.testingEnvActive = true;
};

HL.listenForTestingInitEvent = function () {
    if (document.addEventListener) {
        document.addEventListener('initTestingFramework', HL.initTestingFramework, false); 
    } else if (document.attachEvent)  {
        document.attachEvent('initTestingFramework', HL.initTestingFramework);
    } else {
        HL.initTestingFramework();
    }
};

// Param reporter: 'console', 'trivial', or default 'html'
HL.setupTestEnv = function (reporter) {
    HL.testingReporter = reporter;
    HL.listenForTestingInitEvent();
};

// Setup Testing Environment Framework/Libraries
HL.addStyleSheetElem('/test/lib/jasmine.css');
HL.addScriptElem('/test/lib/jasmine.js');
HL.addScriptElem('/test/lib/jasmine-html.js');
HL.addScriptElem('/test/lib/jasmine-jquery.js');
HL.addScriptElem('/test/lib/sinon-1.3.4.js');

// Setup Application Config (RequireJS main.js)
HL.addRJSScriptElem('/main', '/vendor/require.js');
