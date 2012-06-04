// Todos List
// ----------

// Package Todos
// Requires define
// Returns {TodosList} constructor

define(['facade', 'collections', 'todos/models/item'], function(facade, collections, TodoModel) {

    var TodosList,
        BaseCollection = collections.BaseCollection,
        _ = facade._;

    TodosList = BaseCollection.extend({

        // Reference to this collection's model.
        model: TodoModel,

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.filter(function(todo){ return todo.get('done'); });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.without.apply(this, this.done());
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if (!this.models.length) return 1;
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: function(todo) {
            return todo.get('order');
        },

        clearCompleted: function() {
            _.each(this.done(), function(todo){ todo.clear(); });
        },

        toggleAllComplete: function(done) {
            this.each(function (todo) { 
                todo.set({'done': done});
                todo.save(); 
            });
            this.trigger('toggleAllComplete', this);
        },

        // Stubbed;  integrate ASM
        fetch: function() {
            this.request = this.deferred.promise();
        }

    });

    return TodosList;
});
