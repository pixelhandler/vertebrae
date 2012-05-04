// Messaging Model
// ---------------
// Requires `define`  
// Return {Backbone.Model} object as constructor

define(['models/base'], function (BaseModel) {

    var MessagingModel;

    MessagingModel = BaseModel.extend({
        defaults: {
            'message':null,
            'buttons':[
                {
                   'name': null, 
                   'callback': Function.prototype
                }
             ],
             'state':'new'
        }
    });

    return MessagingModel;
});