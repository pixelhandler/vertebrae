// The Todos List
// --------------

define(['facade','views', 'todos/views/item', 'todos/views/footer'], 
function(facade,  views,   TodoItemView,       FooterView) {

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
        
        name: "List",

        tagName: "ul",

        // Tag for the child views
        _tagName: "li",

        // Store constructor for the child views
        _view: TodoItemView,

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        initialize: function(options) {
            CollectionView.prototype.initialize.call(this, options);
            if (!this.collection) {
                throw new Error("TodosListView expected options.collection.");
            }
            _.bindAll(this);
            this.setupFooterView();
        },

        // Re-rendering just means refreshing the statistics
/*
        render: function () {
            SectionView.prototype.render.call(this);
            return this;
        },
*/

        // Child views...
        childViews: {},

        setupFooterView: function () {
            var footerView = new FooterView({collection: this.collection}),
                renderFooterView = this.addChildView(footerView);

            this.childViews.footer = footerView;
            this.callbacks.add(renderFooterView);
            this.callbacks.add(this.handleFooterDisplay);
        },
        
        handleFooterDisplay: function () {
            if (this.collection.length) {
                this.childViews.footer.model.set({
                    "done": this.collection.done().length, 
                    "remaining": this.collection.remaining().length
                });
                this.childViews.footer.$el.show();
            } else {
                this.childViews.footer.$el.hide();
            }
        },

        // Event handlers...

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            this.collection.clearCompleted();
            return false;
        },

        toggleAllComplete: function () {
            Channel('todos:toggleAll').publish();
        },
        
        // Subscribers...
        
/*
        addSubscribers: function () {
            this.collection.on('add destroy remove reset sync', this.render);
        },

        removeSubscribers: function () {
            this.collection.off('add destroy remove reset sync', this.render)
        }
*/

    });

    return TodosListView;
});
