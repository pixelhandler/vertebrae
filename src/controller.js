// Controller
// ----------

// A controller object should called withing a route handler function, and may be responsible for 
// getting relevant state (application models) to generate a page (layout), (also responsible 
// for setting state when routes change). The controller passes dependent data (models/collections) 
// and constructed view objects for a requested page to the layout manager. As a side-effect the 
// use of controllers prevents the routes object from becoming bloated and tangled. A route should 
// map to a controller which then kicks off the page view, keeping the route handling functions lean.

// Returns {Controller} constructor, abstract object, must extend and define an initialize method.

define(['facade', 'collections', 'models', 'utils'], function(facade, collections, models, utils) {

    var Controller,
        ApplicationStates = collections.ApplicationStates,
        EventModel = models.EventModel,
        _ = facade._,
        $ = facade.$,
        Channel = utils.lib.Channel,
        extend = facade.Backbone.Model.extend;

    // constructor 
    Controller = function (options) {
        options = options || {};
        this.route = options.route;
        if (!Controller.prototype.appStates) {
            Controller.prototype.appStates = new ApplicationStates(); // is Singleton
        } else {
            if (options.appStates) {
                Controller.prototype.appStates = options.appStates;
            }
        }
        if (this.route && Controller.prototype.appStates) {
            this.getStoredState();
        }
        this.initialize(options);
    };

    // Assign Backbone's extend / inherit methods to Controller contructor fn
    Controller.extend = extend;


    // Controller prototype 
    // ---------------
    // Use as a template for contrete controller prototypes with YourController = Controller.extend({ /*...*/ });
    Controller.prototype = {

        // Public Methods

        // Define your own initialize method in contrete controller, this is an example
        initialize: function (options) {
            this.triggerPublishers();
            _.bindAll(this);

            this.handleOptions(options);
            // this.getEventData();
            this.addSubscribers();
            this.handleDeferreds();

            return this;
        },

        // Create methods as needed to add views to layout
        // add Section Views to this.sections['byName'] = sectionView // (instance object)
        // setupMySectionView: function() {
        //     // var viewName = 'myCustomView'
        //     // this.sections[viewName] = catalogListView;
        //     // if (this.meta.XXXX === viewName) {
        //     //     this.meta.activeViews.push(viewName);
        //     // }
        // },
        
        // Call custom methods to add sections to layout (active or not)
        setupSections: function () {
            // this.setupMySectionView();
        },

        // Add active views to layout's scheme option, to setup use this.scheme.push(sectionView)
        // e.g. use custom logic to choose views as active ... this.scheme.push(this.sections[activeViews[i]]);
        setupScheme: function () {},

        setupLayout: function () {
            var layoutName;

            // layoutName = new LayoutView({
            //     scheme: this.scheme,
            //     destination: "#content",
            //     template: layoutTemplate, // require a html page layout template with text! prefix
            //     displayWhen: "ready"
            //     // defaults... 
            //     // transitionMethod: "showHide"
            // });
            this.layout = layoutName;

            return this.layout; 
        },

        handleDeferreds: function () {
            var controller = this;

            $.when(
                null // (remove null) adding deferred objects, comma separated 
            ).then(function () {
                // controller.setupSections();
                // controller.setupScheme();
                // controller.setupLayout().render();
                // setTimeout(function() {
                //     controller.renderInActiveViews(); 
                // }, 250);
            });
        },

        addSubscribers: function () {
            // Channel("controllerName:routeChange", "nomemory").subscribe(this.routeChange);
        },

        removeSubscribers: function () {
            // Channel("controllerName:routeChange").unsubscribe(this.routeChange);
        },
        
        triggerPublishers: function () {
            // Channel('load:css').publish(cssArr);
        },


        // Privileged Properties
        meta: { 
            "activeViews": [],
            "viewNames": []
        },

        // Priveleged Methods

        handleOptions: function (options) {
            Controller.prototype.handleOptions(options);
        },

        // Change or extend the default route change handler
        routeChange: function (route) {
            Controller.prototype.routeChange(options);
        },

        // Ignore the default subscribers, otherwise delete this in contrete controller's prototype
        addStateChangeSubscriber: null

    }; // end Controller.prototype template


    // Properties to treat as privileged

    Controller.prototype.data = null;
    Controller.prototype.layout = null;
    Controller.prototype.scheme = [];
    Controller.prototype.sections = {};
    Controller.prototype.route = null;

    // Methods to treat as Privileged, extend as needed and perhaps call prototype as well.

    Controller.prototype.handleOptions = function (options) {
        if (options && options.useFixtures) {
            this.useFixturesForWebServices();
        }
    };
    
    Controller.prototype.transitionActiveViews = function (format) {
        var transitionView, 
            layout = this.layout, 
            sectionName = this.meta.sectionName,
            activeViews = this.meta.activeViews = [];

        format = format || this.meta.presentation;
        transitionView = function (view, viewName) {
            if (viewName === format) {
                if (view.state() === 'not-rendered') {
                    view.render();
                }
                layout.transition(sectionName, view);
                activeViews.push(viewName);
            }
        };
        this.iterateOverLayoutViews(transitionView);
    };

    Controller.prototype.renderInActiveViews = function () {
        var renderCallback;

        renderCallback = function (view) {
            if (view.state() === 'not-rendered') {
                view.callbacks.add(function () {
                    view.state('not-displayed');
                });
                view.render();
            }
        };
        this.iterateOverLayoutViews(renderCallback);
    };

    Controller.prototype.iterateOverLayoutViews = function (callback) {
        var activeViews = this.meta.activeViews, 
            sections = this.sections,
            viewNames = this.meta.viewNames,
            viewName, view, i;

        for (i = 0; i < viewNames.length; i++) {
            viewName = viewNames[i];
            if (!_.contains(activeViews, viewName)) {
                view = sections[viewName];
                if (callback && _.isFunction(callback)) {
                    callback(view, viewName);
                }
            }
        }
    };

    Controller.prototype.routeChange = function (route, stateModel, callback) {
        var model = { data: {} }, msg;

        if (route && !_.isString(route)) {
            msg = "Controller routeChange expects string as 1st argument.";
            throw new Error(msg);
        }
        this.route = route;
        if (this.layout) {
            this.layout.state({"route": route});
            model.data = this.layout.state();
            _.extend(model, stateModel || {});
            Controller.prototype.appStates.add(model);
            this.data = model.data;
            debug.log(model);
            Controller.prototype.appStates.save(route);
        }
        if (callback && _.isFunction(callback)) {
            callback(this.data);
        }
        debug.log("Controller routeChange method called with: " + route);
    };

    Controller.prototype.getStoredState = function () {
        var stored;
        if (!this.route) {
            throw new Error("Controller does not have route property.");
        }
        stored = Controller.prototype.appStates.findInCollectionOrStorage(this.route);
        this.data = (stored && stored.data) ? stored.data : stored;

        return this.data;
    };

    Controller.prototype.addStateChangeSubscriber = function (viewName, callback) {
        var controller = this;

        if (!viewName || !_.isString(viewName)) {
            throw new Error("controller method addStateChangeSubscriber expected string as 1st argument.");
        }
        function stateChangeHandler(lastState, state) {
            var _viewName = viewName,
                _callback = callback,
                _controller = controller,
                stateData;

            if (_controller.layout) {
                stateData = _controller.layout.state();
                if (stateData) {
                    Controller.prototype.appStates.add({
                        "name": _controller.route,
                        "data": stateData,
                        "expires": new Date(Date.now() + 1000 * (/*secs*/ 60 * /*mins*/ 7 * /*hrs*/ 24 * /*days*/ 4)),
                        "storage": "localStorage"
                    });
                }
            }
            if (_callback && _.isFunction(_callback)) {
                _callback(lastState, state);
            }
        }
        Channel(viewName + ':stateChanged').subscribe(stateChangeHandler);
    };
    
    // Methods to treat as Private, please don't mess with these...

    Controller.prototype.remove = function () {
        var key;

        if (this.layout) {
            this.layout.remove();
        }
        for (key in this) {
            delete this[key];
        }
    };

    Controller.prototype.webServices = {
        // service : "",
    };

    Controller.prototype.useFixturesForWebServices = function () {
        var _webServices = {};

        _.extend(_webServices, Controller.prototype.webServices, { 
            // hello: "/test/fixtures/hello"
            hello: "/api/hello"
        });
        this.webServices = _webServices;
    };

    return Controller;
});
