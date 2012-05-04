// Messaging Collection
// ---------------

// Requires `define`  
// Return {Backbone.Collection} object as constructor

define(['models', 'collections/base', 'utils', 'facade'], function (models, BaseCollection, utils, facade) {

    var MessagingCollection,
        MessagingModel = models.MessagingModel,
        Channel = utils.lib.Channel,
        debug = utils.debug,
        _ = facade._;

    MessagingCollection = BaseCollection.extend({

        model: MessagingModel,

        initialize: function() {
            _.bindAll(this);
            this.addSubscribers();
        },

        add: function(models, options) {
            var done, needToAdd = false;
            
            if( _.isArray(models) ) { //did not get a Single object
                needToAdd = true; //default behavior
            } else if ( this.length>0 ) { // received a Single object, collection may need to remove 'done' msgs
                done = this.filter( function(model){ 
                    return model.get('state') === 'done';
                });
                if( done && done.length ) {
                    if (models.message === this.at(done.length-1).get('message')) {
                        //TODO 
                        //should also verify buttons.length & each buttons name
                        //how to handle duplicate msgs
                        debug.log('duplicate msg');
                    };

                    this.remove(done); //just remove 'done' msgs
                    needToAdd = true;
                }
            } else { //received a Single object, however, collection is new
                needToAdd = true; //new collection
            }

            if(needToAdd) {
                BaseCollection.prototype.add.call(this, models, options);
            }
        },

        addSubscribers: function() {
             Channel('messaging:status', 'nomemory').subscribe(this.setStatus);
        },

        removeSubscribers: function() {
             Channel('messaging:status').unsubscribe(this.setStatus);
        },

        setStatus: function(data) {
            this.add(data);
        }
    });

    return MessagingCollection;
});