// copy config from main.js for any scripts to use during unit tests
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
        'use'          : '/vendor/plugins/use',
        'domready'     : '/vendor/plugins/domReady',
        'order'        : '/vendor/plugins/order',
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
    priority: ['text', 'use', 'modernizr', 'json2', 'vendor', 'utils'],
    jquery: '1.7.2',
    waitSeconds: 30
});

require(['jquery', 'underscore', 'backbone', 'utils/debug', 'utils/lib', 'utils/date'], 
function ($,        _,            Backbone,   debug,         lib,         parseDate) {

    debug.log("describe specs...");

    describe("Dependencies", function () {

        it("should have debug as alert", function () {
            expect(debug).toBeDefined();
        });

        it("should have jQuery, _ and Backbone libraries, (global) HL, lib defined", function () {
            expect(jQuery).toBeDefined();
            expect(_).toBeDefined();
            expect(Backbone).toBeDefined();
            expect(HL).toBeDefined();
            expect(lib).toBeDefined();
            debug.log("dependency libs defined");
        });

        it("should have expected library methods and use utility duckTypeCheck", function () {
            // arrange
            var check, lib = lib,
                // will compare object property names and their types, use literals {}, [], prototypes (Function)
                _interface = { 
                    duckTypeCheck: Function.prototype, 
                    topic: Object.prototype, 
                    Channel: Function.prototype, 
                    loadCss: Function.prototype, 
                    dateTool: Object.prototype, 
                    formatShortDate: Function.prototype, 
                    truncateString: Function.prototype,
                    imageResizer: Function.prototype 
                };
            // act
            check = lib.duckTypeCheck(lib.constructor.prototype, _interface);
            // assert
            expect(check).toBeTruthy();

            debug.log("finish checking lib interface...");
        });

        it("should have an 'topic' property which utilizes Backbone Event methods", function () {
            var topic = lib.topic;
            expect(topic).toBeDefined();
            expect(topic.bind).toBeDefined();
            expect(topic.unbind).toBeDefined();
            expect(topic.trigger).toBeDefined();
            debug.log("finish checking for 'topic' property...");
        });
        
        it("should have an 'Channel' property which utilizes pub/sub behaviors", function () {
            var subTest, memoryTest, Channel = lib.Channel;
            expect(Channel).toBeDefined();
            expect(Channel('fake').publish).toBeDefined();
            expect(Channel('fake').subscribe).toBeDefined();
            expect(Channel('fake').unsubscribe).toBeDefined();
            expect(Channel('fake').disable).toBeDefined();
            // act
            function logSubscribe(msg) {
                debug.log('logSubscribe Fn received: ' + msg);
                subTest = msg;
            }
            Channel("test:pubsub").subscribe(logSubscribe);
            Channel("test:pubsub").publish('in a bottle');
            function logMemory(msg) {
                debug.log('logMemory Fn received: ' + msg);
                memoryTest = msg;
            }
            Channel("test:memory").publish('genie');
            Channel("test:memory").subscribe(logMemory);

            // assert
            expect(subTest).toBe('in a bottle');
            expect(memoryTest).toBe('genie');
            debug.log("finish checking for 'Channel' property...");
        });

        it("should have a method to load CSS", function () {
            var link = "http://code.jquery.com/mobile/latest/jquery.mobile.min.css",
                loadCss = lib.loadCss,
                test;

            runs(function () {
                loadCss(link);
            });
            waits(250);
            runs(function () {
                expect(loadCss).toBeDefined();
                test = $('head').find('link:last');
                expect(test).toBeTruthy();
                expect(test.attr('href')).toEqual(link);
            });
        });

        // stub
        // it("", function () {
        //     debug.log("finish...");
        // });

    }); // describe
}); // require

