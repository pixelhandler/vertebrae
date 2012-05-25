// Header Model
//-------------

// Package Todos
// Requires define
// Returns {HeaderModel} constructor

define(['models'], function (models) {

    var HeaderModel,
        BaseModel = models.BaseModel;

    HeaderModel = BaseModel.extend({

        defaults: {
            branding: 'Todos'
        }

    });

    return HeaderModel;
});