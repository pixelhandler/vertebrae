// List of vendor libraries, e.g. jQuery, Underscore, Backbone, etc.  
// See <http://requirejs.org/docs/api.html#define>  
// Requires `define`  
// this module is used with the r.js optimizer tool during build  
// See http://requirejs.org/docs/faq-optimization.html

define(["jquery", "underscore", "backbone", "modernizr", "mustache"], 
function (jQuery, _, Backbone, Modernizr, Mustache) {

    jQuery.noConflict();
    _.noConflict();
    Backbone.noConflict();
    Modernizr = (!Modernizr) ? window.Modernizr : 'undefined';

    // Load plugins in the facade.js not here

    return {
        "jQuery": jQuery,
        "$": jQuery,
        "_": _,
        "Backbone": Backbone,
        "Modernizr": Modernizr, 
        "Mustache": require("mustache")
    };

});