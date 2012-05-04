// List of Views  
// Views in this directory are intended for site-wide usage  
// See <http://requirejs.org/docs/api.html#define>  
// Requires `define`  
// Returns {Object} with view constructor objects as properties
// This module is used with the r.js optimizer tool during build  
// See http://requirejs.org/docs/faq-optimization.html

define(["views/base", "views/collection", "views/layout", "views/section" ],
function (BaseView, CollectionView, LayoutView, SectionView) {

    // Add models in this same directory to this object, 
    // for use when requiring this module.
    // grouping site-wide models in this module (object)
    // optimizes the performance and keeps dependencies organized
    // when the (build) optimizer is run.
    return {
        "BaseView" : BaseView,
        "CollectionView" : CollectionView,
        "LayoutView": LayoutView,
        "SectionView": SectionView
    };

});

