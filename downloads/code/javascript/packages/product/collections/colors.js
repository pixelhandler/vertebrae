define([
    'underscore',
    'backbone',
    'packages/product/models/color'
], function(_, Backbone, Color) {
    return Backbone.Collection.extend({
        model: Color
    });
});
