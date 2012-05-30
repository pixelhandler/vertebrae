// Todo Model
// ----------
// Our basic **Todo** model has `content`, `order`, and `done` attributes.

// Requires define  
// Return {TodoModel} model constructor object  

define(['models', 'facade', 'utils'], function (models, facade, utils) {
    var TodoModel,
        BaseModel = models.BaseModel,
        _ = facade._,
        Channel = utils.lib.Channel;

    TodoModel = BaseModel.extend({
        // Default attributes for the todo.
        defaults: {
            content: "What needs to be done?",
            done: false
        },

        // Ensure that each todo created has `content`.
        initialize: function() {
            _.bindAll(this);
            if (!this.get("content")) {
                this.set({"content": this.defaults.content});
            }
        },

        // Stubbed;  integrate ASM
        destroy: function() {
            this.trigger('destroy');
        },

        // Stubbed;  integrate ASM
        save: function() {
            // no-op
        },

        // Toggle the `done` state of this todo item.
        toggle: function() {
            var doneState = this.get("done");
            this.set({done: !doneState});
            this.save({done: !doneState});
            Channel('todo:toggleDone').publish(this.collection);
        },

        // Remove this Todo and delete its view.
        clear: function() {
            //this.collection.trigger('remove', this);
            this.destroy();
        }
    });

    return TodoModel;
});