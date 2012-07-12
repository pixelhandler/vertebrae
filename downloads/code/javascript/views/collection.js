// Collection View
// ---------------
// Manages rendering many views with a collection 
// See: <http://liquidmedia.ca/blog/2011/02/backbone-js-part-3/>

// The CollectionView extends BaseView and is intended for rendering a collection.
// A item view is required for rendering withing each iteration over the models.

// Requires `define`
// Returns {CollectionView} constructor 
// - instances must have a collection property

define(['facade','views/base','utils'], function (facade, BaseView, utils) {

    var CollectionView,
        $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        debug = utils.debug;

    // Constructor `{CollectionView}` extends the BaseView.prototype
    // object literal argument to extend is the prototype for the CollectionView Constructor
    CollectionView = BaseView.extend({

        // **Method:** `initialize`  
        // Param {Object} `options` must have a child view and tagname  
        // - options should have properties: `view`, `tagName` 
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

        // **Method:** `setupCollection`  
        // bindings for adding and removing of models within the collection
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

        // **Method:** `add`  
        // Param {Model} `model` object that extends Backbone.Model
        // Creates a new view for models added to the collection
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

        // **Method:** `remove`  
        // Param {Model} `model` object that extends Backbone.Model
        // removes view when model is removed from collection
        remove : function(model) {
            var viewToRemove;

            viewToRemove = _(this._views).select(function(cv) {
                return cv.model === model;
            })[0];
            this._views = _(this._views).without(viewToRemove);
            if (this._rendered) {
                viewToRemove.destroy(); // $(viewToRemove.el).off().remove();
            }
        },

        // **Method:** `render`  
        // Iterates over collection appending views to this.$el
        // When a {Function} decorator option is available manipulte views' this.$el
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
