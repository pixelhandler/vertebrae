// !! Depricated for now !!

// Factory method to build CRUD methods to interface with localstorage object
//   storage methods all use localStorage property defined on the model
//   and also handle the response from the Backbone.sync calls
//
// @return {Function} storageFactory localStorage sync factory 
//      implments CRUD Interface [create, read, update, delete]
//      object has default and implementation properties


define([
        'underscore', 
        'utils/debug'
    ], function(_, debug) {

    var storageFactory, 
        /* CRUD */ 
        _create, _read, _update, _destroy;

    // storageFactory returns intermediate funcions to use as CRUD sync methods
    // @param {Function} arg CRUD method to wrap with some default behavior
    // @return {Function} with model and options params for sync method
    // 
    // also returns implemenation object of CRUD interface when argument is the same interface
    // wrapping the CRUD methods in functions to 
    //      get the model's localStorage object 
    //      and call options success/errors methods
    // @param {Object} arg CRUD interface implementation
    // @return {Object} localstorage sync object implments CRUD Interface [create, read, update, delete]
    storageFactory = function (arg) {
        if (!_.isFunction(arg)) {
            // check interface via duck typing
            if (_.isEqual(_.keys(arguments[0]), ["create", "read", "update", "destroy"])) {
                // implement interface for localstorage sync methods
                return (function (implementation) {
                    _.each(implementation, function (fn, key, _self) {
                        _self[key] = storageFactory(fn);
                    });
                    return implementation;
                })(arguments[0]);
            } else {
                return function () { 
                    debug.log("storage expected a function argument or CRUD interface");
                    return false; 
                };
            }
        } else {

            // Wrapper function for each CRUD action
            // @param {Backbone.Model or Backbone.Collection} dataObj instance should have a localStorage property
            // @param {Object} options (success, error) arguments passed when sync method is executed 
            //  (or contain a collection property) named "localStorage"
            return function (dataObj, options) {
                var resp, store = dataObj.localStorage || dataObj.collection.localStorage; 
                if (_.isUndefined(store)) {
                    debug.log("storageFactory error, data object does not have a localStorage property");
                    return false;
                } else {
                    // call action function (param) with model's context as this and continue with options calls
                    resp = arg.call(dataObj, store, options);
                    (resp) ? options.success(resp) : options.error("Record not found");
                }
            };
        }
    };

    // Implement interface methods for default localstorage persistence
    //   these methods should be called in the context of the model as this
    // @param {Store} store instance with localstorage methods
    _create = function(store) {
        return store.create(this);
    };

    _read = function(store) {
        // return this.id ? store.find(this) : store.findAll();
        return store.read(this);
    };

    _update = function(store) {
        return store.update(this); 
    };

    _destroy = function(store) {
        return store.destroy(this); 
    };

    // Setup default interface
    storageFactory.implementation = storageFactory({
        "create"  : _create,
        "read"    : _read,
        "update"  : _update,
        "destroy" : _destroy
    });

    return storageFactory;
});
