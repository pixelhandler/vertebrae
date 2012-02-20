// vendor.js  
// ---------  
// List of vendor libraries, e.g. jQuery, Underscore, Backbone, etc.  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define  

define([ "jquery", "underscore", "backbone", "modernizr", "mustache", "jquerycookie" ], 
function (jQuery,   _,            Backbone,   Modernizr,   Mustache ) {

    jQuery.noConflict();
    _.noConflict();
    Backbone.noConflict();

    // may need to load jQuery plugins here to be sure they are added to the jQuery variable

    return {
        "jQuery": jQuery,
        "$": jQuery,
        "_": _,
        "Backbone": Backbone,
        "Modernizr": Modernizr, 
        "Mustache": Mustache
    };
});