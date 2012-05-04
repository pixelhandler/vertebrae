// Base Model  
// -------------

// Requires `define`  
// Return {BaseModel} object as constructor

define(['facade', 'utils'], function (facade, utils) {

    var BaseModel, 
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        lib = utils.lib,
        ajaxOptions = utils.ajaxOptions,
        debug = utils.debug;

    BaseModel = Backbone.Model.extend({

        // Param {Object} attributes set on model when creating an instance  
        // Param {Object} options  
        initialize: function (attributes, options) {
            // debug.log("BaseModel init called");
            if (options) {
                this.options = options;
                this.handleOptions();
            }
            this.deferred = new $.Deferred();
            // Backbone.Model.prototype.initialize.call(this, arguments);
        },

        // assign fetch to request property, fetch returns jQuery ajax promise object
        request: null,

        fetch: function (options) {
            options = options || {};
            if (!options.success) {
                options.success = this.fetchSuccess;
            }
            if (!options.error) {
                options.error = this.fetchError;
            }
            _.extend(options, ajaxOptions);
            return this.request = Backbone.Model.prototype.fetch.call(this, options);
        },

        fetchSuccess: function (model, response) {
            if (model.deferred) {
                if (!model.request) {
                    model.request = model.deferred.promise();
                }
                model.deferred.resolve();
            }
            debug.log(response);
        },

        fetchError: function (model, response) {
            model.deferred.reject();
            debug.log(response);
        },

        // override or wrap to add a deferred object to test if resolved
        isReady: function () {
            if (this.request) {
                return this.request.isResolved();
            } else {
                return this.deferred.isResolved();
            }
        },

        handleOptions: function () {
            if (this.options && this.options.urlRoot) {
                this.urlRoot = this.options.urlRoot;
            }
        },

        truncateString: lib.truncateString
    });

    return BaseModel;
});
