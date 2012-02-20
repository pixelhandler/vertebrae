// utils.js  
// --------  
// utilities / libraries,  
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define(["utils/lib", "utils/debug", "utils/shims"], function (lib, debug) {
    return {
        "lib": lib,
        "debug": debug
        // the shim only extend JavaScript when needed, e.g. Object.create
    };
});
