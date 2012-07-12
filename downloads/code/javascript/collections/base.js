// Base Collection
// ---------------

// Requires `define`  
// Return {BaseCollection} object as constructor

define(['facade', 'utils'], function (facade, utils) {

    var BaseCollection,
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        lib = utils.baselib,
        ajaxOptions = utils.ajaxOptions,
        debug = utils.debug;

    // Constructor `{BaseCollection}` extends Backbone.Collection.prototype
    // object literal argument to extend is the prototype for the BaseCollection constructor
    BaseCollection = Backbone.Collection.extend({

        // **Method:** `initialize`  
        // Param {Object} `models` - added during call to new BaseCollection([/*models*/])  
        // Param {Object} `options` - add a comparator
        initialize: function (models, options) {
            debug.log("BaseCollection initialize...");
            this.cid = this.cid || _.uniqueId('c');
            this.deferred = new $.Deferred();
            // When overriding use: `Backbone.Collection.prototype.initialize.call(this, arguments);`
        },

        // **Property:** `request` - assign fetch return value to this.request property, 
        // fetch returns (jQuery) ajax promise object
        request: null,

        // **Method:** `fetch`  
        // Wrap Backbone.Collection.prototype.fetch with support for deferreds
        fetch: function (options) {
            options = options || {};
            if (!options.success) {
                options.success = this.fetchSuccess;
            }
            if (!options.error) {
                options.error = this.fetchError;
            }
            _.extend(options, ajaxOptions);
            this.request = Backbone.Collection.prototype.fetch.call(this, options);
            if (!this.request) {
                this.request = this.deferred.promise();
            }
            return this.request;
        },

        // Primarily a tool for unit tests... Don't rely on calling this.isReady!!
        isReady: function () {
            if (this.request) {
                return this.request.isResolved();
            } else {
                return this.deferred.isResolved();
            }
        },

        // Default success and error handlers used with this.fetch() ...

        // **Method:** `fetchSuccess` - resolve the deferred here in success
        fetchSuccess: function (collection, response) {
            this.deferred.resolve(response);
            debug.log(response);
        },

        // **Method:** `fetchError` - log response on error
        fetchError: function (collection, response) {
            debug.log(response);
        }

    });

    return BaseCollection;
});
