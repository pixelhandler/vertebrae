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

    TodosController = Controller.extend(    {

        initialize: function (options) {
            Channel('load:css').publish(cssArr);

            _.bindAll(this);

            this.handleOptions(options);
            this.initSections();

            return this;
        },

        initSections: function () {
            this.createTodosList();
            this.setupHeaderView();
            this.setupControlsView();
            this.setupTodosListView();
            this.setupLayout().render();
        },

        createTodosList: function () {
            this.collection = new TodosList();
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
        }

    });

    return TodosController;
});
