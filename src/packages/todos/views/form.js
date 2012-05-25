// Form View
// ---------
// Input form to create Todo items

// Package Todos
// Requires define
// Returns {TodoFormView} constructor

define([
        'require', 
        'text!todos/templates/form.html', 
        'facade', 
        'views', 
        'todos/models/item'
        ], function(require, formTemplate) {

    var TodoFormView,
        facade = require('facade'),
        views = require('views'),
        TodoModel = require('todos/models/item'),
        BaseView = views.BaseView,
        _ = facade._;

    TodoFormView = BaseView.extend({

        tagName: "form",

        template: formTemplate,

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo":  "createOnEnter",
            "submit": "submitHandler"
        },

/*
        initialize: function (options) {
            SectionView.prototype.initialize.call(this, options);
        },
*/
        
        // **Method** `setOptions` - called by BaseView's initialize method
        setOptions: function (options) {
            if (!this.collection) {
                throw new Error("HeaderView expected options.collection.");
            }
            if (!this.model) {
                this.model = new TodoModel();
            }
        },

        render: function () {
            BaseView.prototype.render.call(this);
            this.input = this.$("#new-todo");
        },

        dataDecorator: function (data) {
            data.tooltip = "Press Enter to save this task";
            return data;
        },

        submitHandler: function (e) {
            e.preventDefault();
            //this.createOnEnter(e);
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
            if (e.keyCode != 13) {
                return;
            }

            this.collection.add({
                content: this.input.val(),
                order: this.collection.nextOrder(),
                done: false
            });

            this.input.val('');
        }

    });

    return TodoFormView;
});