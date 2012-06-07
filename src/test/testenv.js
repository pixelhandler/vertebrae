if (!window.HL) { var HL = {}; }

HL.AddStyleSheetElem = function (url) {
    document.write('<link rel="stylesheet" href="'+url+'">');
};

HL.AddScriptElem = function (url) {
    document.write('<script type="text/javascript" src="'+url+'"></script>');
};

HL.AddRJSScriptElem = function (url, rlsUrl) {
    document.write('<script data-main="'+url+'" src="'+rlsUrl+'"></script>');
};

HL.setupTestEnv = function () {
    return require(['utils'], function (utils) {
        var Channel = utils.lib.Channel;

        Channel('testing').subscribe(function() {
            var jasmineEnv = jasmine.getEnv();
            jasmineEnv.updateInterval = 1000;
            var trivialReporter = new jasmine.TrivialReporter();
            jasmineEnv.addReporter(trivialReporter);
            jasmineEnv.specFilter = function(spec) {
                return trivialReporter.specFilter(spec);
            };
            jasmineEnv.execute();
        });
    });
};

HL.AddStyleSheetElem('/test/lib/jasmine.css');
HL.AddScriptElem('/test/lib/jasmine.js');
HL.AddScriptElem('/test/lib/jasmine-html.js');
HL.AddScriptElem('/test/lib/jasmine-jquery.js');
HL.AddScriptElem('/test/lib/sinon-1.3.4.js');
HL.AddRJSScriptElem('/main', '/vendor/require.js');