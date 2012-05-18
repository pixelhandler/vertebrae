// Header package
// --------------
// Requires define
// Return {function} productsBootstrap 

define( [
        "vendor", 
        "products/collections/products",
        "products/views/container",
        "products/views/product-list",
        "utils"
        ],
function (
        vendor,
        ProductsCollection,
        ProductContainerView,
        ProductListView,
        utils
        ) {

    var productsBootstrap,
        products = new ProductsCollection(),
        $ = vendor.$,
        _ = vendor._,
        Channel = utils.lib.Channel,
        debug = utils.debug;

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
