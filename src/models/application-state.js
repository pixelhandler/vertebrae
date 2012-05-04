// Application state model
// ----------------------
// a model object to manage state within the single-page application

// Requires `define`  
// Return {ApplicationStateModel} object as constructor

define(['facade', 'utils', 'syncs'], function (facade, utils, syncs) {

    var ApplicationStateModel,
        Backbone = facade.Backbone,
        // $ = facade.$,
        _ = facade._,
        // lib = utils.lib,
        Store = utils.storage,
        applicationStateSync = syncs.application,
        debug = utils.debug;

    ApplicationStateModel = Backbone.Model.extend({

        defaults: {
            name: null,
            data: null,
            storage: 'sessionStorage',
            expires: new Date(Date.now() + 1000 * (/*secs*/60 * /*mins*/7 /*hrs*/ /*days*/))
        },

        // Param {Object} attributes set on model when creating an instance  
        // Param {Object} options  
        initialize: function (attributes, options) {
            debug.log("ApplicationState initialize");
            this.storage = new Store(attributes.name, attributes.storage);
            this.sync = applicationStateSync;
            this.id = this.id || this.cid;
            // Backbone.Model.prototype.initialize.call(this, arguments);
        },

        isExpired: function () {
            var expires = this.get('expires'), 
                expired = (new Date(expires).valueOf() < Date.now().valueOf());

            return expired;
        },

        validate: function (attrs) {
            var errorMsg, errors = [];

            function errorCheck(msg) {
                if (_.isString(msg)) {
                    errors.push(msg);
                }
            }
            errorCheck(this.validateNameProperty(attrs));
            errorCheck(this.validateStorageProperty(attrs));
            if (errors.length) {
                errorMsg = "ApplicationStateModel failed validation: ";
                errorMsg += errors.join(" AND ");
                debug.log(errorMsg);
                return errorMsg;
            }
        },

        validateStorageProperty: function (attrs) {
            var msg, 
                storageAvail = ['localStorage', 'sessionStorage', 'cookie'],
                storage = (_.isArray(attrs)) ? attrs[0].storage : attrs.storage;

            if (!storage || !_.contains(storageAvail, storage)) {
                msg = "Only localStorage, sessionStorage, or cookie";
                msg += " are allowed as storage properties.";
            }
            return msg;
        },

        validateNameProperty: function (attrs) {
            var msg,
                name = (_.isArray(attrs)) ? attrs[0].name : attrs.name;

            if (!name || !_.isString(name)) {
                msg = "Name property is not a string";
            }
            return msg;
        }

    });

    return ApplicationStateModel;
});
