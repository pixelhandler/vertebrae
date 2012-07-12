// Event Model
// -----------

// Requires define
// Return {Event} constructor

define(['models/base'], function (BaseModel) {

    var Event;

    Event = BaseModel.extend({ 
        defaults : { 
            // v4 (JSON HAL) Events format...
            "_links": {
                "self": {
                    "href": null
                },
                "http://hautelook.com/rels/catalog": {
                    "href": null
                },
                "http://hautelook.com/rels/availability": {
                    "href": null
                },
                "http://hautelook.com/rels/images/event-hero": {
                    "href": null
                },
                "http://hautelook.com/rels/images/seals/event-hero": {
                    "href": null
                },
                "http://hautelook.com/rels/images/seals/catalog-banner": {
                    "href": null
                },
            },
            "id": null, //"13454",
            "title": null, //"Pour La Victoire",
            "start_date": null, //"2012-02-01 08:00:00",
            "end_date": null, //"2012-02-03 08:00:00",
            "tagline": null, //"Fashionable platform pumps and ballet flats",
            "status": null, //"active",
            "visibility": null, //"public",
            "sale_type": null, //"default",
            "verticals": [ { "vertical": null /* "Women" */ } ],
            "images": {
                "hero": null, // PARSED from _links data
            },
            "seals": {
                "hero": "",
            },
            "nesting": {
                "parents": [],
                "children": [ /*{ "id": "12638" },...*/ ],
                "siblings": []
            }
        },

        urlRoot: "/v4/events",

        parse: function (data) {
            try {
                if (!data.images && data._links) {
                    data.images = {
                        hero: data._links["http://hautelook.com/rels/images/event-hero"].href
                    };
                    data.images.hero = data.images.hero.replace("event-small", "event-large");
                }
            } catch (e) {
                debug.log(e);
            }
            return data;
        },
    });

    return Event;
});
