// collections.js  
// --------------  
// collections in this directory are intended for site-wide usage  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define([
        'require',
        'collections/application-states',
        'collections/base',
        'collections/iterator',
        'collections/messaging',
        'collections/products'
        ], 
function (require) {

    // Add collections in this same directory to this object 
    // for use when requiring this module.
    // grouping site-wide collections in this module (object)
    return {
        "ApplicationStates": require('collections/application-states'),
        "BaseCollection": require('collections/base'),
        "IteratorCollection": require('collections/iterator'),
        "MessagingCollection": require('collections/messaging'),
        "products" : require('collections/products')
    };

});
