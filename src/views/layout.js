// Layout Manager View
// -------------------
// Presents, arranges, transitions and clears views

// The layout manager has one or many views as well as document (DOM) 
// destinations for each (rendered) view. A page may transition between 
// many views, so the layout manager keeps track of view states, e.g. 
// 'not-rendered', 'rendered', 'not-displayed', 'displayed'. 

// The layout manager can lazy load and render (detached) views that 
// a member is very likely to request, e.g. tab changes on events page. 
// The transition between view states is managed by this object. 
// An entire layout may be cleared so that view objects and their bindings 
// are removed, preparing these objects for garbage collection (preventing 
// memory leaks). The layout manager also communicates view state 
// with controller(s).

// Requires `define`
// Return {LayoutView} object as constructor

define(['facade','views/base','utils'], function (facade, BaseView, utils) {

    var LayoutView,
        $ = facade.$,
        _ = facade._,
        lib = utils.lib,
        Backbone = facade.Backbone,
        Channel = lib.Channel,
        debug = utils.debug,
        slice = Array.prototype.slice;

    debug = utils.debug;

    // **Constructor** `{LayoutView}` extends the BaseView.prototype
    // object literal argument to extend is the prototype for the LayoutView constructor
    LayoutView = BaseView.extend({

        // **Property:** {Array} `scheme` - a list of {SectionView} sections 
        scheme: null, 

        // **Property:** {Array} `schemeViewNames` - a list of the {string} names for each section
        schemeViewNames: null, 

        // **Method:** `initialize`  
        // First calls method to setup options and also add a controller when arg is present
        // no need to call ...BaseView.prototype.initialize.apply(this, slice.call(arguments));
        initialize: function (options, controller) {
            debug.log('LayoutView initialize');
            if (options) {
                this.setOptions(options);
            }
            if (controller && controller.route) {
                this.addController(controller);
            }
        },

        // **Method:** `setOptions`  
        // Param {Object} `controller` - used to add this layout as a property of the controller  
        // When controller has a data property the state data is set with this.handleStateData
        // Some coupling exists between controller, layout and app states collection
        // the controller is added as a proptery to the layout and vise versa 
        // the layout property is set on the controller
        addController: function (controller) {
            if (!controller.layout) {
                controller.layout = this;
            }
            if (controller.data) {
                this.handleStateData(controller.data);
            }
            if (!this.controller) {
                this.controller = controller;
            }
            _.each(this.schemeViewNames, function (name) {
                if (name && _.isString(name) && _.isFunction(controller.addStateChangeSubscriber)) {
                    controller.addStateChangeSubscriber(name);
                }
            });
        },

        // **Method:** `setOptions`  
        // Param {Object} `options` with required properties:  
        //  {String} `template` - HTML string as dom fragment for the layout.  
        //  {Sting} `destination` - selector to place section views on the layout template
        setOptions: function (options) {
            var msg;
            BaseView.prototype.setOptions.apply(this, slice.call(arguments));
            if (!this.template && !_.isString(this.template) && !this.destination) {
                msg = "LayoutView expected template and destination options for initialization.";
                throw new Error(msg);
            } else {
                this.setSchemeOption(options);
                this.setDisplayWhenOption(options);
                this.setTransitionMethodOption(options);
            }
        },

        // **Method:** `setSchemeOption`  
        // Param {Object} `options` with {Array} 'scheme' property of views in the layout
        setSchemeOption: function (options) {
            var msg, names;
            if (!options.scheme && !_.isArray(options.scheme)) {
                msg = "LayoutView expected a scheme array for initialization.";
                throw new Error(msg);
            } else {
                this.scheme = options.scheme;
                names = [];
                _.each(this.scheme, function (view) {
                    names.push(view.name);
                });
                this.schemeViewNames = names;
                debug.log('LayoutView scheme views: ' + names.join(' '));
            }
            $(this.destination).html(this.template);
        },

        // **Method:** `setDisplayWhenOption`  
        // Param {Object} `options` with propery named displayWhen
        //   which only has two options 'resolved' or 'ready'
        setDisplayWhenOption: function (options) {
            if (options.displayWhen) {
                if (!(options.displayWhen === 'ready' || options.displayWhen === 'resolved')) {
                    msg = "LayoutView option for displayWhen value must be 'resolved' or 'ready'";
                    throw new Error(msg);
                }
            } else {
                options.displayWhen = 'resolved';
            }
            debug.log('LayoutView setDisplayWhenOption: ' + options.displayWhen);
        },

        // **Method:** `setTransitionMethodOption`  
        // There is only one transition method 'showHide'
        // This method should be extended to provide other transitions between views e.g. fade
        setTransitionMethodOption: function (options) {
            var msg;
            if (options.transitionMethod) {
                // only one option currently
                if (options.transitionMethod !== 'showHide') {
                    msg = "LayoutView option for transitionMethod is not valid, expected 'showHide'.";
                    throw new Error(msg);
                }
            } else {
                options.transitionMethod = 'showHide';
            }
            debug.log('LayoutView transitionMethod: ' + options.transitionMethod);
        },

        // **Method:** `section`  
        // Utility to find a view instance by name rely's on the Section view's name property
        section: function (name) {
            var section = _.find(this.scheme, function (view) {
                return view.name === name;
            });
            return section;
        },

        // **Method:** `render`  
        // Calls the strategy for rendering the layout: deferred or ready
        render: function (callback) {
            var options = this.options;

            if (options.displayWhen) {
                if (options.displayWhen === 'ready') {
                    this.displayWhenReady(callback);
                } else if (options.displayWhen === 'resolved') {
                    this.displayWhenResolved(callback);
                }
            }
            debug.log('LayoutView render');
        },

        // **Method:** `displayViews`  
        // Iterates over the views in the layout's this.scheme array then uses the name
        // property to retrive the view with this.section method and display
        displayViews: function () {
            var views = this.scheme,
                layout = this;

            _.each(views, function (view) {
                debug.log('LayoutView displayViews ' + view.name);
                layout.section(view.name).display(true);
            });
        },

        // **Method:** `displayWhenReady`  
        // Param {Function} `callback` is called when deferreds are all passed.  
        // The strategy to display when all sections' deferreds are resolved successfully
        displayWhenResolved: function (callback) {
            var layout = this,
                deferreds = [];

            _.each(this.scheme, function (view) {
                var msg;
                if (!view.deferred) {
                    msg = "LayoutView displayWhenResolved expected ";
                    msg += view.name;
                    msg += " view to have a deferred property";
                    throw new Error(msg);
                } else {
                    deferreds.push(view.deferred);
                }
            });
            $.when.apply($, deferreds).then(
                function passed() {
                    layout.displayViews();
                    debug.log("LayoutView scheme views all rendered.");
                    if (callback && _.isFunction(callback)) {
                        callback();
                    }
                    Channel('layout:ready').publish();
                },
                function failed() {
                    var msg;
                    msg = "LayoutView render could not complete all of the scheme's views.";
                    throw new Error(msg);
                }
            );
        },

        // **Method:** `displayWhenReady`  
        // Param {Function} `callback` is called following the setting of done callbacks  
        // The strategy to rely on each Section's own deferred resolution and then display
        displayWhenReady: function (callback) {
            var views = this.scheme,
                layout = this;

            _.each(views, function (view) {
                var childView = layout.section(view.name);
                if (childView.isRendered()) {
                    childView.display(true);
                } else if (childView.isNotRendered()) {
                    childView.render.call(childView);
                    childView.deferred.done(function () {
                        childView.display(true);
                    });
                }
                debug.log("LayoutView displayWhenReady: " + view.name);
            });
            if (callback && _.isFunction(callback)) {
                callback();
            }
        },

        // **Method:** `transition`  
        // Param {String} `sectionName` is the targeted area for the change to happen  
        // Param {SectionView} `sectionView` replaces the current view in this section  
        // Each section is named and acts as a zone in the layout, this method
        // is called to change between two views in a single section (zone).
        transition: function (sectionName, sectionView) {
            var msg;
            if (!_.contains(this.schemeViewNames, sectionName)) {
                debug.log('LayoutView transition has no view named: ' + sectionName);
            } else {
                if (!sectionView || (sectionView && (!sectionView.state || !sectionView.display))) {
                    msg = "LayoutView transition for " + sectionName;
                    msg += " requires a SectionView with methods for state and display";
                    throw new Error(msg);
                } else {
                    this.section(sectionName).display(false);
                    if (sectionView.isNotRendered()) {
                        sectionView.render();
                        sectionView.deferred.done(function () {
                            sectionView.display(true);
                        });
                    } else {
                        sectionView.display(true);
                    }
                }
            }
        },

        // **Method:** `clearLayoutScheme`  
        // this is called by this.remove to destroy each method in the layout scheme.
        clearLayoutScheme: function () {
            var i;

            for (i = 0; i < this.scheme.length; i++) {
                this.scheme[i].destroy();
                delete this.scheme[i];
            }
            this.scheme = [];
        },

        // **Method:** `remove`  
        // Utility to prevew memory leaks calling the clearLayoutScheme and prototype remove methods
        remove: function () {
            this.clearLayoutScheme();
            BaseView.prototype.remove.call(this);
        },

        
        // **Method:** `state` (of all sections' views)  
        // e.g. {"Top": "not-displayed", "Bottom": "displayed"}  
        // When no arg is given the method is a getter, 
        // with expected state arg the method sets state for views

        // Param {Object} `state` properties are section names with values as the  
        // Param {Function} `changeHandlerCallback` passed to state to  
        //   - handle state change in section views
        //   - should accept two args (lastState, state)
        state: function (state, changeHandlerCallback) {
            var layout = this, section, layoutRoute;

            if (!layout.meta) {
                layout.meta = {};
            }
            if (!state) {
                if (layout.controller && layout.controller.route) {
                    layoutRoute = layout.controller.route;
                } else {
                    layoutRoute = window.location.pathname;
                }
                state = { "route": layoutRoute };
                if (layout.controller) {
                    state.meta = layout.controller.meta;
                }
                _.each(layout.scheme, function (section) {
                    state[section.name] = {
                        state: section.state(),
                        meta: section.meta()
                    };
                });
            } else if (_.isObject(state)) {
                _.each(state, function (/*value*/ val, /*key*/ name) {
                    if (_.contains(layout.schemeViewNames, name)) {
                        section = layout.section(name);
                        try {
                            section.state(val.state, changeHandlerCallback, section);
                        } catch (e) {
                            debug.log(e);
                        }
                    } else {
                        layout.meta[name] = val;
                    }
                });
            }
            return state;
        },

        // **Method:** `displayChangeHandler`  
        // Use as a callback when calling state, toggles between a sections state between
        // 'not-displayed' and 'displayed' (and vice-versa) also rendering when needed.
        displayChangeHandler: function (lastState, state) {
            var bool, msg;

            if (!lastState || !state || lastState === state) {
                throw new Error("SectionView stateChangeHandler expected lastState and state arguemnts to be different");
            }
            if (lastState === 'not-displayed' || lastState === 'displayed') {
                if (state === 'not-displayed' || state === 'displayed') {
                    bool = !(state.indexOf('not-', 0) === 0); // don't display if state begins with 'not-'
                    this.display(bool);
                }
            } else if (lastState === 'not-rendered') {
                this.render();
                if (state === 'displayed') {
                    this.display(true);
                } else if (state === 'not-displayed') {
                    this.display(false);
                }
            }
        },

        // **Method:** `handleStateData`  
        // There is some coupling with the layout and controller which can be passed 
        // as the 2nd arg to the layout's initialize method. When a controller.data 
        // property is present this method sets the appropriate state using the
        // this.displayChangeHandler method to change state for each section
        handleStateData: function (state) {
            var layout = this;
            _.each(state, function (data, viewName, state) {
                _.each(layout.schemeViewNames, function (name, idx, views) {
                    var viewState = {};
                    if (name === viewName) {
                        viewState[viewName] = data;
                        layout.state(viewState, layout.displayChangeHandler);
                    }
                });
            });
        }

    });

    return LayoutView;
});
