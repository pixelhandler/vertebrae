require.config({
    baseUrl: './',
    locale: 'en-us',
    paths: {

        // Libraries

        'json2'        : '/vendor/json2',
        'modernizr'    : '/vendor/modernizr',
        'requirejquery': '/vendor/require-jquery',
        'jquery'       : '/vendor/jquery-1.7.2.min',
        'zepto'        : '/vendor/zepto',
        'underscore'   : '/vendor/underscore',
        'mustache'     : '/vendor/mustache',
        'backbone'     : '/vendor/backbone',

        // Plugins

        // RequireJS
        'domready'     : '/vendor/domReady',
        'order'        : '/vendor/order',
        'text'         : '/vendor/text',

        // Touch events
        'touch'        : '/vendor/plugins/touch',

        // Vendor libs, packaged group of common dependencies
        'vendor'       : '/vendor',

        // Facade references to vendor / lirabry methods
        'facade'       : '/facade',

        // Utilities and HauteLook libraries
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

        // Application - bootstrap for frontend app 
        'application'  : '/application'

    },
    priority: ['text', 'modernizr', 'json2', 'vendor', 'utils'],
    jquery: '1.7.2',
    waitSeconds: 10
});

require([
        "jquery", "underscore", "backbone", "models/base", "utils/debug" 
    ], function ($, _, Backbone, BaseModel, debug) {

    $.noConflict();
    _.noConflict();
    Backbone.noConflict();

    debug.log("describe specs...");

    describe("Dependencies", function () {

        it("should have jQuery, _ and Backbone libraries, (global) HL, BaseModel defined", function () {
            expect(jQuery).toBeDefined();
            expect(_).toBeDefined();
            expect(Backbone).toBeDefined();
            expect(HL).toBeDefined();
            expect(BaseModel).toBeDefined();
            debug.log("dependency libs defined");
        });

        
        describe("Base HL Model methods and properties", function () {
            var model;

            beforeEach(function () {
                // arrange
                model = new BaseModel(
                    /* attrs */ { "model" : "Attributes" }, 
                    /* opts */ { "singleton" : true, "name" : "test" }
                );
            });

            afterEach(function () {
                model = null;
            });

            it("should have expected properties, cid, __super__", function () {
                // assert
                expect(model.cid).toBeDefined();
                expect(model.__super__).toBeDefined();
                debug.log("finish checking base model properties.");
            });

            it("should have methods : onReady, isReady. prototype methods include : initialize, getSingleton which are referenced with this.__super__", function () {
                // arrange
                var methods = [ "onReady", "isReady"], commonMethods;
                // act
                commonMethods = _.intersection(_.keys(model.constructor.prototype), methods);
                // assert
                expect(commonMethods.length).toBe(methods.length);
                _.each(commonMethods, function (name) { 
                    expect($.inArray(name, methods) !== -1).toBeTruthy();
                });
                expect(model.__super__.initialize).toBeDefined();
                expect(model.initialize).toBeDefined();
                expect(model.getSingleton).toBeDefined();
            });

            it("should get singleton object", function () {
                // arrange
                var singleton = model;

                // assert
                expect(singleton.cid).toBeTruthy();
                expect(BaseModel.prototype.getSingleton("test").cid).toEqual(singleton.cid);
                expect(singleton.__super__.initialize).toBeDefined();
                expect(model.__super__.initialize).toBeDefined();
                expect(_.isFunction(singleton.__super__.initialize)).toBeTruthy();
                expect(model.__super__.initialize === singleton.__super__.initialize).toBeTruthy();
            });

        });

        describe("BaseModel instance with custom initialize method can call super class initialize method", function () {

            it("should create instance from grandchild class of BaseModel, instance initialize methods calls 3rd generation and 2nd genteration prototype's initialize methods", function () {
                var GenTwo, GenThree, thirdGenInstance, messages = [];
                // arrange
                GenTwo = BaseModel.extend({
                    initialize: function () {
                        var model = this;
                        model.bind("onReady", function () {
                            var msg = "GenTwo initialize called";
                            messages.push(msg);
                            debug.log(msg);
                        });
                        // __super__ is syntatical sugar for constructor.prototype
                        GenTwo.__super__.initialize.apply(model, arguments);
                        model.trigger("onReady", arguments);
                    },
                    isReady: function () {
                        return !!this.get('name');
                    },
                    onReady: function () {
                        var model = this;
                    }
                });

                GenThree = GenTwo.extend({
                    initialize: function () {
                        var model = this;
                        model.bind("onReady", function () {
                            var ready = "isReady : " + model.isReady(),
                                msg = "GenThree initialize called";
                            messages.push(msg);
                            debug.log(msg);
                            debug.log(ready);
                        });
                        // __super__ is syntatical sugar for constructor.prototype
                        GenThree.__super__.initialize.apply(model, arguments);
                    }
                });
                // act
                thirdGenInstance = new GenThree({ "name" : "genThree" });
                // assert
                expect(messages.length).toBe(2);
                expect(messages[0]).toEqual("GenThree initialize called");
                expect(messages[1]).toEqual("GenTwo initialize called");

                debug.log("end testing inheritance and calling __super__.initialize method from child class");
            });

        });

        // stub
        // xit("", function () {
        //     debug.log("finish...");
        // });

    });

});
