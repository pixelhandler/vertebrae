// collections.js  
// --------------  
// collections in this directory are intended for site-wide usage  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define([ 'collections/base', 'collections/products' ], function (base, products) {

    // Add collections in this same directory to this object 
    // for use when requiring this module.
    // grouping site-wide collections in this module (object)
    return {
        "base" : base,
        "products" : products
    };

});
