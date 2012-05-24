// The Todos List
// --------------

define(['facade','views', 'todos/views/todo_item'], function(facade, views, TodoItemView) {
    var TodosListView, 
        TodosListAbstract,
        $ = facade.$,
        _ = facade._,
        CollectionView = views.CollectionView,
        SectionView = views.SectionView;

    TodosListAbstract = CollectionView.extend(SectionView.prototype);

    TodosListView = TodosListAbstract.extend({

        __super__: CollectionView.prototype,

        id: "todo-list",

        tagName: "ul",

        // Tag for the child views
        _tagName: "li",

        // Store constructor for the child views
        _view: TodoItemView,

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "click .todo-clear a":  "clearCompleted",
            "click .mark-all-done": "toggleAllComplete"
        },

        initialize: function(options) {
            CollectionView.prototype.initialize.call(this, options);

            this.allCheckbox = this.$el.find(".mark-all-done")[0];
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
