define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!packages/product/templates/color.html'
], function($, _, Backbone, Mustache, colorTemplate) {
    return Backbone.View.extend({
        tagName: 'li',

        render: function() {
    		$(this.el).html(Mustache.to_html(colorTemplate, this.model.toJSON()));

            return this;
        }
    });
});
