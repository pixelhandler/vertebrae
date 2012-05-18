// Section View States
// -------------------
// Mixin object to track view's state
// 'not-rendered', 'rendered', 'not-displayed', 'displayed'

// A section view is the required view object for a layout view which expects
// views to track their own state. This view may be extended as need. to use
// in a layout, perhaps adding the Section prototype properties to another view.

// Requires `define`  
// Return {SectionView} object constructor

define(['facade','views/base','utils'], function (facade, BaseView, utils) {

    var Section,
        SectionView,
        viewStates,
        _ = facade._,
        $ = facade.$,
        Channel = utils.lib.Channel,
        debug = utils.debug;

    // A section view is managed by a layout with the following states.
    viewStates = ['not-rendered', 'rendered', 'not-displayed', 'displayed'];

    // Constructor {Section} will have the properties and methods to manage state
    Section = function () {};

    Section.prototype._viewState = viewStates[0];

    // **Method:** `state`  
    // A getter/setter to change or retrieve state
    // Param {String} `state` - on of the acceptable viewStates  
    // Param (optional) {Function} `callback` - called when state has changed  
    // Param (optional) {Object} `context` - the `this` context of the callback function  
    Section.prototype.state = function (state, callback, context) {
        var lastState = this._viewState, msg;

        if (state) {
            // Set state value
            if (!_.isString(state) || !_.contains(viewStates, state)) {
                throw new Error("Section state (" + state + ") not allowed.");
            } else {
                // Handle state changes with callback argument in this content
                if (lastState !== state) {
                    if (callback || _.isFunction(callback)) {
                        callback.call(context || this, lastState, state);
                    }
                    this._viewState = state;
                    Channel(this.name + ':stateChanged').publish(lastState, state);
                } else {
                    if (!this._viewState) {
                        this._viewState = state;
                    }
                }
                msg = 'view ' + this.name + ' (' + this.cid + ')';
                msg += ' state was: [' + lastState + '], state set to: [' + state + ']';
                debug.log(msg);
            }
        } else {
            // Get state value
            state = this._viewState;
        }
        return state;
    };

    // **Methods:** `isRendered`, `isNotRendered`, `isDisplayed`, `isNotDisplayed` -  
    // these are helpers to check the state of the Section view

    Section.prototype.isRendered = function () {
        return this.state() === "rendered";
    };

    Section.prototype.isNotRendered = function () {
        return this.state() === "not-rendered";
    };

    Section.prototype.isDisplayed = function () {
        return this.state() === 'displayed';
    };

    Section.prototype.isNotDisplayed = function () {
        return this.state() === 'not-displayed';
    };

    // **Constructor** {Function} `SectionView` extends the BaseView.prototype
    // object literal argument to extend is the prototype for the SectionView constructor
    SectionView = BaseView.extend({

        // **Property:** `__super__`  
        // this is set to the base prototype,
        // however if needed can be set as another objects prototype (e.g. polymorphic)
        __super__: BaseView.prototype,

        // **Method:** `initialize`  
        // Param {Object} options with properties for {String} name 
        // and {String} destination as a selector string found in the layout's template 
        // The Section view's initialize method calls the __super__ initialize as well
        initialize: function (options) {
            var msg;

            _.bindAll(this);
            if (!options || (options && (!options.name && !options.destination))) {
                msg = "Section initialize method requires an 'options' {object}";
                msg += " as argument, with 'name' and 'destination' {string} properties";
                throw new Error(msg);
            } else {
                this.destination = options.destination;
                this.name = options.name;
                this.state(options.state || 'not-rendered');
                debug.log('SectionView initialize: ' + this.name + ' (' + this.cid + ')');
                this.__super__.initialize.call(this, options);
            }
        },

        // **Method:** `render`  
        // Wraps the `__super__` render method adding a callback to set the section's
        // state as 'rendered'
        render: function (domInsertion, dataDecorator, partials) {
            var section = this;

            function setRenderedState() {
                section.state('rendered');
            }
            this.callbacks.add(setRenderedState);
            debug.log('SectionView render: ' + this.name + ' (' + this.cid + ')');
            this.__super__.render.call(this, domInsertion, dataDecorator, partials);
        },

        // **Method:** `display`  
        // Param {Boolean} `bool`  
        // In addition to render the display function manages whether or not the section
        // view is visible or not, so the bool param shows the section with true,
        // and removes the section from the dom with false.
        display: function (bool) {
            var toDisplay = bool, section, msg;

            if (_.isUndefined(toDisplay) || !_.isBoolean(toDisplay)) {
                msg = "SectionView display method expects {boolean} argument.";
                throw new Error(msg);
            }
            if (this.state() === 'not-rendered') {
                msg = "SectionView (" + this.name + ") cannot display, view state is 'not-rendered'.";
                throw new Error(msg);
            } else {
                section = $(this.destination);
                if (toDisplay /*&& this.state() !== 'displayed'*/) {
                    section.html(this.$el);
                    this.state('displayed');
                    debug.log('SectionView display: ' + this.name + ' (' + this.cid + '): ' + toDisplay);
                }
                if (!toDisplay && this.state() === 'displayed') {
                    section.html('');
                    this.state('not-displayed');
                    debug.log('SectionView display: ' + this.name + ' (' + this.cid + '): ' + toDisplay);
                }
            }
        },

        // **Method:** `meta` - getter/setter used for managing state of view  
        // this._meta is mean to be private, no mess with please :)  
        // Param {Object} `data` is the information to set on the this._meta object
        // with no Param returns this_.meta

        // **Private Property:** `_meta`  
        // Metadata for params should be set on the this._meta object for managing state
        // Also, user interations which will be stored and retrieved when viewing 
        // the page again later, should also be added to this._meta using this.meta(Object)
        //   NOTE: `this._meta` is mean to be private, no mess with please :)
        meta: function (data) {
            if (!data) {
                data = this._meta;
            } else {
                this._meta = this._meta || {};
                _.each(data, function (val, key) {
                    this._meta[key] = val;
                });
            }
            return this._meta;
        }

    });

    // Mix-in `Section` object
    _.extend(SectionView.prototype, Section.prototype);

    return SectionView;
});
