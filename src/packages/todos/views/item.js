// Todo Item View
// --------------
// The DOM element for a todo item...

// Package Todos
// Requires define
// Returns {TodoItemView} constructor

// TodoItemView.prototype extends SectionView.prototype to be used in a LayoutView.

define(['facade', 'views','text!todos/templates/item.html'], 
function (facade,  views,  todoItemTemplate) {

    var TodoItemView,
        _ = facade._,
        BaseView = views.BaseView;

    TodoItemView = BaseView.extend({

        //... is a list tag.
        tagName:    "li",

        template: todoItemTemplate,

        // The DOM events specific to an item.
        events: {
            "click .check"                  : "toggleDone",
            "dblclick label.todo-content"   : "edit",
            "click span.todo-destroy"       : "clear",
            "keypress .todo-input"          : "updateOnEnter",
            "blur .todo-input"              : "close"
        },

        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function(options) {
            BaseView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove);
        },

        // Re-render the contents of the todo item.
        render: function() {
            BaseView.prototype.render.call(this);
            if (!!this.model.get('done')) {
                this.$el.addClass('completed');
            }
            this.input = this.$('.todo-input');
            return this;
        },

        // Toggle the `"done"` state of the model.
        toggleDone: function() {
            this.model.toggle();
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
            this.model.set({content: this.input.val()});
            // TODO use ASM for storage... this.model.save();
            this.$el.removeClass("editing");
        },

        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.close();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.clear();
        }

    });

    return TodoItemView;
});