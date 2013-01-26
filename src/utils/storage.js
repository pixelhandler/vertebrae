// Store constructor
// -----------------
// for sessionStorage, cookie and localStorage persistence. 
//   Models are given GUIDS, and saved into a JSON object. 

// Returns {Object} `Store` with CRUD interface for storage

define(["facade", "utils/cookies", "utils/debug"], function (facade, docCookies, debug) {

    var Store,
        Modernizr = facade.Modernizr || window.Modernizr,
        _ = facade._;

    function setStorage(option) {
        switch (option) {
        case "cookie":
            if (!docCookies) {
                debug.log('cookie plugin not available.');
            } else {
                option = docCookies;
            }
            break;
        case "localStorage":
            if (!Modernizr.localstorage) {
                debug.log('Modernizr.localstorage: ' + Modernizr.localstorage);
            } else {
                option = localStorage;
            }
            break;
        default: // "sessionStorage"
            if (!Modernizr.sessionstorage) {
                debug.log('Modernizr.sessionstorage: ' + Modernizr.sessionstorage);
            } else {
                option = sessionStorage;
            }
        }
        return option;
    }

    // Our `Store` is represented by a single JS object in *localStorage*, *sessionStorage* or a cookie.  
    // Param {String} name a meaningful name, like the name you'd give a table.
    Store = function (name, option) {
        var stored;

        if (!name || !_.isString(name)) {
            throw new Error("Store expected {String} name argument.");
        }
        this.setup(name, option);
        stored = this.storage.getItem(this.name);
        this.data = (stored && JSON.parse(stored)) || {};
    };

    Store.prototype.storage = sessionStorage;

    Store.prototype.setup = function (name, option) {
        var storageOptions = ['localStorage', 'sessionStorage', 'cookie'];

        this.name = name;
        if (_.contains(storageOptions, option)) { 
            this.storage = setStorage(option);
        }
        if (!this.storage) {
            this.storage = setStorage('cookie');
            debug.log('Storage option: ' + option + ' not available, will try to use cookies.');
        }
    };

    _.extend(Store.prototype, {

        // Save the current state of the **Store** to its storage method propery.
        save: function (options) {
            this.storage.setItem(this.name, JSON.stringify(this.data), options);
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function (model) {
            if (!model.id) model.set(model.idAttribute, guid());
            this.data[model.id] = model;
            this.save();
            return model;
        },

        // read model value
        read: function (model) {
            return model.id ? this.find(model) : this.findAll();
        },

        // Update a model by replacing its copy in `this.data`.
        update: function (model) {
            this.data[model.id] = model;
            this.save();
            return model;
        },

        // Delete a model from `this.data`, returning it.
        destroy: function (model) {
            delete this.data[model.id];
            delete this.storage.removeItem(this.name);
            this.save();
            return model;
        },

        // Retrieve a model from `this.data` by id.
        find: function (model) {
            return this.data[model.id];
        },

        // Return the array of all models currently in storage.
        findAll: function () {
            return _.values(this.data);
        },

        // Generate four random hex digits.
        _S4: function () {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },

        // Generate a pseudo-GUID by concatenating random hexadecimal.
        _guid : function () {
            var s = this;
            return (s._S4()+s._S4()+"-"+s._S4()+"-"+s._S4()+"-"+s._S4()+"-"+s._S4()+s._S4()+s._S4());
        }

    });

    return Store;
});
