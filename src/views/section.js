// Section View States
// -------------------
// Mixin object to track view's state
// not-rendered, rendered, shown, hidden

// Requires `define`
// Return {SectionView} object constructor

define(['vendor','views/base','utils'], function (vendor, BaseView, utils) {

    var Section,
        SectionView,
        viewStates,
        _ = vendor._,
        $ = vendor.$,
        Channel = utils.lib.Channel,
        debug = utils.debug;

    viewStates = ['not-rendered', 'rendered', 'not-displayed', 'displayed'];

    Section = function () {};

    Section.prototype._viewState = viewStates[0];

    Section.prototype.state = function (state, callback, context) {
        var lastState = this._viewState, msg;

        if (state) {
            // set state value
            if (!_.isString(state) || !_.contains(viewStates, state)) {
                throw new Error("Section state (" + state + ") not allowed.");
            } else {
                // handle state changes with callback argument in this content
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
            // get state value
            state = this._viewState;
        }
        return state;
    };

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

    SectionView = BaseView.extend({

        __super__: BaseView.prototype,

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

        render: function (domInsertion, decoratorCallback, partials) {
            var section = this;

            function setRenderedState() {
                section.state('rendered');
            }
            this.callbacks.add(setRenderedState);
            debug.log('SectionView render: ' + this.name + ' (' + this.cid + ')');
            this.__super__.render.call(this, domInsertion, decoratorCallback, partials);
        },

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

        // metadata for params should be set on the this._meta object for managing state
        // Also, user interations which will be stored and retrieved when viewing 
        // the page again later should also be added to this._meta
        // 
        // meta getter/setter used for managing state of view
        // this._meta is mean to be private, no mess with please :)
        // Param {Object} data is the information to set on the this._meta object
        // with no Param returns this_.meta
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

    // mix-in Section object
    _.extend(SectionView.prototype, Section.prototype);

    return SectionView;
});
