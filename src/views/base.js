// base View
// ---------

// Requires `define`
// Return {BaseView} object as constructor

define(['facade', 'facade', 'utils'], function (facade, facade, utils) {

    var BaseView, 
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        _toHTML = facade.toHTML,
        Deferred = facade.Deferred,
        Callbacks = facade.Callbacks,
        lib = utils.lib, 
        debug = utils.debug;

    BaseView = Backbone.View.extend({

        // Param {Object} attributes set on model when creating an instance  
        // Param {Object} options  
        initialize: function (options) {
            if (options) {
                this.setOptions(options);
            }
            this.deferred = new Deferred();
            this.callbacks = Callbacks('unique');
        },

        setOptions: function (options) {
            if (options.destination) {
                this.destination = options.destination;
            }
            if (options.template) {
                this.template = options.template;
            }
        },

        render: function (domInsertion, decoratorCallback, partials) {
            var markup;

            this.confirmElement();
            decoratorCallback = decoratorCallback || this.decoratorCallback;
            markup = this.toHTML(decoratorCallback, partials);
            domInsertion = this.domInsertionMethod(domInsertion);
            this.$el[domInsertion](markup);
            this.resolve();
            this.callbacks.fire(this.$el);

            return this;
        },

        // resolved view's deferred object after all callbacks are fired once
        resolve: function () {
            var view = this;

            if (!this.deferred.isResolved()) {
                this.callbacks.add(view.deferred.resolve);
            } else {
                if (this.callbacks.has(view.deferred.resolve)) {
                    this.callbacks.remove(view.deferred.resolve);
                }
            }
        },

        confirmElement: function () {
            if (_.isUndefined(this.el)) {
                this.$el = $(this.options.el);
            }
            if (_.isUndefined(this.$el)) {
                throw new Error("View has no this.el or this.options.el property defined.");
            }
        },

        toHTML: function (decoratorCallback, partials) {
            var markup, data, args;

            data = (this.model) ? this.model.toJSON() : null;
            if (decoratorCallback && _.isFunction(decoratorCallback)) {
                data = decoratorCallback(data);
            }
            this.template = this.template || this.options.template;
            if (!this.template || !data) {
                throw new Error("BaseView method toHTML called, but this.template or data is not defined.");
            } else {
                markup = _toHTML(this.template, data, partials);
            }
            return markup;
        },

        domInsertionMethod: function (domInsertionMethod) {
            var defaultMethod = 'html',
                domInsertionMethods = ['append', 'html', 'prepend', 'text'],
                domInsertion;

            if (domInsertionMethod !== defaultMethod) {
                if (domInsertionMethod && _.isString(domInsertionMethod)) {
                    if (_.contains(domInsertionMethods, domInsertionMethod)) {
                        domInsertion = domInsertionMethod;
                    }
                }
            }

            return domInsertion || defaultMethod;
        },

        // no-op re-define as needed as hook to modify model data just before rendering
        decoratorCallback: function (data) { return data },

        // Pub/Sub object shared between views, interface: ['bind', 'unbind', 'trigger']
        // topic: lib.topic,

        // Child views or render stages can be managed using jQuery Callbacks
        // this should be an Callbacks object for each instance, so the initialize method sets the Callbacks object
        callbacks: null,

        // Initialization or other criteria to resolve whether view is ready can be handled with jQuery Deferred
        // this should be an deferred object for each instance, so the initialize method sets the deferred instance
        deferred: null,

        // - if needed, override in specific view prototypes
        isReady: function () {
            return this.deferred.isResolved();
        },

        // setup child 'partial' views
        addChildView: function (view, context) {
            var callbackFn;
            if (!view) {
                throw new Error('baseView addChildView expects view object as first arg.');
            }
            if (context && !_.isEmpty(context)) {
                callbackFn = function () {
                    view.render();
                    view.$el.appendTo(context.$el);
                };
            } else {
                callbackFn = function () {
                    view.render();
                };
            }
            return callbackFn;
        },

        // Using outerHTML with any browser via jQuery fallback when not supported
        getOuterHtml: function (obj) {
            return (obj[0].outerHTML) ? obj[0].outerHTML : $('<div/>').html( obj.eq(0).clone() ).html();
        },

        destroy: function () {
            var key;

            if (this.removeSubscribers) {
                this.removeSubscribers();
            }
            this.$el.remove();
            if (this.destination) {
                $(this.destination).empty();
            }
            for (key in this) {
                delete this[key];
            }
        },

        addSubscribers: function () {},

        removeSubscribers: function () {
            this.$el.off();
        },

    });

    return BaseView;
});
