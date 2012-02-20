// views.js  
// --------  
// views in this directory are intended for site-wide usage  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define([ "views/base", "views/collection" ], 
function (BaseView,     CollectionView) {

    // Add views in this same directory to this object, 
    // for use when requiring this module.
    // grouping site-wide views in this module (object)
    return {
        "BaseView" : BaseView,
        "CollectionView" : CollectionView
    };

});

