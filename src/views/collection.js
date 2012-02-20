// Collection View
// ---------------
// Manages rendering many views with a collection,
// Param {Object} options should have properties: `view`, `tagName` 
// Requires `define`

define(['vendor','views/base','utils'], function (vendor, BaseView, utils) {

    var CollectionView
      , $ = vendor.$
      , _ = vendor._
      , debug = utils.debug;

    CollectionView = BaseView.extend({

        initialize : function(options) {
            _(this).bindAll('add', 'remove');
            if (!options.view) {
                throw new Error("CollectionView initialize: no view provided");
            }
            if (!options.tagName) {
                throw new Error("CollectionView initialize: no tagName provided.");
            }
            this._view = options.view;
            this._tagName = options.tagName;
            this._views = [];
            this.collection.each(this.add);
            this.collection.bind('add', this.add);
            this.collection.bind('remove', this.remove);
        },

        add : function(model) {
            var view;

            view = new this._view({
                "tagName": this._tagName,
                "model": model
            });
            this._views.push(view);
            if (this._rendered) {
                this.$el.append(view.render().$el);
            }
        },

        remove : function(model) {
            var viewToRemove;

            viewToRemove = _(this._views).select(function(cv) {
                return cv.model === model;
            })[0];
            this._views = _(this._views).without(viewToRemove);
            if (this._rendered) {
                $(viewToRemove.el).remove();
            }
        },

        render : function() {
            this._rendered = true;
            this.$el.empty();

            _(this._views).each(function(view) {
                this.$el.append(view.render().$el);
            }, this);

            return this;
        }
    });

    return CollectionView;
});
