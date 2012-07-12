// Events Collection  
// -----------------

// @requires `define`  
// @return {BaseCollection} EventsCollection instance

define(['jquery','underscore','models','collections/base','utils/debug'], 
function ($,      _,           models,  BaseCollection,    debug) {

    var EventsCollection,
        eventsModel = new models.EventsData(),
        Event = models.Event;

    EventsCollection = BaseCollection.extend({
        model: Event,

        initialize: function (models, options) {
            var collection = this,
                data = eventsModel;

            collection.deferred.done(function () {
                EventsCollection.__super__.initialize.call(this, arguments);
                debug.log("EventsCollection initialized using eventsData.get('events').");
            });
            data.deferred.done(function () {
                collection.models = data.get("events");
                collection.deferred.resolve();
            });
        },

        comparator: function(event) {
            return event.get("id");
        },

        isReady: function () {
            return (eventsModel.isReady() && this.deferred.isResolved());
        },

    });

    return new EventsCollection();

});