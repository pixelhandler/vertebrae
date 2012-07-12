// Base Model  
// -------------

// Requires `define`  
// Return {BaseModel} object as constructor

define(['facade', 'utils'], function (facade, utils) {

    var BaseModel, 
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        lib = utils.baselib,
        ajaxOptions = utils.ajaxOptions,
        debug = utils.debug;

    // Constructor `{BaseModel}` extends Backbone.Model.prototype
    // object literal argument to extend is the prototype for the BaseModel constructor
    BaseModel = Backbone.Model.extend({

        // Param {Object} `attributes` set on model when creating an instance  
        // Param {Object} `options`  
        initialize: function (attributes, options) {
            // debug.log("BaseModel init called");
            if (options) {
                this.options = options;
                this.setOptions();
            }
            this.deferred = new $.Deferred();
            // Backbone.Model.prototype.initialize.call(this, arguments);
        },

        // **Property:** `request` - assign fetch return value to this.request property, 
        // fetch returns (jQuery) ajax promise object
        request: null,

        // **Method:** `fetch`
        // Wrap Backbone.Model.prototype.fetch with support for deferreds
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

        // Default success and error handlers used with this.fetch() ...

        // **Method:** `fetchSuccess` - resolve the deferred here in success
        fetchSuccess: function (model, response) {
            if (model.deferred) {
                if (!model.request) {
                    model.request = model.deferred.promise();
                }
                model.deferred.resolve();
            }
            debug.log(response);
        },

        // **Method:** `fetchError` - log response on error
        fetchError: function (model, response) {
            model.deferred.reject();
            debug.log(response);
        },

        // Primarily a tool for unit tests... Don't rely on calling this.isReady!!
        isReady: function () {
            if (this.request) {
                return this.request.isResolved();
            } else {
                return this.deferred.isResolved();
            }
        },

        // **Method:** `setOptions` - set urlRoot
        setOptions: function () {
            if (this.options && this.options.urlRoot) {
                this.urlRoot = this.options.urlRoot;
            }
        },

        truncateString: lib.truncateString
    });

    return BaseModel;
});
