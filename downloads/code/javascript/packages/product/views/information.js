// information view
// ----------------
// manages many views on product page

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!packages/product/templates/information.html',
    'views/collection',
    'packages/product/views/color',
    'packages/product/views/size',
    'packages/product/views/price',
    'packages/product/views/quantity'
], function($, _, Backbone, Mustache, information_template, CollectionView,
            ColorView, SizeView, PriceView, QuantityView) {

    return Backbone.View.extend({
        tagName: 'section',
        className: 'product',
        
        events: {
            'click img.swatch': 'updateColor',
            'click .size': 'updateSize',
            'click .cart': 'addToCart'
        },
    
        initialize: function(options) {
            _.bindAll(this, 'render', 'updateColor', 'updateSize');
            
            this.colors = new CollectionView({
                collection: options.colors,
                view: ColorView,
                tagName: 'li'
            });

            this.sizesCollection = options.sizes;
            this.sizes = new CollectionView({
                collection: this.sizesCollection,
                view: SizeView,
                tagName: 'li'
            });

            this.quantityView = new QuantityView({
            });

            this.priceView = new PriceView({
                collection: options.items,
                quantityView: this.quantityView
            });
        },
    
        render: function() {
            $(this.el).html(Mustache.to_html(information_template, this.model.toJSON()));

            this.colors.el = $('section.colors ul', this.el);
            this.colors.render();

            // sizes are rendered based off the color
            this.sizes.el = $('section.sizes ul', this.el);

            this.priceView.el = $('section.price', this.el);

            this.quantityView.el = $('section.quantity', this.el);

            return this;
        },

        defaultColor: function() {
            $('img.swatch', this.el).filter(':first').trigger('click');
        },

        updateColor: function(event) {
            this.color = $(event.currentTarget).attr('title');
            this.model.set({currentColor: this.color});

            this.sizesCollection.byColor(this.color);
            this.priceView.byColorAndSize(this.color, false);
        },

        updateSize: function(event) {
            var size = $(event.currentTarget).attr('value');
            this.model.set({currentSize: size});

            this.priceView.byColorAndSize(this.color, size);
        },

        addToCart: function(event) {
            this.model.addCurrentItemToCart();
        }
    });
});
