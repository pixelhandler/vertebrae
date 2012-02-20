// product-list-item.js  
// -------  
// Requires `define`
// Return {ProductListItemView} object as constructor

define([ 
        'vendor', 
        'views',
        'utils', 
        'text!packages/products/templates/product-list-item.html'
        ], 
function (
        vendor,
        views,
        utils,
        productListItemTemplate
        ) {

    var ProductListItemView
      , $ = vendor.$
      , BaseView = views.BaseView
      , Mustache = vendor.Mustache;

      ProductListItemView = BaseView.extend({

          tagName: "li",

          className: "product",

          initialize: function (options) {
              this.template = productListItemTemplate;
          },

          render: function () {
              var markup = Mustache.to_html(this.template, this.model.toJSON());
              this.$el.html(markup);
              return this;
          }

      });

    return ProductListItemView;
});