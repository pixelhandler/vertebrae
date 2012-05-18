// Controller
// ----------

// A controller object should called withing a route handler function, and may 
// be responsible for getting relevant state (application models) to generate 
// a page (layout), (also responsible for setting state when routes change). 
// The controller passes dependent data (models/collections) and constructed 
// view objects for a requested page to the layout manager. As a side-effect 
// the use of controllers prevents the routes object from becoming bloated and 
// tangled. A route should map to a controller which then kicks off the page 
// view, keeping the route handling functions lean.

// Requires `define`
// Returns `{Controller}` constructor, abstract object, must extend and define 
// an initialize method.

define(['facade', 'collections', 'models', 'utils'], 
function(facade, collections, models, utils) {

    var Controller,
        ApplicationStates = collections.ApplicationStates,
        EventModel = models.EventModel,
        _ = facade._,
        $ = facade.$,
        Channel = utils.lib.Channel,
        extend = facade.Backbone.Model.extend;

    // Contoller Constructor 
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

    // Assign Backbone's `extend` / inherit methods to Controller contructor fn
    Controller.extend = extend;


    // Controller prototype 
    // --------------------
    // Use as a template for contrete controller prototypes with 
    // YourController = Controller.extend({ /*...*/ });
    Controller.prototype = {

        // Public Methods
        // --------------

        // Define your own initialize method in contrete controller, 
        // this is an example
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
        // add Section Views to this.sections['byName'] = sectionView 
        // (instance object)

        //     setupMySectionView: function() {
        //         // var viewName = 'myCustomView'
        //         // this.sections[viewName] = catalogListView;
        //         // if (this.meta.XXXX === viewName) {
        //         //     this.meta.activeViews.push(viewName);
        //         // }
        //     },
        
        // Call custom methods to add sections to layout (active or not)
        setupSections: function () {
            // this.setupMySectionView();
        },

        // Add active views to layout's scheme option, to setup use 
        // this.scheme.push(sectionView)
        // e.g. use custom logic to choose views as active ... 
        // this.scheme.push(this.sections[activeViews[i]]);
        setupScheme: function () {},

        setupLayout: function () {
            var layoutName;

            //     layoutName = new LayoutView({  
            //         scheme: this.scheme,  
            //         destination: "#content",  
            //         template: layoutTemplate, // use text! prefix for html docs  
            //         displayWhen: "ready"  
            //         // defaults...   
            //         // transitionMethod: "showHide"  
            //     });
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
        // ---------------------


        // Property: `meta`
        // holds data and references used to configure the layout's display strategy  
        // {String} names are added to {Array} `viewNames`  
        // {String} names for active views are kept in the {Array} `activeViews`  
        // viewNames can be a superset of activeViews.
        meta: { 
            "activeViews": [],
            "viewNames": []
        },

        // Priveleged Methods
        // ------------------

        handleOptions: function (options) {
            Controller.prototype.handleOptions(options);
        },

        // Change or extend the default `route` change handler
        routeChange: function (route) {
            Controller.prototype.routeChange(options);
        },

        // Redefine with null to ignore the default state change subscribers, 
        // otherwise do not use this in a contrete controller's prototype
        addStateChangeSubscriber: null

    }; // end Controller.prototype template


    // Properties to treat as privileged
    // ---------------------------------


    // **Property:** {Object} `data`  
    // data is the object which is meta or other data can be set to for persistence
    Controller.prototype.data = null;

    // **Property:** {Object} `layout`  
    // There is some coupling between controllers, app states collection and layouts
    // layout is the view of section views managing the experience for the layout
    Controller.prototype.layout = null;

    // **Property:** {Array} `scheme`  
    // A layout needs one or more sections, the scheme array contains active 
    // section view instances that a layout view will manage.
    Controller.prototype.scheme = [];

    // **Property:** {Object} `sections`  
    // Each view that can be used by the controller's package should be named
    // assign properties by unique names to this object 
    // e.g. this.sections[viewName] = myView;
    Controller.prototype.sections = {};

    // **Property:** {String} `route`  
    // this property should be the route that was first called, a controller should
    // lookup meta data using this property
    Controller.prototype.route = null;


    // Methods to treat as Privileged, extend as needed 
    // ------------------------------------------------
    // Perhaps call prototype as well.


    // **Method:** `handleOptions`  
    // To prevent the initialize method from getting long use this function to
    // do whatever you need with an {Object} `options` passed to initialize
    Controller.prototype.handleOptions = function (options) {
        if (options && options.useFixtures) {
            this.useFixturesForWebServices();
        }
    };

    // **Method:** `transitionActiveViews`  
    // Each section in a layout requires a {String} name, each section 
    // in a layout may have more than one view this utility methods makes
    // the transition between view instances within a single section 
    // of the layout.
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

    // **Method:** `renderInActiveViews`  
    // When this.viewNames has a length > this.activeViews then its a good practice
    // to defer the rendering of the view instances that are not on stage (hidden).
    // Typically this can be called with a setTimeout call so that the work
    // is done when the call stack is finsihed to process the layout's initial state.
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

    // **Method:** `iterateOverLayoutViews`  
    // Param {Function} `callback`  
    // An iteration over this.activeViews, when a viewName is not listed 
    // in this.activeViews the callback is called with the found view and name
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

    // **Method:** `routeChange`  
    // Param {String} `route`  
    // Param {Object} `stateModel` with properties `name` and `data`  
    // Param {Function} `callback` that accepts a (layout.state) data argument (or not)  
    // The controller instance should act as a medaitor between all views that
    // are used in the layout, the section views should not directly handle any
    // route changes but rather publish a change, the controller subscribes:
    // e.g. `Channel("controllerName:routeChange", "nomemory").subscribe(this.routeChange)`;
    // the publisher should pass at least a route or an object with the route 
    // and other data e.g. `Channel('events:routeChange').publish(link)`;
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

    // **Method:** `getStoredState`  
    // Requires {String} this.route to be defined  
    // Returns {Object} `data`  
    // Wraps method in ApplicationStates to retrieve data by the route name
    Controller.prototype.getStoredState = function () {
        var stored;
        if (!this.route) {
            throw new Error("Controller does not have route property.");
        }
        stored = Controller.prototype.appStates.findInCollectionOrStorage(this.route);
        this.data = (stored && stored.data) ? stored.data : stored;

        return this.data;
    };

    // **Method:** `addStateChangeSubscriber`  
    // Param {String} `viewName`  
    // Param {Function} `callback`  
    // Subscribes to a view's Channel `__viewName__:stageChanged` published topic
    // as a view's stage is changed the layout's state data is updated and stored
    // to ignore the view's Channel redefine this function and set to null
    Controller.prototype.addStateChangeSubscriber = function (viewName, callback) {
        var controller = this, msg;

        if (!viewName || !_.isString(viewName)) {
            msg = "controller method addStateChangeSubscriber expected string as 1st argument.";
            throw new Error(msg);
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
                        "expires": new Date(Date.now() + 1000 * (/*secs*/60 * /*mins*/7 * /*hrs*/24 * /*days*/4)),
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
    // ------------------------------------------------------------


    // **Method:** `remove`  
    // call this to kill this object's properties and prepare for garbage collection
    // good to use this to prevent memory leaks in a single page application.
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
