// localstorage.js  
// ---------------  
// A simple module to replace `Backbone.sync` with *localStorage*-based persistence. 
// Models are given GUIDS, and saved into a JSON object. 

define(['vendor'], function (vendor) {

    var Store
      , _ = vendor._;

    // Generate four random hex digits.
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    // Our Store is represented by a single JS object in *localStorage*. Create it
    // with a meaningful name, like the name you'd give a table.
    Store = function(name) {
        this.name = name;
        var store = localStorage.getItem(this.name);
        this.data = (store && JSON.parse(store)) || {};
    };

    _.extend(Store.prototype, {

      // Save the current state of the **Store** to *localStorage*.
      save: function() {
          localStorage.setItem(this.name, JSON.stringify(this.data));
      },

      // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
      // have an id of it's own.
      create: function(model) {
          if (!model.id) model.id = model.attributes.id = guid();
          this.data[model.id] = model;
          this.save();
          return model;
      },

      // Update a model by replacing its copy in `this.data`.
      update: function(model) {
          this.data[model.id] = model;
          this.save();
          return model;
      },

      // Retrieve a model from `this.data` by id.
      find: function(model) {
          return this.data[model.id];
      },

      // Return the array of all models currently in storage.
      findAll: function() {
          return _.values(this.data);
      },

      // Delete a model from `this.data`, returning it.
      destroy: function(model) {
          delete this.data[model.id];
          this.save();
          return model;
      }

    });

    return new Store();
});