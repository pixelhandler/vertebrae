define([
    'underscore',
    'backbone',
    'packages/product/models/item'
], function(_, Backbone, Item) {
    return Backbone.Collection.extend({
        model: Item,

        initialize: function(options) {
            this.items = options.items;
        },

        byColor: function(color) {

            var sizes = this.items.filter(function(item) {
                if (item.get('color') == color) {
                    return true;
                }

                return false;
            });

            this.reset(sizes);
        }
    });
});
