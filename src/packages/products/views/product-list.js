// product-list.js  
// -------  
// Requires `define`
// Return {ProductListView} object as constructor

define([
        'vendor',
        'views',
        'utils',
        'products/views/product-list-item'
        ], 
function (
        vendor,
        views,
        utils,
        ProductListItemView
        ) {

    var ProductListView
      , $ = vendor.$
      , BaseView = views.BaseView
      , Mustache = vendor.Mustache;

      ProductListView = BaseView.extend({

          tagName: "ul",

          className: "products",

          render: function () {
              var i, len = this.collection.length;
              for (i=0; i < len; i++) {
                  this.renderItem(this.collection.models[i]);
              };
              $(this.container).find(this.className).remove();
              this.$el.appendTo(this.options.container);
              return this;
          },

          renderItem: function (model) {
              var item = new ProductListItemView({
                  "model": model
              });
              item.render().$el.appendTo(this.$el);
          }
      });

    return ProductListView;
});