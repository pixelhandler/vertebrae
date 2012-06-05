// Todos Controller
// ---------------
// module as controller for 'todos' package
// Returns {TodosController} constructor

define([
    "require",
    "text!todos/templates/layout.html",
    "facade",
    "controller",
    "models",
    "views",
    "utils",
    "todos/collections/todos",
    "todos/views/header",
    "todos/views/list",
    "todos/views/controls"
    ], function (require, todosLayoutTemplate) {

    var TodosController,
        facade = require("facade"),
        Controller = require("controller"),
        models = require("models"),
        views = require("views"),
        utils = require("utils"),
        TodosList = require("todos/collections/todos"),
        TodosListView = require("todos/views/list"),
        HeaderView = require("todos/views/header"),
        ControlsView = require("todos/views/controls"),
        LayoutView = views.LayoutView,
        $ = facade.$,
        _ = facade._,
        debug = utils.debug,
        Channel = utils.lib.Channel,
        cssArr = [
            "/packages/todos/app.css"
        ];

    TodosController = Controller.extend({

        initialize: function (options) {
            Channel('load:css').publish(cssArr);

            _.bindAll(this);

            this.handleOptions(options);
            this.createTodosList();
            this.handleDeferreds();
            this.addSubscribers();

            return this;
        },

        initSections: function () {
            this.setupHeaderView();
            this.setupControlsView();
            this.setupTodosListView();
            this.setupLayout().render();
        },

        createTodosList: function () {
            // var data = this.fetchData();
            // this.collection = (data)? new TodosList(data) : new TodosList();
            this.collection = new TodosList();
            this.collection.fetch();
        },

        setupHeaderView: function() {
            var headerView;

            headerView = new HeaderView({
                collection: this.collection,
                name: "Header",
                destination: "#header"
            });

            this.scheme.push(headerView);
        },

        setupTodosListView: function() {
            var todosListView;

            todosListView = new TodosListView({
                collection: this.collection,
                destination: "#todos-section"
            });

            this.scheme.push(todosListView);
        },

        setupControlsView: function() {
            var controlsView;

            controlsView = new ControlsView({
                collection: this.collection,
                name: "Controls",
                destination: "#controls"
            });

            this.scheme.push(controlsView);
        },

        setupLayout: function () {
            var todosLayout;

            todosLayout = new LayoutView({
                scheme: this.scheme,
                destination: "#wrapper",
                // require a html page layout template with text! prefix
                template: todosLayoutTemplate,
                displayWhen: "ready"
            });
            this.layout = todosLayout;

            return this.layout;
        },

        handleDeferreds: function () {
            var controller = this;

            $.when(this.collection.request).done(function () {
                controller.initSections();
                $.when(controller.layout.deferred).done(function () {
                    _.delay(function () {
                        $('.not-ready').removeAttr('class').removeAttr('style');
                    }, 250);
                });
            });
        },

        // Using Application States Collection / localStorage for persistance of todos data

        saveData: function () {
            if (this.appStates) {
                this.appStates.add({
                    name: 'todosData',
                    data: this.collection.toJSON(),
                    storage: 'localStorage',
                    expires: new Date(Date.now() + 1000 * (/*secs*/60 * /*mins*/7 * /*hrs*/24 * /*days*/365))
                });
                this.appStates.save('todosData');
            }
        },

        destroyOrUpdateData: function (models) {
            if (this.appStates) {
                if (models && _.isArray(models)) {
                    if (this.collection.models.length === models.length) {
                        this.appStates.destroy('todosData');
                    } else {
                        this.saveData();
                    }
                }
            }
        },

        fetchData: function (callback) {
            var model, data;
            if (this.appStates) {
                model = this.appStates.findInCollectionOrStorage('todosData');
            }
            if (model && model.data) {
                data = model.data;
            }
            if (callback && _.isFunction(callback)) {
                callback(data);
            }
            return data;
        },

        addSubscribers: function () {
            this.collection.on('add remove reset toggleAllComplete', this.saveData);
            this.collection.on('clearCompleted', this.destroyOrUpdateData);
            // Channel('todos:clearCompleted').subscribe(this.destroyOrUpdateData);
            Channel('todo:toggleDone').subscribe(this.saveData);
            Channel('todo:clear').subscribe(this.saveData);
            Channel('todo:save').subscribe(this.saveData);
            Channel('todos:fetch').subscribe(this.fetchData);
        },

        removeSubscribers: function () {
            this.collection.off('add remove reset toggleAllComplete', this.saveData);
            this.collection.on('clearCompleted', this.destroyOrUpdateData);
            // Channel('todos:clearCompleted').unsubscribe(this.destroyData);
            Channel('todo:toggleDone').unsubscribe(this.saveData);
            Channel('todo:clear').unsubscribe(this.saveData);
            Channel('todo:save').unsubscribe(this.saveData);
            Channel('todos:fetch').unsubscribe(this.fetchData);
        }

    });

    return TodosController;
});
