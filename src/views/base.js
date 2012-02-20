// base.js  
// -------  
// base view object
// Requires `define`
// Return {Backbone.Collection} object as constructor

define([ 'vendor', 'utils'], function (vendor, utils) {

    var BaseView
      , Backbone = vendor.Backbone
      , Channel = utils.lib.Channel;

    BaseView = Backbone.View.extend({

        // Param {Object} attributes set on model when creating an instance  
        // Param {Object} options  
        initialize: function (options) {},

        // Pub/Sub object
        Channel: Channel,
    });

    return BaseView;
});
