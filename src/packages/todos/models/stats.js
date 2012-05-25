// Stats Model
// ----------
// Summary of todos collection stats

// Requires define  
// Return {StatsModel} model constructor object  

define(['models'], function (models) {

    var StatsModel,
        BaseModel = models.BaseModel;

    StatsModel = BaseModel.extend({

        defaults: {
            done: 0, 
            remaining: 0
        },
        
        itemsText: function (count) {
            return (count > 1 || count === 0) ? "items" : "item";
        },
        
        itemsDoneText: function () {
            return this.itemsText(this.get('done'));
        },

        itemsRemainingText: function () {
            return this.itemsText(this.get('remaining'));
        }

    });

    return StatsModel;
});