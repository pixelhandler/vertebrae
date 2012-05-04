// Welcome Model
// -------------

// Requires define  
// Return {WelcomeModel} model constructor object  

define(['models'], function (models) {

    var WelcomeModel,
        BaseModel = models.BaseModel;

    WelcomeModel = BaseModel.extend({

        defaults: {
            name: null
        }

    });

    return WelcomeModel;
});
