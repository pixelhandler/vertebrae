// Form View
// ---------
// Input form to create Todo items

// Package Todos
// Requires define
// Returns {TodoFormView} constructor

define(['require', 'text!todos/templates/form.html', 'views', 'todos/models/todo_item'], 

function(require, formTemplate) {

    var TodoFormView,
        views = require('views'),
        TodoModel = require('todos/models/todo_item'),
        SectionView = views.SectionView;

    TodoFormView = SectionView.extend({

        tagName: 'form',

        className: 'create-todo',

        template: formTemplate,

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "showTooltip",
            "submit": "submitHandler"
        },

        initialize: function (options) {
            SectionView.prototype.initialize.call(this, options);
            this.model = new TodoModel();
        },

        render: function () {
            SectionView.prototype.render.call(this);
            this.input = this.$("#new-todo");
        },

        submitHandler: function (e) {
            e.preventDefault();
            this.createOnEnter(e);
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
        },

        // Lazily show the tooltip that tells you to press `enter` to save
        // a new todo item, after one second.
        showTooltip: function(e) {
            var tooltip = this.$(".ui-tooltip-top");
            var val = this.input.val();
            tooltip.fadeOut();

            if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);

            if (val == '' || val == this.input.attr('placeholder')) return;

            var show = function(){ tooltip.show().fadeIn(); };
            this.tooltipTimeout = _.delay(show, 1000);
        }

    });

    return TodoFormView;
});