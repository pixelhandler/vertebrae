// The Todos List WAS Application TODO replace with collection view.
// ---------------

define(['facade','views', 'todos/views/todo_item'], function(facade, views, TodoItemView) {
    var TodosListView,
        $ = facade.$,
        _ = facade._,
        CollectionView = views.CollectionView,
        SectionView = views.SectionView;

    var TodosListAbstract = CollectionView.extend(SectionView.prototype);
    TodosListView = TodosListAbstract.extend({
        __super__: CollectionView.prototype,

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        destination: "#todo-list",

        // Tag for the child views
        _tagName: "li",

        // Store constructor for the child views
        _view: TodoItemView,

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo":   "createOnEnter",
            "keyup #new-todo":      "showTooltip",
            "click .todo-clear a":  "clearCompleted",
            "click .mark-all-done": "toggleAllComplete"
        },

        initialize: function(options) {
            CollectionView.prototype.initialize.call(this, options);

            this.input = this.$el.find("#new-todo");
            this.allCheckbox = this.$el.find(".mark-all-done")[0];
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
            if (e.keyCode != 13) return

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
        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            this.collection.clearCompleted();
            return false;
        },

        toggleAllComplete: function () {
            this.collections.toggleAllComplete(this.allCheckbox.checked);
        }
    });

    return TodosListView;
});
