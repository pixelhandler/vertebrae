// model.js  
// -------------
// Requires `define`  
// Return {Backbone.Model} object as constructor

define(['vendor', 'syncs', 'utils'], function (vendor, syncs, utils) {

    var BaseModel
      , Backbone = vendor.Backbone
      , Channel = utils.lib.Channel
      , store = syncs.localstorage
      , sync = syncs.sync;

    BaseModel = Backbone.Model.extend({

        // Param {Object} attributes set on model when creating an instance  
        // Param {Object} options  
        initialize: function (attributes, options) {
            // Backbone.Model.prototype.initialize.call(this, arguments);
        },

        // Pub/Sub object
        Channel: Channel,

        localStorage: store,

        sync: sync
    });

    return BaseModel;
});
