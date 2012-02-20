({
    appDir: './src',
    baseUrl: './',
    dir: './build',
    inlineText: true,
    optimize: 'uglify',
    paths: {
        'domready'     : 'vendor/domReady',
        'order'        : 'vendor/order',
        'text'         : 'vendor/text',
        'json2'        : 'vendor/json2',
        'modernizr'    : 'vendor/modernizr',
        'jquery'       : 'vendor/require-jquery',
        'underscore'   : 'vendor/underscore',
        'mustache'     : 'vendor/mustache',
        'backbone'     : 'vendor/backbone',

        'vendor'       : 'vendor',

        'jquerycookie' : 'vendor/jquery.cookie',
        'jquerymobile' : 'vendor/jquery.mobile-1.0.1',

        'utils'        : 'utils',
        'models'       : 'models',
        'views'        : 'views',
        'collections'  : 'collections',

        'chrome'       : 'packages/chrome',
        'products'     : 'packages/products'
    },
    /*
    modules: [
        {
            name: "vendor"
        },
        {
            name: "main",
            exclude: ['vendor']
        }
    ]
    */
    modules: [

        // Common libraries, Utilities, Syncs, Models, Views, Collections

        {
            name: 'utils',
            exclude: ['vendor']
        },
        {
            name: 'syncs',
            exclude: ['vendor', 'utils']
        },
        {
            name: 'models',
            exclude: ['vendor', 'utils', 'syncs']
        },
        {
            name: 'views',
            exclude: ['vendor', 'utils', 'syncs', 'models']
        },
        {
            name: 'collections',
            exclude: ['vendor', 'utils', 'syncs', 'models', 'views']
        },

        // Packages

        {
            name: 'chrome',
            exclude: ['vendor', 'utils', 'syncs', 'models', 'views', 'collections']
        },
        {
            name: 'products',
            exclude: ['vendor', 'utils', 'syncs', 'models', 'views', 'collections', 'chrome']
        }
    ]

})