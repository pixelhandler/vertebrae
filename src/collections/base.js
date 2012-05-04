// Base Collection
// ---------------

// Requires `define`  
// Return {BaseCollection} object as constructor

define(['facade', 'utils'], function (facade, utils) {

    var BaseCollection,
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        lib = utils.lib,
        ajaxOptions = utils.ajaxOptions,
        debug = utils.debug;

    BaseCollection = Backbone.Collection.extend({

        initialize: function (models, options) {
            debug.log("BaseCollection initialize...");
            this.cid = this.cid || _.uniqueId('c');
            this.deferred = new $.Deferred();
            // Backbone.Collection.prototype.initialize.call(this, arguments);
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
            this.request = Backbone.Collection.prototype.fetch.call(this, options);
            if (!this.request) {
                this.request = this.deferred.promise();
            }
            return this.request;
        },

        // override or wrap to add a deferred object to test if resolved
        isReady: function () {
            if (this.request) {
                return this.request.isResolved();
            } else {
                return this.deferred.isResolved();
            }
        },

        fetchSuccess: function (collection, response) {
            this.deferred.resolve(response);
            debug.log(response);
        },

        fetchError: function (collection, response) {
            debug.log(response);
        }

    });

    return BaseCollection;
});
