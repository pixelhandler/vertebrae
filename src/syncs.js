// syncs.js  
// --------  
// sync definitions,
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define(["syncs/application-state"], function (applicationStateSync) {
    return {
        "applicationStateSync" : applicationStateSync
    };
});
