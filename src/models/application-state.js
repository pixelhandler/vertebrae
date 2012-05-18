// Application state model
// ----------------------
// A model object to manage state within the single-page application
// Attributes: 
// {String} `name`, {Object} `data`, {String} `storage`, {Date} `expires`

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

    // Constructor `{ApplicationStateModel}` extends Backbone.Model.prototype
    // object literal argument to extend is the prototype for the ApplicationStateModel constructor
    ApplicationStateModel = Backbone.Model.extend({

        // **Property:** `defaults` - is the interface for this model properties:
        // {String} `name`, {Object} `data`, {String} `storage`, {Date} `expires`
        defaults: {
            name: null,
            data: null,
            storage: 'sessionStorage',
            expires: new Date(Date.now() + 1000 * (/*secs*/60 * /*mins*/7 /*hrs*/ /*days*/))
        },

        // Param {Object} `attributes` set on model when creating an instance  
        // Param {Object} `options`  
        initialize: function (attributes, options) {
            debug.log("ApplicationState initialize");
            this.storage = new Store(attributes.name, attributes.storage);
            this.sync = applicationStateSync;
            this.id = this.id || this.cid;
            // When extending call this with: `Backbone.Model.prototype.initialize.call(this, arguments);`
        },

        // **Method:** `isExpired` - checks if stored `expires` property out of date
        isExpired: function () {
            var expires = this.get('expires'), 
                expired = (new Date(expires).valueOf() < Date.now().valueOf());

            return expired;
        },

        // **Method:** `validate` - calls other functions to validate properties
        // collecting any errors
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

        // **Method:** `validateStorageProperty` - `storage` default is sessionStorage
        // Attribute for storage must be 'localStorage', 'sessionStorage' or 'cookie'
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

        // **Method:** `validateNameProperty` - is a String
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
