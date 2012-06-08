// Controller specs
// (gets/sets application state, and delegates work to a layout manager object,
// used within route handlers)

//   - should get data from application state manager object
//   - should initialize views/models with relevant data received from application state manager
//   - should call layout manager with arguments including relevant views/data
//   - should receive data from view objects which publish change in view state
//   - should send data to application states collection when layout state changes

// Reference:
// https://github.com/velesin/jasmine-jquery
// https://github.com/pivotal/jasmine/wiki
// http://sinonjs.org/ | http://sinonjs.org/docs/

define(['facade', 'models', 'collections', 'controller', 'views', 'utils'], 
function (facade,   models,   collections,   Controller,   views,   utils) {

    var $ = facade.$,
        _ = facade._,
        docCookies = utils.docCookies,
        Backbone = facade.Backbone,
        ApplicationStateModel = models.ApplicationStateModel,
        ApplicationStates = collections.ApplicationStates,
        BaseModel = models.BaseModel,
        BaseView = views.BaseView,
        SectionView = views.SectionView,
        LayoutView = views.LayoutView,
        lib = utils.lib,
        Channel = lib.Channel,
        debug = utils.debug;

describe("Controller Suite", function() {

    describe("Controller Dependencies", function() {

        it("should load jQuery, _ and Backbone from within facade object using require", function () {
            expect($).toBeDefined();
            expect($).not.toBe(null);
            expect(_).toBeDefined();
            expect(_).not.toBe(null);
            expect(Backbone).toBeDefined();
            expect(Backbone).not.toBe(null);
        });

        it("should load facade, models and utils reference objects with require", function () {
            expect(facade).toBeDefined();
            expect(facade).not.toBe(null);
            expect(models).toBeDefined();
            expect(models).not.toBe(null);
            expect(collections).toBeDefined();
            expect(collections).not.toBe(null);
            expect(utils).toBeDefined();
            expect(utils).not.toBe(null);
        });

        it('should load objects: ApplicationStateModel and ApplicationStates collection with require', function () {
            expect(ApplicationStateModel).toBeDefined();
            expect(ApplicationStateModel).not.toBeNull();
            expect(ApplicationStates).toBeDefined();
            expect(ApplicationStates).not.toBeNull();
        });

        it('should load objects: BaseModel, BaseView, SectionView and LayoutView with require', function () {
            expect(BaseModel).toBeDefined();
            expect(BaseModel).not.toBeNull();
            expect(BaseView).toBeDefined();
            expect(BaseView).not.toBeNull();
            expect(SectionView).toBeDefined();
            expect(SectionView).not.toBeNull();
            expect(LayoutView).toBeDefined();
            expect(LayoutView).not.toBeNull();
        });

    });

    describe("Controller Specs", function () {

        beforeEach(function () {
            var appStates = new ApplicationStates();

            $('body')
              .prepend('<div id="wrapper"><div id="content"></div></div>')
              .prepend('<script type="text/template" id="layoutScheme"><div id="top"></div><div id="bottom"></div></script>'); 

            this.appStates = appStates;
            Controller.prototype.appStates = appStates;
        });

        afterEach(function () {
            delete this.appStates;
            delete Controller.prototype.appStates;
            $('#wrapper, #layoutScheme').remove();
        });

        it("should get data from application state manager object", function () {
            // arrange
            var controller;

            this.appStates.add([
                // sessionStorage
                {
                    name: "/events", 
                    data: {
                        "header": { "state": "displayed", "meta": { "tab" : "Women" } }, 
                        "footer": { "state": "displayed", "meta": { "tab" : "Women" } },
                        "events": { "state": "displayed", "meta": { "tab" : "Women" } },
                        "upcoming": { "state": "displayed", "meta": { "tab" : "Women" } },
                        "route" : "/events"
                    }, 
                    storage: 'sessionStorage'
                }
            ]);

            // act
            controller = new Controller({
                route: "/events"
            });

            // assert
            expect(controller.data).not.toBeUndefined();
            expect(controller.data).not.toBeNull();
            expect(controller.data.route).toBe("/events");
            expect(controller.data.route).toBe(controller.route);
            expect(controller.data.header.state).toBe("displayed");
            expect(controller.data.footer.state).toBe("displayed");
            expect(controller.data.events.state).toBe("displayed");
            expect(controller.data.upcoming.state).toBe("displayed");
        });

        it("should call layout manager with arguments including relevant views/data", function () {
            // arrange
            var layout, controller, topModel, topView, bottomModel, bottomView,
                markup = $('#layoutScheme').html(), top, bottom;

            topModel = new BaseModel({desc: 'top view'});

            topView = new SectionView({
                name: "Top",
                destination: "#top",
                model: topModel,
                template: "<h1>{{desc}}</h1>",
                tagName: "section",
                className: "topView"
            });

            bottomModel = new BaseModel({desc: 'bottom view'});

            bottomView = new SectionView({
                name: "Bottom",
                destination: "#bottom",
                model: bottomModel,
                template: "<h2>{{desc}}</h2>",
                tagName: "section",
                className: "bottomView"
            });

            this.appStates.add([
                {
                    name: "/test/controller/", 
                    data: {
                        "Top" : { "state": "displayed" },
                        "Bottom" : { "state": "not-displayed" },
                        "route" : "/test/controller/"
                    }, 
                    storage: 'sessionStorage'
                }
            ]);

            // act
            controller = new Controller({
                route: "/test/controller/"
            });

            layout = new LayoutView({
                scheme: [topView, bottomView],
                destination: "#content",
                template: markup,
                displayWhen: "ready"
            }, controller);

            layout.render();

            top = layout.section('Top');
            bottom = layout.section('Bottom');

            // assert
            expect(top.isDisplayed()).toBeTruthy();
            expect(top.deferred.isResolved()).toBeTruthy();
            expect(bottom.isNotDisplayed()).toBeTruthy();
            expect(bottom.deferred.isResolved()).toBeTruthy();
        });

        it("should receive data from view objects which publish change in view state", function () {
            // arrange
            var layout, section, controller, sectionPubData = {};

            $('#wrapper').append('<section id="section">');

            // to test publishing of state changes in Section view
            Channel("Section:stateChanged").subscribe(function (lastState, state) {
                sectionPubData.lastState = lastState;
                sectionPubData.state = state;
            });

            section = new SectionView({
                name: "Section",
                destination: "#section-test",
                model: new BaseModel({ text : 'section heading here'}),
                template: "<h1>{{text}}</h1>",
                tagName: "section",
                className: "sectionView"
            });

            controller = new Controller({
                route: "/sectiontest"
            });

            layout = new LayoutView({
                scheme: [section],
                destination: "#section",
                template: '<div id="section-test"></div>',
                displayWhen: "resolved"
            }, controller);
            section.render();

            // act
            section.display(true);

            // assert
            expect($('#section').length).toBeTruthy();
            expect($('#section-test').length).toBeTruthy();
            expect($('#section-test .sectionView').length).toBeTruthy();

            // act
            section.display(false);

            // assert
            expect($('#section-test').length).toBeTruthy();
            expect($('#section-test .sectionView').length).toBeFalsy();
            expect(sectionPubData.lastState).toBeDefined();
            expect(sectionPubData.state).toBeDefined();
        });

        it("should send data to application states collection when layout state changes", function () {
            // arrange
            var layout, section, controller, stateData;

            $('#wrapper').append('<section id="storeViewState">');

            section = new SectionView({
                name: "StoreDataTest",
                destination: "#storeDataTest",
                model: new BaseModel({ text : 'store data test'}),
                template: "<h1>{{text}}</h1>",
                tagName: "section"
            });

            controller = new Controller({
                route: "/storeViewState"
            });

            layout = new LayoutView({
                scheme: [section],
                destination: "#storeViewState",
                template: '<div id="storeDataTest"></div>',
                displayWhen: "ready"
            }, controller);
            layout.render();

            // act
            stateData = controller.appStates.findByName("/storeViewState");
            debug.log(stateData);

            // assert
            expect(stateData).toBeTruthy();
            expect(stateData.get('data')['StoreDataTest'].state).toBe('displayed');
            expect(controller.getStoredState()['StoreDataTest'].state).toBe('displayed');
        });

    }); // describe

}); // describe

}); // define
