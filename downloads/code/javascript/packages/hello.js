// Hello Controller
// ---------------
// module as controller for 'hello' package
// Returns {HelloController} constructor

define([
        "vendor",
        "controller",
        "models",
        "views",
        "text!hello/templates/layout.html",
        "hello/models/welcome",
        "hello/views/welcome",
        "utils"
        ],
function (
        vendor,
        Controller,
        models,
        views,
        layoutTemplate,
        WelcomeModel,
        WelcomeSectionView,
        utils
        ) {

    var HelloController,
        LayoutView = views.LayoutView,
        BaseModel = models.BaseModel,
        $ = vendor.$,
        _ = vendor._,
        debug = utils.debug,
        Channel = utils.baselib.Channel,
        cssArr = [
            HL.prependBuild("/packages/hello/welcome.css")
        ];

    HelloController = Controller.extend(    {

            initialize: function (options) {
                Channel('load:css').publish(cssArr);

                _.bindAll(this);

                this.handleOptions(options);
                this.handleDeferreds();

                return this;
            },

            setupSections: function () {
                var welcomeView, welcomeModel;

                welcomeModel = new WelcomeModel(this.params);

                welcomeView = new WelcomeSectionView({
                    model: welcomeModel,
                    name: "Welcome",
                    destination: '#welcome'
                });

                debug.log("hello controller setup welcomeView");
                this.sections["Welcome"] = welcomeView;
                this.meta.activeViews.push("Welcome");
            },

            setupScheme: function () {
                this.scheme.push(this.sections[this.meta.activeViews[0]]);
            },

            setupLayout: function () {
                var helloLayout;

                helloLayout = new LayoutView({
                    scheme: this.scheme,
                    destination: "#content",
                    // require a html page layout template with text! prefix
                    template: layoutTemplate,
                    displayWhen: "ready"
                });
                this.layout = helloLayout;

                return this.layout;
            },

            handleDeferreds: function () {
                var controller = this;

                $.when(
                    null // or deferred objects, comma separated e.g. this.eventData.request 
                ).then(function () {
                    controller.setupSections();
                    controller.setupScheme();
                    controller.setupLayout().render();
                });
            },

            handleOptions: function (options) {
                if (options.params) {
                    this.params = options.params;
                }
                Controller.prototype.handleOptions(options);
            }

        });

    return HelloController;
});