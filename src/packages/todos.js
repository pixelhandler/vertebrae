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
        "todos/views/form",
        "todos/views/todoslist"
        ],
function (require, todosLayoutTemplate) {

    var TodosController,
        facade = require("facade"),
        Controller = require("controller"),
        models = require("models"),
        views = require("views"),
        utils = require("utils"),
        TodosList = require("todos/collections/todos"),
        TodosFormView = require("todos/views/form"),
        TodosListView = require("todos/views/todoslist"),
        LayoutView = views.LayoutView,
        BaseModel = models.BaseModel,
        $ = facade.$,
        _ = facade._,
        debug = utils.debug,
        Channel = utils.lib.Channel,
        cssArr = [
            "/packages/todos/todos.css"
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
            this.setupTodosFormView();
            this.setupTodosListView();
            this.setupLayout();
        },

        createTodosList: function () {
            this.collection = new TodosList();
        },

        setupTodosFormView: function() {
            var todosFormView;

            todosFormView = new TodosFormView({
                collection: this.collection,
                name: "Form",
                destination: "#todo-form"
            });

            this.scheme.push(todosFormView);
        },

        setupTodosListView: function() {
            var todosListView;

            todosListView = new TodosListView({
                collection: this.collection,
                name: "List",
                destination: "#todos-section"
            });

            this.scheme.push(todosListView);
        },

        setupLayout: function () {
            var todosLayout;

            todosLayout = new LayoutView({
                scheme: this.scheme,
                destination: "#content",
                // require a html page layout template with text! prefix
                template: todosLayoutTemplate,
                displayWhen: "ready"
            });
            this.layout = todosLayout;

            return this.layout.render();
        }

    });

    return TodosController;
});
