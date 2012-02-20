// collection.js
// ------------------
// Requires `define`  
// Return {Backbone.Collection} object as constructor

define(['vendor', 'syncs', 'utils'], function (vendor, syncs, utils) {

    var BaseCollection
      , _ = vendor._
      , Backbone = vendor.Backbone
      , Channel = utils.lib.Channel
      , store = syncs.localstorage
      , sync = syncs.sync;

    BaseCollection = Backbone.Collection.extend({

        initialize: function (models, options) {
            this.cid = this.cid || _.uniqueId('c');
            // Backbone.Collection.prototype.initialize.call(this);
        },

        // Pub/Sub object
        Channel: Channel,

        // localStorage: store,

        // sync: sync
    });

    return BaseCollection;
});

