// List of utility libraries
// -------------------------

// this module is used with the r.js optimizer tool during build  
// See http://requirejs.org/docs/faq-optimization.html

// Requires `define` see <http://requirejs.org/docs/api.html#define>  
// Returns {Object} reference to utiltiy modules

define([ 
       "utils/ajax-options",
       "utils/baselib",
       "utils/cookies",
       "utils/storage",
       "utils/debug",
       "utils/date",
       "utils/shims"
        ], 
function (
        ajaxOptions,
        baselib,
        docCookies,
        storage,
        debug,
        parseDate
        ) {

    return {
        "ajaxOptions": ajaxOptions,
        "baselib": baselib,
        "docCookies": docCookies,
        "storage": storage,
        "debug": debug,
        "parseDate": parseDate
    };
    // the shim only extend JavaScript when needed, e.g. Object.create
});
