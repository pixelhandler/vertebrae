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
function (require, todosTemplate) {

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
            // this.setupSections();
            // this.handleDeferreds();

            return this;
        },




        setupSections: function () {
            var params = this.params;
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
            
            // REPLACE this from todos example with layout view
            // Finally, we kick things off by creating the **App**.
            //var App = new AppView;

            // TODO
            // helloLayout = new LayoutView({
            //     scheme: this.scheme,
            //     destination: "body",
            //     // require a html page layout template with text! prefix
            //     template: todosTemplate,
            //     displayWhen: "ready"
            // });
            // this.layout = helloLayout;

            return this.layout;
        },

        handleDeferreds: function () {
            var controller = this;
            // TODO
            $.when(null).then(function () {
                // controller.setupScheme();
                // controller.setupLayout().render();
            });
        },

        handleOptions: function (options) {
            if (options.params) {
                this.params = options.params;
            }
            Controller.prototype.handleOptions(options);
        }

    });

    return TodosController;
});