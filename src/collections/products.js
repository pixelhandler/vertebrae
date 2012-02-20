// products.js Collection  
// -----------------
// Requires `define`  
// Return {ProductsCollection} constructor

define(['vendor','models','collections/base', 'utils'], 
function (vendor, models,  BaseCollection,     utils) {

    var ProductsCollection,
        $ = vendor.$,
        _ = vendor._,
        Product = models.ProductModel,
        debug = utils.debug;

    ProductsCollection = BaseCollection.extend({

        model: Product,

        url: 'test/fixtures/products.js', //'/api/products',

        initialize: function () {
            this.fetch({
                success: this.fetchSuccess,
                error: this.fetchError
            });
            this.deferred = new $.Deferred();
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
