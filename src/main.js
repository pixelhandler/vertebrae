// main.js
// ------- 
// See requirejs.org/
// Requires `require`, `define`

require.config({
    baseUrl: './',
    locale: 'en-us',
    paths: {

        // Libraries

        'json2'        : '/vendor/json2',
        'modernizr'    : '/vendor/modernizr',
        'jquery'       : '/vendor/jquery-1.7.2.min',
        'zepto'        : '/vendor/zepto',
        'underscore'   : '/vendor/underscore',
        'mustache'     : '/vendor/mustache',
        'backbone'     : '/vendor/backbone',

        // Plugins

        // RequireJS
        'domready'     : '/vendor/plugins/domReady',
        'text'         : '/vendor/plugins/text',

        // Touch events
        'touch'        : '/vendor/plugins/touch',

        // Vendor libs, packaged group of common dependencies
        'vendor'       : '/vendor',

        // Facade references to vendor / library methods
        'facade'       : '/facade',

        // Utilities and libraries
        'utils'        : '/utils',

        // Backbone syncs depend on both vendor and utils
        'syncs'        : '/syncs',

        // Should be used as required dependencies with use of `define`, 
        'models'       : '/models',
        'views'        : '/views',
        'collections'  : '/collections',
        'controller'   : '/controller',

        // Packages

        'packages'     : '/packages',
        'chrome'       : '/packages/chrome',
        'products'     : '/packages/products',
        'hello'        : '/packages/hello',
        'todos'        : '/packages/todos',

        // Application - bootstrap for frontend app 
        'application'  : '/application'

    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    priority: ['text', 'modernizr', 'json2', 'vendor', 'utils', 'facade', 'syncs', 'models', 'views', 'collections', 'controller'],
    jquery: '1.7.2',
    waitSeconds: 30
});