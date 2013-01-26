// storageFactory
// --------------
// Factory to build CRUD methods in an interface with storage object
//   storage methods all use storage property defined on the model / collection
//   and also handle the response from the Backbone.sync calls
//
// Return {Function} `storageFactory`, a storage sync factory  
//     implments CRUD Interface [create, read, update, delete]  

define([
        'facade', 
        'utils/lib',
        'utils/debug'
    ], function(facade, lib, debug) {

    var storageFactory, 
        _ = facade._,
        duckTypeCheck = lib.duckTypeCheck,
        /* CRUD */ 
        createAction, readAction, updateAction, deleteAction;

    // Implement interface methods for default storage/persistence  
    //   these methods should be called in the context of the model as this  
    // Param {Store} `store` instance with storage methods
    createAction = function(store) {
        return store.create(this);
    };

    readAction = function(store) {
        // return this.id ? store.find(this) : store.findAll();
        return store.read(this);
    };

    updateAction = function(store) {
        return store.update(this); 
    };

    deleteAction = function(store) {
        return store.destroy(this); 
    };

    // Check interface via duck typing
    function isStorageInterface(arg) {
        var storageInterfaceMethods = ["create", "read", "update", "destroy"],
            storageInterface = {};

        _.each(storageInterfaceMethods, function(val, idx) {
            storageInterface[val] = Function.prototype;
        });
        return duckTypeCheck(arg, storageInterface);
    }

    // Param {Object} `crudMethods` sync method  
    // Return {Function} with model and options params for sync method
    function implementStorageInterface(crudMethods) {
        // Setup default interface
        var defaults = {
                "create" : createAction,
                "read" : readAction,
                "update" : updateAction,
                "destroy" : deleteAction
            };

        _.extend(defaults, crudMethods);
        // storageSyncMethod, implements interface for storage sync method
        return (function implementStorageSyncMethods(implementation) {
            _.each(implementation, function (fn, key, _self) {
                _self[key] = storageFactory(fn);
            });
            return implementation;
        }(defaults));
    }

    SyncAction = function(action) {
        var fn = action;
        // {Function} `syncAction`  
        // Param {Backbone.Model, Backbone.Collection or Object} `data`, should have a storage property  
        // Param {Object} `options` (success, error) arguments passed when sync method is executed 
        //  (or contain a collection property) named "storage"
        return function syncAction(data, options) {
            var resp, store = data.storage || data.collection.storage; 

            if (_.isUndefined(store)) {
                throw new Error("storageFactory error, data object does not have a storage property");
            } else {
                // Call action function (param) with model's context as this and continue with options calls
                resp = fn.call(data, store, options);
                if (resp) { 
                    options.success(data, resp, options);
                } else {
                    options.error("Record not found");
                }
            }
        };
    };

    // {Function} `storageFactory`
    // ---------------------------  
    // Returns intermediate (syncAction) functions to use as CRUD sync methods, also returns 
    // implemenation object of CRUD interface when argument is the same interface

    // Param {Object} CRUD interface implementation  
    // Return {Object} storage sync object implments CRUD Interface [create, read, update, delete]
    storageFactory = function () {
        // when firstArg is a function wrap the sync CRUD method in a function to 
        //     get the model, collection (or other object) 'storage' property/object 
        //     and call options (with success/errors methods)
        if (_.isFunction(arguments[0])) {
            return new SyncAction(arguments[0]);
        }
        // when firstArg is a storage (CRUD) interface extend & call storageFactory w/ each method
        if (isStorageInterface(arguments[0])) {
            return implementStorageInterface(arguments[0]);
        }
        // should never get here but well you know...
        if (!_.isFunction(arguments[0]) && isStorageInterface(arguments[0])) {
            throw new Error("storageFactory expected a function or CRUD interface as 1st argument.");
        }
    };

    return storageFactory;
});
