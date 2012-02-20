// models.js  
// ---------  
// models in this directory are intended for site-wide usage  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define(["models/base", "models/product"], 
function (BaseModel,    ProductModel) {

    // Add models in this same directory to this object, 
    // for use when requiring this module.  
    // grouping site-wide models in this module (object)
    return {
        "BaseModel": BaseModel,
        "ProductModel": ProductModel
    };

});
