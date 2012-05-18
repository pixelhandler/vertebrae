// Application state collection
// ----------------------------
// a collection object to reference various states in the application

// The application manager stores data in memory and also persists data in 
// browser storage to provide a resource for common data/metadata. Also provides 
// data (state) to reconstruct the page views based on previous interactions 
// (e.g. selected tab, applied filters). The application state manager provides 
// a strategy for resources to retrieve state. 

// Requires `define`  
// Return `{ApplicationStates}` object as constructor

define(['models', 'facade', 'utils'], function (models, facade, utils) {

    var ApplicationStates, 
        appStatesInstance, // should be a singleton
        ApplicationStateModel = models.ApplicationStateModel,
        Backbone = facade.Backbone,
        // $ = facade.$,
        _ = facade._,
        docCookies = utils.docCookies;
        // lib = utils.lib,
        debug = utils.debug;

    // Constructor `{ApplicationStates}` extends Backbone.Collection.prototype
    // object literal argument to extend is the prototype for the ApplicationStates constructor
    ApplicationStates = Backbone.Collection.extend({

        // **Attributes:**  
        // {String} `name`, {Object} `data`, {String} `storage`, {Date} `expires`
        model: ApplicationStateModel,

        // **Method:** `initialize` - a Singleton  
        // Param {Object} `attributes` set on model when creating an instance  
        // Param {Object} `options`  
        // Returns a singleton instance, when called again same instance returned
        initialize: function (models, options) {
            var appStates = appStatesInstance;

            _.bindAll(this);
            // enforce Singleton object
            if (appStates && appStates instanceof ApplicationStates) {
                debug.log("ApplicationStates instance already exists.");
                return appStates;
            } else {
                debug.log("ApplicationStates initialize");
                appStatesInstance = this;
                //Backbone.Collection.prototype.initialize.call(this, arguments);
                return this;
            }
        },

        // **Method:** `add` - wrapper for addOrUpdate  
        // Param {ApplicationStateModel} `models` - may be an array of models or single model  
        // Param {Object} `options` passed to addOrUpdate
        add: function (models, options) {
            var collection = this;

            if (_.isArray(models) && models.length) {
                _.each(models, function (model) {
                    collection.addOrUpdate(model, options);
                });
            } else {
                collection.addOrUpdate(models, options);
            }
        },

        // **Method:** `addOrUpdate` - checks if model extists and updates or adds if not,
        // calls this.updateModel or Backbone.Collection.prototype.add  
        // Param {Model} `model` with attributes like ApplicationStateModel  
        // Param {Object} `options` - passed through to add or updateModel functions
        addOrUpdate: function (model, options) {
            if (!this.isAlreadyStored(model)) {
                this.storeReferenceName(model.name);
                Backbone.Collection.prototype.add.call(this, model, options);
            } else {
                this.updateModel(model, options);
            }
        },

        // **Method:** `clearModel` - removes from collection and destroys the instance  
        // Param {ApplicationStateModel} `model`
        clearModel: function (model) {
            if (model && model instanceof ApplicationStateModel) {
                this.removeReferenceName(model.get('name'));
                this.remove(model);
                this.destroy(model);
            }
        },

        // **Method:** `remove` - clear from memory  
        // Param (optional) {String} - name of a model to remove, with no param removes all  
        // Wraps Backbone.Collection.prototype.remove
        remove: function () {
            var references = ApplicationStates.references, expiringModel,
                collection = this, i;

            if (!arguments[0]) {
                debug.log("Removing all models in ApplicationStates collection (memory).");
                for (i = collection.length - 1; i >= 0; i--){
                    collection.removeReferenceName(collection.at(i).get('name'));
                    Backbone.Collection.prototype.remove.call(collection, [collection.at(i)]);
                }
            } else if (_.isString(arguments[0]) && _.contains(references, arguments[0])) {
                expiringModel = collection.findByName(arguments[0]);
                debug.log("Removing model, " + expiringModel.name + " in ApplicationStates.");
                collection.removeReferenceName(expiringModel.get('name'));
                Backbone.Collection.prototype.remove.call(collection, [expiringModel]);
            }
        },

        // **Method:** `destroy` - tear down a model that should be expired, remove and destroy
        destroy: function () {
            var references = ApplicationStates.references, expiringModel,
                collection = this;

            if (!arguments[0]) {
                debug.log("destroying all models in ApplicationStates.");
                collection.each(function(model) {
                    collection.removeReferenceName(model.get('name'));
                    collection.remove(model);
                    model.destroy();
                });
            } else if (_.isString(arguments[0]) && _.contains(references, arguments[0])) {
                expiringModel = collection.findByName(arguments[0]);
                debug.log("destroying model, " + expiringModel.cid + " in ApplicationStates.");
                collection.removeReferenceName(expiringModel.get('name'));
                collection.remove(expiringModel);
                expiringModel.destroy();
            }
        },

        // **Method:** `expiresHandler` - calls this.clearModel to expire the outdated model  
        // Param {Model} `model` like ApplicationStateModel - has property: `expires`
        expiresHandler: function (model) {
            var expired = false;
            if (!model) {
                debug.log("expiresHandler expects a model as argument, preferably with an expires attribute/property.");
                return true;
            }
            if (model instanceof ApplicationStateModel) {
                expired = model.isExpired();
            } else {
                expired = (model.expires && (new Date(model.expires).valueOf() < Date.now().valueOf()));
            }
            if (expired) {
                this.clearModel(model);
            }
            return expired;
        },

        // **Method:** `isAlreadyStored` - check if there is already a model with same name.
        // Active models' names are stored in the {Array} ApplicationStates.references  
        // Param {Model} `model` like ApplicationStateModel - has property: `name`
        isAlreadyStored: function (model) {
            var stored = false, references = ApplicationStates.references;

            if (_.isObject(model) && model.name) {
                if (_.contains(references, model.name)) {
                    stored = true;
                }
            }
            return stored;
        },

        // **Method:** `removeReferenceName` - delete a reference by name in ApplicationStates.references  
        // Param {String} `name` 
        removeReferenceName: function (name) {
            ApplicationStates.references.splice(ApplicationStates.references.indexOf(name), 1);
        },

        // **Method:** `updateModel` - replace data by key in existing model
        updateModel: function (model) {
            var existingModel = this.findByName(model.name), data = {};

            if (existingModel && _.isFunction(existingModel.toJSON)) {
                data = existingModel.toJSON();
                if (model.data) {
                    _.extend(data, model);
                    _.each(data, function (val, key, data) {
                        existingModel.set(key, val);
                    });
                }
            }
        },

        // **Method:** `save` - calls model.save() on one or all models  
        // Param (optional) {ApplicationStateModel} - first argument may be a name of model or instance
        // With no argument save all models in collection - to models' `storage` destination
        save: function () {
            var arg = arguments[0], collection = this, found;

            if (arg && !_.isArray(arg)) {
                if (arg instanceof ApplicationStateModel) {
                    arg.save();
                } else if (_.isString(arg)) {
                    found = this.findByName(arg);
                    if (found && !_.isString(found)) {
                        this.save(found);
                    }
                }
            } else if (!arg) {
                this.each(function (model) {
                    if (!collection.expiresHandler(model)) {
                        model.save();
                    }
                });
            }
        },

        // **Method:** `storeReferenceName` - add model's name to references array  
        // Param {String} `name`  
        // Returns {String} `name`
        storeReferenceName: function (name) {
            var msg, references = ApplicationStates.references;

            if (!_.isString(name)) {
                msg = "ApplicationStates failed to add a model, error on name property.";
            } else {
                references.push(name);
                msg = name + ' added to ApplicationStates';
            }
            debug.log(msg);
            return name;
        },

        // **Method:** `validate` - calls validation method(s) and collects any errors
        validate: function (attrs) {
            var errorMsg, errors = [];

            function errorCheck(msg) {
                if (_.isString(msg)) {
                    errors.push(msg);
                }
            }
            errorCheck(this.validateNameProperty(attrs));
            if (errors.length) {
                errorMsg = "ApplicationStates collection failed validation: ";
                errorMsg += errors.join(" AND ");
                debug.log(errorMsg);
                return errorMsg;
            }
        },

        // **Method:** `validateNameProperty` - name property must be a String  
        // Param {Object} `attrs` - model data attributes  
        // Returns {Undefined} `msg` or {String} `msg` with an error
        validateNameProperty: function (attrs) {
            var msg,
                name = attrs.name,
                references = ApplicationStates.references;

            if (!name || !_.isString(name)) {
                msg = "name property is not a string";
            } else {
                if (references.length && _.contains(references, name)) {
                    msg = name + " is already stored in this model";
                }
            }
            return msg;
        },

        // **Method:** `findByName` - find model in the collection by models name value
        // find method is Backbone pointer to Underscore collection `find` method  
        // See <http://documentcloud.github.com/backbone/#Collection-Underscore-Methods>  
        // Param {String} `name`  
        // Returns a model in the collection based on model's name property  
        findByName: function (name) {
            var found = null;
            if (_.isString(name) && _.contains(ApplicationStates.references, name)) {
                found = this.filter(function (model) {
                    return (model.attributes.name === name);
                });
            }
            if (_.isArray(found)) {
                if (found.length === 0) {
                    found = null;
                } else {
                    found = found[0];
                }
            }
            found = (found instanceof Backbone.Model) ? found : null;
            return (!this.expiresHandler(found)) ? found : null;
         },

        // **Method:** `findByNameInStorage` - looks for a model my name, 
        // sources to find the model are defined by the model's storage option  
        // Param {String} `name`  
        // Returns {Model} `foundData` or {Null}
        findByNameInStorage: function (name) {
            var foundData;
            if (!name || !_.isString(name)) {
                throw new Error("findByNameInStorage expects string as argument.");
            } else {
                foundData = sessionStorage.getItem(name) || localStorage.getItem(name) || docCookies.getItem(name);
            }
            foundData = (foundData) ? JSON.parse(foundData) : null;
            return (foundData && !this.expiresHandler(foundData)) ? foundData : null;
        },

        // **Method:** `findInCollectionOrStorage` - looks for 
        // sources to find the model are the collection or the model's storage option  
        // Param {String} `name`  
        // Param {Model} `model` - fetch called on model if present and when data not found  
        // Returns {Model} `foundData` or {Null}
        findInCollectionOrStorage: function (name, model) {
            var foundData;

            foundData = this.findByName(name) || this.findByNameInStorage(name);
            if (foundData) {
                if (_.isFunction(foundData.toJSON)) {
                    return foundData.toJSON();
                } else if (_.isString(foundData)) {
                    return JSON.parse(foundData);
                }
            }
            if (!foundData) {
                if (!!(model && _.isFunction(model.fetch) && model.url())) {
                    return model.fetch({url:model.url()});
                }
            }
            return (_.isObject(foundData)) ? foundData : null;
        }

    },
    // Class properties, reference like: ApplicationStates.references 
    {
        references: []
    });

    return ApplicationStates;
});
