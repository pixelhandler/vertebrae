// Header package
// --------------
// Requires define
// Return {function} productsBootstrap 

define( [
        "vendor", 
        "collections", 
        "products/views/container",
        "products/views/product-list",
        "utils"
        ],
function (
        vendor,
        collections,
        ProductContainerView,
        ProductListView,
        utils
        ) {

    var productsBootstrap
      , products = new collections.products()
      , $ = vendor.$
      , _ = vendor._
      , Channel = utils.lib.Channel
      , debug = utils.debug;

    productsBootstrap = function () {
        var productsList;

        new ProductContainerView();
        productsList = new ProductListView({
            "container": $('#products .main'),
            "collection": products
        });
        products.deferred.done(function () {
            productsList.render();
            productsList.options.container.removeClass('hide');
        });
    };

    return productsBootstrap;
});
