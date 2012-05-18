// Sync Factory
// ------------

// Requires {object} with CRUD Interface [create, read, update, delete]
// Returns {Function} to map syncInterface to implementation of CRUD methods

define(['facade', 'utils'], function(facade, utils) {

    var syncFactory,
        _ = facade._,
        duckTypeCheck = utils.lib.duckTypeCheck;

    // Simple sync factory  
    // Param {object} `implementation` - concrete implementation of create, read, update, and destroy
    syncFactory = function (implementation) {
        var crudInterface = {};

        _.each(['create','read','update','destroy'], function (method) {
            crudInterface[method] = Function.prototype;
        });
        if (!duckTypeCheck(implementation, crudInterface)) {
            throw new Error("syncFactory expected implementation argument with CRUD methods.");
        }

        // **Interface** for Backbone.sync  
        // Param {String} `method`  One of: create, delete, read, update  
        // Param {Backbone.Model} `model` A backbone model instance  
        // Param {Object} `options` with success/error callbacks
        return function syncInterface(method, model, options) {
            switch (method) {
                case "read":
                    implementation.read(model, options);
                    break;
                case "create":
                    implementation.create(model, options);
                    break;
                case "update":
                    implementation.update(model, options);
                    break;
                case "delete":
                    implementation.destroy(model, options);
                    break;
            }
        };
    };

    return syncFactory;
});
