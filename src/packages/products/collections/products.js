// products.js Collection  
// -----------------
// Requires `define`  
// Return {ProductsCollection} constructor

define(['facade','collections/base', 'products/models/product', 'utils'], 
function (facade, BaseCollection,     ProductModel,              utils) {

    var ProductsCollection,
        $ = facade.$,
        _ = facade._,
        debug = utils.debug;

    ProductsCollection = BaseCollection.extend({

        model: ProductModel,

        url: '/api/products', // '/test/fixtures/products.js'

        initialize: function () {
            this.deferred = new $.Deferred();
            this.fetch({
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        fetchSuccess: function (collection, response) {
            collection.deferred.resolve();
            debug.log(response);
        },

        fetchError: function (collection, response) {
            collection.deferred.reject();
            debug.log(response);
            throw new Error("Products fetch failed");
        }

    });

    return ProductsCollection;
});
