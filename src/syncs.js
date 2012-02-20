// syncs.js  
// --------  
// sync definitions,
// Requires `define`  
// See http://requirejs.org/docs/api.html#define

define(["syncs/localstorage", "syncs/sync-localstorage"], function (localstorage, sync) {
    return {
        "localstorage" : localstorage,
        "sync": sync
    };
});
