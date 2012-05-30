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
        'utils',
        'todos/models/stats'
        ], function(require, footerTemplate) {

    var FooterView,
        facade = require('facade'),
        views = require('views'),
        utils = require('utils'),
        StatsModel = require('todos/models/stats'),
        BaseView = views.BaseView,
        _ = facade._,
        $ = facade.$,
        Channel = utils.lib.Channel;

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
            _.bindAll(this);
            this.addSubscribers();
        },

        // **Method** `dataDecorator` - called just prior rendering
        // will render `item(s)` text in singular or plural form
        dataDecorator: function (data) {
            data.itemsDoneText = this.model.itemsDoneText();
            data.itemsRemainingText = this.model.itemsRemainingText();
            return data;
        },

        updateDisplay: function (collection) {
            if (!collection || !this.$el) {
                return; // fail silently
            } else {
                if (collection.length) {
                    this.model.set({
                        "done": collection.done().length, 
                        "remaining": collection.remaining().length
                    });
                    this.render().$el.show();
                } else {
                    this.$el.hide();
                }
            }
        },

        addSubscribers: function () {
            this.model.on('add remove change sync', this.render, this);
            Channel('todo:toggleDone').subscribe(this.updateDisplay);
        },

        removeSubscribers: function () {
            this.model.off('add remove change sync', this.render);
            Channel('todo:toggleDone').unsubscribe(this.updateDisplay);
        }

    });

    return FooterView;
});