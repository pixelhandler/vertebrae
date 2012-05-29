// application.js  
// --------------  
// Requires define
// Return {Object} App

define( ["facade", "utils", "collections", "chrome", "products", "hello", "todos"], 
function (facade, utils, collections, chromeBootstrap, productsBootstrap, HelloController, TodosController) {

    var App,
        ApplicationStates = collections.ApplicationStates,
        $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        Channel = utils.lib.Channel,
        debug = utils.debug;

    App = Backbone.Router.extend({

        routes: {
            '': 'defaultRoute',
            'products': 'showProducts',
            'about': 'showHello',
            'about/': 'showHello',
            'hello/:name': 'showHello',
            'todos': 'initTodos'
        },

        initialize: function (options) {
            _.bindAll(this);
            this.addSubscribers();
        },

        defaultRoute: function () {
            this.initTodos();
        },

        showHello: function (name) {
            var controller = new HelloController({
                "params": { "name": name },
                "route": (name) ? "/hello/" + name : "/hello",
                "appStates" : this.states,
                "useFixtures" : true
            });
        },

        initTodos: function () {
            var controller = new TodosController({
                "route": "todos",
                "appStates" : this.states,
            });
        },

        showProducts: function () {
            // load style sheets
            Channel('load:css').publish(["css/bootstrap.css", "css/bootstrap-responsive.css"]);
            $('body').empty();
            chromeBootstrap();
            productsBootstrap();
        },

        // Pub / Sub

        addSubscribers: function () {
            Channel('load:css').subscribe(this.loadCss);
            debug.log("app subscribers added");
        },

        removeSubscribers: function () {
            Channel('load:css').unsubscribe(this.loadCss);
            debug.log("removeSubscribers from app");
        },

        // Helpers

        getStoredState: function (keyName, metaPropName) {
            var storedState, found;

            storedState = this.states.findByNameInStorage(keyName);
            if (_.isString(metaPropName)) {
                if (storedState && storedState.data) {
                    found = storedState.data[metaPropName];
                }
            }
            return found || storedState;
        },

        // Display helpers to use in a callback

        show: function (selector) {
            selector = selector || 'body';
            $(selector)
                .removeClass('hide');
        },

        hide: function (selector) {
            selector = selector || 'body';
            $(selector)
                .addClass('hide');
        },

        // Stylesheet helper

        cssLoaded: [],

        loadCss: function (arr) {
            var i, cssUrl;

            if (!_.isArray(arr)) {
                throw new Error("App method addCss expects an array");
            }
            for (i = 0; i < arr.length; i++) {
                cssUrl = arr[i];
                if (_.isString(cssUrl) && ($.inArray(cssUrl, this.cssLoaded) < 0)) {
                    utils.lib.loadCss(cssUrl);
                    this.cssLoaded.push(cssUrl);
                }
            }
        }

    });

    return App;
});
