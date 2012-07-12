// main.js
// ------- 
// See require.js, underscore.js, backbone.js
// Requires `require`, `define`

if (!window.HL) { var HL = {}; }
if (!HL.buildVersion) { 
    HL.buildVersion = '';
}

// Param (string) str is a path beginning with '/' (src directory)
if (!HL.prependBuild) {
    HL.prependBuild = function (str) {
        var path = str;
        if (HL.buildVersion !== '') {
            path = '/' + HL.buildVersion + str;
        } 
        return path;
    };
}
require.config({
    baseUrl: './',
    locale: 'en-us',
    paths: {

        // ** Libraries **
        'json2'        : HL.prependBuild('/vendor/json2.min'),
        'modernizr'    : HL.prependBuild('/vendor/modernizr.min'),
        'requirejquery': HL.prependBuild('/vendor/require-jquery'),
        'jquery'       : HL.prependBuild('/vendor/jquery-1.7.2.min'),
        'zepto'        : HL.prependBuild('/vendor/zepto'),
        'underscore'   : HL.prependBuild('/vendor/underscore'),
        'mustache'     : HL.prependBuild('/vendor/mustache'),
        'backbone'     : HL.prependBuild('/vendor/backbone'),

        // r.js plugins
        'use'          : HL.prependBuild('/vendor/plugins/use'),
        'domready'     : HL.prependBuild('/vendor/plugins/domReady'),
        'order'        : HL.prependBuild('/vendor/plugins/order'),
        'text'         : HL.prependBuild('/vendor/plugins/text'),

        // jQuery plugins should be loaded in the facade.js file
        'jquerycookie' : HL.prependBuild('/vendor/plugins/jquery.cookie'),

        // Zepto plugins should be loaded in the facade.js file
        // these need the following order! type, callbacks, deferred
        'type'         : HL.prependBuild('/vendor/plugins/type'),
        'callbacks'    : HL.prependBuild('/vendor/plugins/callbacks'),
        'deferred'     : HL.prependBuild('/vendor/plugins/deferred'),

        // Touch events
        'touch'        : HL.prependBuild('/vendor/plugins/touch'),

        // Facade references to vendor / library methods
        'facade'       : HL.prependBuild('/facade'),

        // Vendor libs and plugin, packaged group of common dependencies
        'vendor'       : HL.prependBuild('/vendor'),

        // Utilities, Mixins and HauteLook libraries
        'utils'        : HL.prependBuild('/utils'),

        // (Backbone) Syncs depend on both vendor and utils
        'syncs'        : HL.prependBuild('/syncs'),

        // Should be used as required dependencies with use of `define`, 
        'models'       : HL.prependBuild('/models'),
        'views'        : HL.prependBuild('/views'),
        'collections'  : HL.prependBuild('/collections'),
        'controller'   : HL.prependBuild('/controller'),

        // ** Packages **

        'chrome'       : HL.prependBuild('/packages/chrome'),
        'events'       : HL.prependBuild('/packages/events'),
        'catalog'      : HL.prependBuild('/packages/catalog'),
        'product'      : HL.prependBuild('/packages/product'),
        'hello'        : HL.prependBuild('/packages/hello'),

        // ** Application ** bootstrap for frontend app 
        'application'  : HL.prependBuild('/application')

    },
    use: {
        "underscore": {
            attach: "_"
        },
        "backbone": {
            deps: ["use!underscore", "jquery"],
            attach: function(_, $) {
                return Backbone;
            }
        }
    },
    priority: ['text', 'use', 'order', 'modernizr', 'json2', 'vendor', 'utils'],
    jquery: '1.7.2',
    waitSeconds: 33
});


require(['facade', 'application', 'utils'], 
function (facade,   App,           utils) {

    var $ = facade.$, 
        Backbone = facade.Backbone,
        Channel = utils.baselib.Channel,
        debug = utils.debug;
        cssArr = [
            HL.prependBuild("/css/base.css"),
            HL.prependBuild("/css/global.css")
        ];

    // load style sheets
    Channel('load:css').publish(cssArr);

    $(function () { // doc ready
        var app;
        // run the application, it all starts here.
        debug.log("initialize application...");
        app = new App();
        Backbone.history.start({pushState: true});
        debug.log("...app router active", Backbone.history);
    });

});