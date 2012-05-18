// Sync for Application State Models
// ---------------------------------

define(['facade', 'syncs/factory', 'syncs/storage', 'utils'], 
function(facade,   syncs_factory,   storage_factory, utils) {

    var sync = {},
        $ = facade.$,
        _ = facade._,
        /* CRUD */ 
        createAction, readAction, updateAction, deleteAction;
        debug = utils.debug;

    // Override storage **CRUD methods** ... 
    // functions below are called in the context of the model object
    // this refers to the model not the storage object

    // Param {Store} `store` object implements CRUD interface

    createAction = function (store) {
        var data;

        if (_.isUndefined(this.guid)) { 
            this.guid = store._guid(); 
        }
        store.data = this.toJSON();
        store.save();
        return this;
    };

    readAction = function (store, options) {
        var data, model = this, readHandler;

        data = store.getItem(store.name);
        if (!data) {
            if (model.id && model.urlRoot && model.fetch) {
                readHandler = model.fetch({
                success: function (data) {
                    model.save(options);
                    return data || readHandler(store, options);
                }
            });

            }
        }
        return readHandler || data;
    };

    updateAction = function (store) {
        store.data = this.toJSON();
        store.save();
        return this;
    };

    deleteAction = function (store) {
        store.storage.removeItem(store.name);
        delete store.data;
        return this;
    };

    implementation = storage_factory({
        "create" : createAction,
        "read" : readAction,
        "update" : updateAction,
        "destroy" : deleteAction
    });

    sync = syncs_factory(implementation);

    return sync;
});
