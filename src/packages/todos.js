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
        "utils"
        ],
function (require, todosLayoutTemplate) {

    var TodosController,
        vendor = require("vendor"),
        Controller = require("controller"),
        models = require("models"),
        views = require("views"),
        utils = require("utils"),
        LayoutView = views.LayoutView,
        BaseModel = models.BaseModel,
        $ = vendor.$,
        _ = vendor._,
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
            this.setupSections();
            // this.handleDeferreds();

            return this;
        },

        setupSections: function () {
            // TODO
        },

        setupScheme: function () {
            var i, params = this.params;

            for (i = 0; i < this.meta.activeViews.length; i++) {
                // TODO
                // this.scheme.push(this.sections[this.meta.activeViews[i]]);
            };
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

        // handleDeferreds: function () {
        //     var controller = this;
        //     // TODO
        //     $.when(null).then(function () {
        //         // controller.setupScheme();
        //         // controller.setupLayout().render();
        //     });
        // },

        // handleOptions: function (options) {
        //     if (options.params) {
        //         this.params = options.params;
        //     }
        //     Controller.prototype.handleOptions(options);
        // }

    });

    return TodosController;
});