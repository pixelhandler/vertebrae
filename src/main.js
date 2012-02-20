// main.js
// ------- 
// See requirejs.org/
// Requires `require`, `define`

require.config({
    baseUrl: './',
    locale: 'en-us',
    paths: {

        // Libraries
        'json2'        : '/vendor/json2.min',
        'modernizr'    : '/vendor/modernizr.min',
        'jquery'       : '/vendor/require-jquery',
        'underscore'   : '/vendor/underscore',
        'mustache'     : '/vendor/mustache',
        'backbone'     : '/vendor/backbone',

        // Plugins
        // RequireJS
        'domready'     : '/vendor/domReady',
        'order'        : '/vendor/order',
        'text'         : '/vendor/text',
        // jQuery plugins/libs (may be loaded in the vender.js file)
        'jquerycookie' : '/vendor/jquery.cookie',
        'jquerymobile' : '/vendor/jquery.mobile-1.0.1.min',

        // Vendor libs and plugin, packaged group of common dependencies
        'vendor'       : '/vendor',

        // Utilities and HauteLook libraries
        'utils'        : '/utils',
        
        // Backbone syncs depend on both vendor and utils
        'syncs'        : '/syncs',

        // Should be used as required dependencies with use of `define`, 
        'models'       : '/models',
        'views'        : '/views',
        'collections'  : '/collections',

        // Packages
        'packages'     : '/packages',
        'chrome'       : '/packages/chrome',
        'products'     : '/packages/products',

        // Application - bootstrap for frontend app 
        'application'  : '/application'

    },
    priority: ['text', 'modernizr', 'json2', 'vendor', 'utils'],
    jquery: '1.7.1',
    waitSeconds: 30
});

require(['vendor', 'application', 'utils'], function (vendor, App, utils) {

    var $ = vendor.$
      , Backbone = vendor.Backbone
      , debug = utils.debug;

    $(function () { // doc ready
        var app;

        // run the application, it all starts here.
        app = new App();
        app.loadCss(["css/bootstrap.css", "css/bootstrap-responsive.css"]);
        Backbone.history.start({pushState: true});
        debug.log("app initialized.");
    });
});