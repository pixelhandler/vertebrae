// The Todos List
// --------------

define(['facade','views', 'utils', 'todos/views/item', 'todos/views/footer'], 
function(facade,  views,   utils,   TodoItemView,       FooterView) {

    var TodosListView, 
        TodosListAbstract,
        $ = facade.$,
        _ = facade._,
        Channel = utils.lib.Channel,
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

        initialize: function(options) {
            CollectionView.prototype.initialize.call(this, options);
            if (!this.collection) {
                throw new Error("TodosListView expected options.collection.");
            }
            _.bindAll(this);
            this.addSubscribers();
        },

        render: function () {
            SectionView.prototype.render.call(this);
            if (!this.childViews.footer) {
                this.setupFooterView();
            }
            _.delay(this.handleListDisplay, 250);
            return this;
        },

        handleListDisplay: function () {
            var main = $('#main');

            if (this.collection.length) {
                main.show();
            } else {
                main.hide();
            }
            Channel('todo:stats').publish();
        },

        // Child views...
        childViews: {},

        setupFooterView: function () {
            var footerView = new FooterView({
                    el: "#footer",
                    collection: this.collection
                }),
                renderFooterView = this.addChildView(footerView);

            this.childViews.footer = footerView;
            this.callbacks.add(renderFooterView);
            this.callbacks.add(function () {
                Channel('todo:stats').publish();
            });
        },

        // Event handlers...

        addSubscribers: function () {
            this.collection.on('add remove reset sync toggleAllComplete clearCompleted', this.handleListDisplay);
            Channel('todo:clear').subscribe(this.handleListDisplay);
        },

        removeSubscribers: function () {
            this.collection.off('add remove reset sync toggleAllComplete clearCompleted', this.handleListDisplay);
            Channel('todo:clear').unsubscribe(this.handleListDisplay);
        }

    });

    return TodosListView;
});
