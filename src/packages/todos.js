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
        "todos/views/todoslist"
        ],
function (require, todosLayoutTemplate) {
<<<<<<< Updated upstream:src/packages/todos.js
=======

>>>>>>> Stashed changes:src/packages/todos.js
    var TodosController,
        facade = require("facade"),
        Controller = require("controller"),
        models = require("models"),
        views = require("views"),
        utils = require("utils"),
        TodosList = require("todos/collections/todos"),
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
            this.setupTodosListView();
            this.setupLayout();

            this.layout.render();

            return this;
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

            return this.layout;
        },

        setupTodosListView: function() {
            var todosListView = new TodosListView({
                collection: new TodosList()
            });

            this.scheme.push(todosListView);
        }
    });

    return TodosController;
});
