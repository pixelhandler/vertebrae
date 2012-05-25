// Footer View
// ---------
// Report stats on todos

// Package Todos
// Requires `define`, `require`
// Returns {FooterView} constructor

define([
        'require', 
        'text!todos/templates/footer.html', 
        'facade', 
        'views', 
        'todos/models/stats'
        ], function(require, footerTemplate) {

    var FooterView,
        facade = require('facade'),
        views = require('views'),
        StatsModel = require('todos/models/stats'),
        BaseView = views.BaseView,
        _ = facade._;

    FooterView = BaseView.extend({

        model: null,

        // Footer HTML template has stats info for remaining and done
        template: footerTemplate,

        initialize: function (options) {
            BaseView.prototype.initialize.call(this, options);
            if (!this.collection) {
                throw new Error("FooterView expected options.collection.");
            }
            if (!this.model) {
                this.model = new StatsModel();
            }
            this.addSubscribers();
        },

        // **Method** `dataDecorator` - called just prior rendering
        // will render `item(s)` text in singular or plural form
        dataDecorator: function (data) {
            data.itemsDoneText = this.model.itemsDoneText();
            data.itemsRemainingText = this.model.itemsRemainingText();
            return data;
        },

        addSubscribers: function () {
            this.model.on('change', this.render/*, this*/);
        },
        
        removeSubscribers: function () {
            this.model.off('change', this.render);
        }

    });

    return FooterView;
});