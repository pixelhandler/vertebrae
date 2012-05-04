// Layout Manager View
// -------------------
// Presents, arranges, transitions and clears views

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

    LayoutView = BaseView.extend({

        scheme: null, // array of (section) views
        schemeViewNames: null, // array of sections' view names

        initialize: function (options, controller) {
            debug.log('LayoutView initialize');
            if (options) {
                this.setOptions(options);
            }
            if (controller && controller.route) {
                this.addController(controller);
            }
            // no need to call ...BaseView.prototype.initialize.apply(this, slice.call(arguments));
        },

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

        section: function (name) {
            var section = _.find(this.scheme, function (view) {
                return view.name === name;
            });
            return section;
        },

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

        displayViews: function () {
            var views = this.scheme,
                layout = this;

            _.each(views, function (view) {
                debug.log('LayoutView displayViews ' + view.name);
                layout.section(view.name).display(true);
            });
        },

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
            Channel('layout:ready').publish();
        },

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

        clearLayoutScheme: function () {
            var i;

            for (i = 0; i < this.scheme.length; i++) {
                this.scheme[i].destroy();
                delete this.scheme[i];
            }
            this.scheme = [];
        },

        remove: function () {
            this.clearLayoutScheme();
            BaseView.prototype.remove.call(this);
        },

        // Param {Object} state properties are section names with values as the state of that section's view
        //   e.g. {"Top": "not-displayed", "Bottom": "displayed"}
        //   When no arg is given the method is a getter, with expected state arg the method sets state for views  
        // Param {Function} changeHandlerCallback passed to state to handle state change in section views
        //   changeHandlerCallback should accept two args (lastState, state)
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

        // use as a callback when calling state 
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
