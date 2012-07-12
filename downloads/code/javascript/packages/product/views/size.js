define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!packages/product/templates/size.html'
], function($, _, Backbone, Mustache, colorTemplate) {
    return Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
    		this.model.bind('change:price', this.render);
        },

        render: function() {
    		$(this.el).html(Mustache.to_html(colorTemplate, this.model.toJSON()));

            return this;
        }
    });
});
