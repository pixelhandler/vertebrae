// container.js  
// -------  
// products container view object
// Requires `define`
// Return {ProductContainerView} object as constructor

define([ 'vendor', 'text!packages/products/templates/container.html'], 
function (vendor,   productContainerTemplate) {

    var ProductContainerView
      , $ = vendor.$;

      ProductView = BaseView.extend({

          initialize: function (options) {
              this.render().$el.appendTo('body');
          },

          render: function () {
              this.$el.html(productContainerTemplate);
              return this;
          }

      });

    return ProductContainerView;
});