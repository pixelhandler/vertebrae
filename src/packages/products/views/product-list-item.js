// product-list-item.js  
// -------  
// Requires `define`
// Return {ProductListItemView} object as constructor

define([ 'vendor', 'utils', 'text!packages/products/templates/product-list-item.html'], 
function (vendor,   utils,   productListItemTemplate) {

    var ProductListItemView
      , $ = vendor.$
      , Mustache = vendor.Mustache
      , Channel = utils.lib.Channel;

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