// Header package
// --------------
// Requires define
// Return {function} productsBootstrap 

define( [
        "vendor", 
        "chrome", 
        "collections", 
        "products/views/container",
        "products/views/product-list",
        "utils"
        ],
function (
        vendor,
        chrome,
        collections,
        ProductContainerView,
        ProductListView,
        utils
        ) {

    var productsBootstrap
      , products = collections.products
      , $ = vendor.$
      , _ = vendor._
      , Channel = utils.lib.Channel
      , debug = utils.debug;

    productsBootstrap = function () {
        var productsList;

        new ProductContainerView();
        productsList = new ProductListView({
            "container": $('#products'),
            "collection": products
        });
        products.deferred.done(function () {
            productsList.render();
        });
    };

    return productsBootstrap;
});
