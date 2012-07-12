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

        // @param `options` should have type and schedule properties to filter the collection by  
        // @param `models` is not really needed, (this is the args format Backbone uses)
        // when null/undefined is passed the model will filter the events collection using options param
        initialize: function (models, options) {
            if (!options && !options.type && !options.schedule) {
                throw new Error('EventsSegmentCollection expected options parameter with type and schedule properties.');
            }
            // type and schedule properties are used to filter the collection
            this.type = options.type;
            this.schedule = options.schedule;
            // use events collection models with falsy models argument, e.g. null
            this.models = models || this.selectFilters(options);
            // set this inherited property as resolved
            this.deferred.resolve();
        },

        // Methods to filter collection and match schedule and/or type
        // filter method is Backbone pointer to Underscore collection `filter` method
        // @see <http://documentcloud.github.com/backbone/#Collection-Underscore-Methods>
        // collection's properties `type` and `schedule` are setup during initialization 
        selectFilters: function (options) {
            var collection = this, models;
            if (options.type === 'All') {
                models = eventsCollection.filter(function (model) {
                    return (model.schedule && model.schedule === collection.schedule);
                });
            } else {
                models = eventsCollection.filter(function (model) {
                    var found = false;
                    if (model.schedule && model.schedule === collection.schedule) {
                        if (model.types && $.inArray(collection.type, model.types) !== -1) {
                            found = true;
                        }
                    }
                    return found;
                });
            }
            return models;
        }

    });

    // Create segmented collections from the events collection
    // e.g. 'events.today.Women', 'events.ending_soon.Home'
    // events objects are expected to have type and schedule properties
    // the strings in the schedules and type array match values on the event properties
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
