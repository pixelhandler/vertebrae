// Events Segments Collection  
// -----------------

// @requires `define`  
// @return {Array} `segments` multi-dimensional array[schedule][type] 
// with collection {EventsSegmentCollection} instances

define(['jquery','underscore','collections/events','utils/baselib','utils/debug'], 
function ($,      _,           eventsCollection,    baselib,        debug) {

    var EventsSegmentCollection, types, schedules, segments;

    // Subclass for creating specific segments of a collection
    EventsSegmentCollection = eventsCollection.constructor.extend({

        model: eventsCollection.model,

        // ...

        // Methods to filter collection and match schedule and/or type
        selectFilters: function (options) {
            var collection = this, models;

            // ... 

            return models;
        }

    });

    // Create segmented collections from the events collection
    schedules = ['today', 'ending_soon' /*, 'upcoming' */ ];
    types = ['Beauty', 'Getaways', 'Home', 'Kids', 'Men', 'Women', 'All'];

    // segments are combinations of schedules and types, e.g. `today` and `Beauty`
    segments = {};

    // iterate over schedules and types to build new collections by segments
    _.each(schedules, function (schedule) {
        segments[schedule] = {};
        _.each(types, function (type) {
            segments[schedule][type] = new EventsSegmentCollection(null, {
                "type" : type,
                "schedule" : schedule
            });
        });
    });

    return segments;

});