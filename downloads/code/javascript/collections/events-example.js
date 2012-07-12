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
        // ...
        }
        // ...
    });

    return new EventsCollection();

});