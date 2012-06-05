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

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "click #clear-completed": "clearCompleted"
        },

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

        updateStats: function () {
            if (!this.collection || !this.$el) {
                return; // fail silently
            } else {
                if (this.collection.models.length) {
                    this.model.set({
                        "done": this.collection.done().length, 
                        "remaining": this.collection.remaining().length
                    });
                    this.render().$el.show();
                } else {
                    this.$el.hide();
                }
            }
        },

        // Event handlers...

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            this.collection.clearCompleted();
            this.updateStats();
            return false;
        },

        // Subscribers...

        addSubscribers: function () {
            this.model.on('add remove change sync', this.render, this);
            this.collection.on('add remove reset sync toggleAllComplete', this.updateStats);
            Channel('todo:toggleDone').subscribe(this.updateStats);
            Channel('todo:clear').subscribe(this.updateStats);
            Channel('todo:stats').subscribe(this.updateStats);
        },

        removeSubscribers: function () {
            this.model.off('add remove change sync', this.render);
            this.collection.off('add remove reset sync toggleAllComplete', this.updateStats);
            Channel('todo:toggleDone').unsubscribe(this.updateStats);
            Channel('todo:clear').unsubscribe(this.updateStats);
            Channel('todo:stats').subscribe(this.updateStats);
        }

    });

    return FooterView;
});
