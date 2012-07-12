({
    appDir: './src',
    baseUrl: './',
    dir: './build',
    inlineText: true,
    optimize: 'uglify',
    paths: {

        // ** Libraries **
        'json2'        : 'vendor/json2.min',
        'modernizr'    : 'vendor/modernizr.min',
        'requirejquery': 'vendor/require-jquery',
        'jquery'       : 'vendor/jquery-1.7.2.min',
        'zepto'        : 'vendor/zepto',
        'underscore'   : 'vendor/underscore',
        'mustache'     : 'vendor/mustache',
        'backbone'     : 'vendor/backbone',
        //'less'         : 'vendor/less-1.3.0.min',

        // r.js plugins
        'use'          : 'vendor/plugins/use',
        'domready'     : 'vendor/plugins/domReady',
        'order'        : 'vendor/plugins/order',
        'text'         : 'vendor/plugins/text',

        // jQuery plugins should be loaded in the facade.js file
        'jquerycookie' : 'vendor/plugins/jquery.cookie',

        // Zepto plugins should be loaded in the facade.js file
        // these need the following order! type, callbacks, deferred
        'type'         : 'vendor/plugins/type',
        'callbacks'    : 'vendor/plugins/callbacks',
        'deferred'     : 'vendor/plugins/deferred',

        // Facade references to vendor / lirabry methods
        'facade'       : 'facade',

        // Vendor libs and plugin, packaged group of common dependencies
        'vendor'       : 'vendor',

        // Utilities, Mixins and HauteLook libraries
        'utils'        : 'utils',

        // (Backbone) Syncs depend on both vendor and utils
        'syncs'        : 'syncs',

        // Should be used as required dependencies with use of `define`, 
        'models'       : 'models',
        'views'        : 'views',
        'collections'  : 'collections',

        // ** Packages **

        'chrome'       : 'packages/chrome',
        'events'       : 'packages/events',
        'catalog'      : 'packages/catalog',
        'product'      : 'packages/product',
        'hello'        : 'packages/hello',

        // ** Application ** bootstrap for frontend app 
        'application'  : 'application'
    },

    modules: [

        // Common libraries, Utilities, Syncs, Models, Views, Collections

        {
            name: 'utils',
            exclude: ['vendor', 'facade']
        },
        {
            name: 'syncs',
            exclude: ['vendor', 'facade', 'utils']
        },
        {
            name: 'models',
            exclude: ['vendor', 'facade', 'utils', 'syncs']
        },
        {
            name: 'views',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models']
        },
        {
            name: 'collections',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views']
        },

        // Packages

        {
            name: 'chrome',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views', 'collections']
        },
        {
            name: 'events',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views', 'collections', 'chrome']
        },
        {
            name: 'catalog',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views', 'collections', 'chrome']
        },
        {
            name: 'product',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views', 'collections', 'chrome']
        },
        {
            name: 'hello',
            exclude: ['vendor', 'facade', 'utils', 'syncs', 'models', 'views', 'collections', 'chrome']
        }
    ]

})