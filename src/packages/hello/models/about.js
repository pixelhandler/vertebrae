// Welcome Model
// -------------

// Requires define  
// Return {AboutModel} model constructor object  

define(['models'], function (models) {

    var AboutModel,
        BaseModel = models.BaseModel;

    AboutModel = BaseModel.extend({

        initialize: function (attributes, options) {
            BaseModel.prototype.initialize.call(this, attributes, options);
        },

        defaults: {
            _links: {
                // "/api/hello/101" or "/test/fixtures/hello/101.json",
                "self": null,
                "shop": null
            },
            id: "101",
            title: null,
            callToAction : null
        }

    });

    return AboutModel;
});
