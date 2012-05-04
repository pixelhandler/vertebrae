// Collection View
// ---------------

// Manages rendering many views with a collection,
// initialize methods expects a child view and tagname  
// Param {Object} options should have properties: `view`, `tagName` 
// Requires `define`

define(['facade','views/base','utils'], function (facade, BaseView, utils) {

    var CollectionView,
        $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        debug = utils.debug;

    CollectionView = BaseView.extend({

        initialize : function (options) {
            var collection, msg;

            if (!this.collection || !(this.collection instanceof Backbone.Collection)) {
                msg = "CollectionView initialize: no collection provided.";
                throw new Error(msg);
            }
            BaseView.prototype.initialize.call(this, options);
            this._view = this.options.view || this._view;
            if (!this._view) {
                throw new Error("CollectionView initialize: no view provided.");
            }
            this._tagName = this.options.tagName || this._tagName;
            if (!this._tagName) {
                throw new Error("CollectionView initialize: no tag name provided.");
            }
            this._className = this.options.className;
            this._decorator = this.options.decorator;
            this._id = this.options.id;
            this._views = [];
            _(this).bindAll('add', 'remove');
            this.setupCollection();
        },

        setupCollection: function () {
            var collection = this.options.collection || this.collection;

            collection.bind('add', this.add);
            collection.bind('remove', this.remove);
            if (!collection.length && !collection.request) {
                collection.fetch();
                collection.request.done(function () {
                    collection.each(this.add);
                });
            } else {
                collection.each(this.add);
            }
        },

        add : function(model) {
            var view;

            view = new this._view({
                "tagName": this._tagName,
                "model": model,
                "className": this._className,
                "decorator": this._decorator
            });
            this._views.push(view);
            if (this._rendered) {
                this.$el.append(view.render().el);
            }
        },

        remove : function(model) {
            var viewToRemove;

            viewToRemove = _(this._views).select(function(cv) {
                return cv.model === model;
            })[0];
            this._views = _(this._views).without(viewToRemove);
            if (this._rendered) {
                $(viewToRemove.el).off();
                $(viewToRemove.el).remove();
            }
        },

        render : function() {
            this.confirmElement.call(this);
            this._rendered = true;
            this.$el.empty();

            _(this._views).each(function(view) {
                this.$el.append(view.render().el);
                if (view.options.decorator && _.isFunction(view.options.decorator)) {
                    view.options.decorator(view);
                }
            }, this);

            this.resolve.call(this);
            this.callbacks.fire.call(this);
            return this;
        }
    });

    return CollectionView;
});
