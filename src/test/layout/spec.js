// Layout manager specs :
// Presents, arranges, transitions and clears views
// --------------
// - should use 'destination' property for location on dom to show each view
// - should keep track of current state for view objects, e.g. not-rendered, rendered, displayed, not-displayed
// - should render layout's views in a non-displayed state
// - should have display method to turn a view 'on' or 'off'
// - should have access to view's promise object (returned on render) for asynchronous display
// - should manage transition between views within a layout scheme
// - should close (destroy) managed views/bindings within a layout (e.g. on transition to new layout)
// - should have option to render layout when all views' deferreds are resolved or as ready
// - should have method to get/set layout state - using sections' name and current state

// Reference:
// https://github.com/velesin/jasmine-jquery
// https://github.com/pivotal/jasmine/wiki
// http://sinonjs.org/ | http://sinonjs.org/docs/

require(['facade', 'models', 'views', 'utils'], 
function (facade,   models,   views,   utils) {

    var $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        BaseModel = models.BaseModel,
        BaseView = views.BaseView,
        LayoutView = views.LayoutView,
        SectionView = views.SectionView,
        lib = utils.lib,
        Channel = lib.Channel,
        debug = utils.debug,
        contentHTML = $('#content').html();

    describe("Dependencies", function() {

        it("should load facade, models, views and utils reference objects with require", function () {
            expect(facade).toBeDefined();
            expect(facade).not.toBe(null);
            expect(models).toBeDefined();
            expect(models).not.toBe(null);
            expect(views).toBeDefined();
            expect(views).not.toBe(null);
            expect(utils).toBeDefined();
            expect(utils).not.toBe(null);
        });

        it("should load jQuery, _ and Backbone from within facade object using require", function () {
            expect($).toBeDefined();
            expect($).not.toBe(null);
            expect(_).toBeDefined();
            expect(_).not.toBe(null);
            expect(Backbone).toBeDefined();
            expect(Backbone).not.toBe(null);
        });

        it("should load Channel, BaseModel, BaseView objects from package with require", function () {
            expect(Channel).toBeDefined();
            expect(Channel).not.toBe(null);
            expect(BaseModel).toBeDefined();
            expect(BaseModel).not.toBe(null);
            expect(BaseView).toBeDefined();
            expect(BaseView).not.toBe(null);
            expect(lib).toBeDefined();
            expect(lib).not.toBe(null);
            expect(debug).toBeDefined();
            expect(debug).not.toBe(null);
        });

    });

    describe("Layout manager", function () {

        beforeEach(function () {
            var topModel, topView, 
                bottomModel, bottomView,
                markup = $('#layoutScheme').html();

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

            this.topView = topView;
            this.bottomView = bottomView;
            this.markup = markup;
        });

        afterEach(function () {
            this.topView = null;
            this.bottomView = null;
            $('#content').html("render layout here");
        });

        it("should use 'destination' property for location on dom to show each view", function () {
            // arrange
            var layout;

            // act
            layout = new LayoutView({
                scheme: [this.topView, this.bottomView],
                destination: "#content",
                template: this.markup
            });

            // assert
            expect(layout.scheme).toBeDefined();
            expect(layout.destination).toBeDefined();
            expect(layout.template).toBeDefined();
            expect(layout.template.search('top') !== -1).toBeTruthy();
            expect(layout.template.search('bottom') !== -1).toBeTruthy();
            expect($('#content').length).toBeTruthy();
            expect($('#content #top').length).toBeTruthy();
            expect($('#content #bottom').length).toBeTruthy();
            _.each(layout.scheme, function (region) {
                expect(region.destination).toBeDefined();
                expect($('#content').find(region.destination).length).toBeTruthy();
            });
        });

        it("should keep track of current state for view objects, e.g. not-rendered, rendered, displayed, not-displayed", function () {
            // arrange
            var layout, top;

            // act
            layout = new LayoutView({
                scheme: [this.topView],
                destination: "#content",
                template: this.markup
            });

            top = layout.section('Top');

            // assert
            expect(layout.scheme.length).toBe(1);
            expect(top).toBeDefined();
            expect(top.state()).toBe('not-rendered');
            expect(top.isRendered()).toBeFalsy();
            expect(top.isNotRendered()).toBeTruthy();
            expect(top.isDisplayed()).toBeFalsy();
            expect(top.isNotDisplayed()).toBeFalsy();

            // act
            top.render();
            // assert
            expect(top.state()).toBe('rendered');
            expect(top.isNotRendered()).toBeFalsy();
            expect(top.isRendered()).toBeTruthy();

            // act
            top.display(true);
            // assert
            expect(top.state()).toBe('displayed');
            expect(top.isDisplayed()).toBeTruthy();
            expect(top.isNotDisplayed()).toBeFalsy();

            // act
            top.display(false);
            // assert
            expect(top.state()).toBe('not-displayed');
            expect(top.isDisplayed()).toBeFalsy();
            expect(top.isNotDisplayed()).toBeTruthy();
        });

        it("should render layout's views in a non-displayed state", function () {
            // arrange
            var layout, top;

            layout = new LayoutView({
                scheme: [this.topView],
                destination: "#content",
                template: this.markup
            });

            // act
            top = layout.section('Top');
            top.render('html');

            // assert
            expect(top.isNotDisplayed()).toBeFalsy();
            expect(top.isDisplayed()).toBeFalsy();
            expect(top.isNotRendered()).toBeFalsy();
            expect(top.isRendered()).toBeTruthy();
        });

        it("should have display method to turn a view 'on' or 'off'", function () {
            // arrange
            var layout;

            layout = new LayoutView({
                scheme: [this.topView],
                destination: "#content",
                template: this.markup
            });

            // act
            layout.section('Top').render('html');

            // assert
            expect(layout.section('Top').display).toBeDefined();

            // act
            layout.section('Top').display(true);
            // assert
            expect(layout.section('Top').state()).toBe('displayed');
            expect($(layout.destination).find(layout.section('Top').destination)).toHaveText('top view');

            // act
            layout.section('Top').display(false);
            // assert
            expect(layout.section('Top').state()).toBe('not-displayed');
            expect($(layout.destination).find(layout.section('Top').destination)).toHaveText('');
        });

        it("should have access to view's promise object (returned on render) for asynchronous display", function () {
            // arrange
            var layout,
                deferredMethods, 
                deferredInterface = {},
                duckTypeCheck = lib.duckTypeCheck;

            deferredMethods = [
                'always', 'done', 'fail', 'isRejected', 'isResolved', 'notify', 'notifyWith', 
                'pipe', 'progress', 'promise', 'reject', 'rejectWith', 'resolve', 
                'resolveWith', 'state', 'then'
            ]; 
            _.each(deferredMethods, function(name) {
                deferredInterface[name] = Function.prototype;
            });

            layout = new LayoutView({
                scheme: [this.topView],
                destination: "#content",
                template: this.markup
            });

            // act
            layout.section('Top').render('html');

            // assert
            expect(layout.section('Top').deferred).toBeDefined();
            expect(duckTypeCheck(layout.section('Top').deferred, deferredInterface)).toBeTruthy();
        });

        it("should have option to render layout when all views' deferreds are resolved, or as ready", function () {
            // arrange
            var layoutWhenReady, layoutWhenResolved, viewTop, viewBottom;

            layoutWhenReady = new LayoutView({
                scheme: [this.topView],
                destination: "#content",
                template: this.markup,
                displayWhen: "ready"
            });

            layoutWhenResolved = new LayoutView({
                scheme: [this.bottomView],
                destination: "#content",
                template: this.markup,
                displayWhen: "resolved"
            });

            viewTop = layoutWhenReady.section('Top');
            viewBottom = layoutWhenResolved.section('Bottom');

            // assert
            expect(layoutWhenReady.options.displayWhen === 'ready').toBeTruthy();
            expect(layoutWhenResolved.options.displayWhen === 'resolved').toBeTruthy();

            // tests for when ready...

            // assert
            expect(viewTop.isRendered()).toBeFalsy();
            expect(viewTop.isNotRendered()).toBeTruthy();
            expect(viewTop.deferred.isResolved()).toBeFalsy();

            // act
            layoutWhenReady.render();

            // expect
            expect(viewTop.isRendered()).toBeFalsy();
            expect(viewTop.isDisplayed()).toBeTruthy();
            expect($('#content #top')).toHaveText('top view');
            expect(viewTop.deferred.isResolved()).toBeTruthy();

            // tests for when resolved...

            expect(viewBottom.deferred.isResolved()).toBeFalsy();

            // act
            viewBottom.render();
            // assert
            expect(viewBottom.deferred.isResolved()).toBeTruthy();

            // act
            layoutWhenResolved.render();
            // assert
            expect($('#content #bottom')).toHaveText('bottom view');
        });

        it("should manage transition between views within a layout scheme", function () {
            // arrange
            var layout, topModel2, topView2, bottomModel2, bottomView2;

            // act
            $('#wrapper').prepend('<div id="content-transition"/>');
            layout = new LayoutView({
                scheme: [this.topView, this.bottomView],
                destination: "#content-transition",
                template: this.markup
                // defaults... 
                // displayWhen: "resolved"
                // transitionMethod: "showHide"
            });
            layout.render();
            _.each(layout.scheme, function (view) {
                layout.section(view.name).render();
            });

            // assert
            expect(layout.options.transitionMethod).toBe('showHide');
            expect($('#content-transition #top')).toHaveText('top view');
            expect($('#content-transition #bottom')).toHaveText('bottom view');

            // act
            topModel2 = new BaseModel({desc: 'top view 2'});
            topView2 = new SectionView({
                name: "Top",
                destination: "#top",
                model: topModel2,
                template: "<h1>{{desc}}</h1>",
                tagName: "section",
                className: "topView"
            });
            bottomModel2 = new BaseModel({desc: 'bottom view 2'});
            bottomView2 = new SectionView({
                name: "Bottom",
                destination: "#bottom",
                model: bottomModel2,
                template: "<h2>{{desc}}</h2>",
                tagName: "section",
                className: "bottomView"
            });
            bottomView2.render();

            // assert
            expect(topView2.isNotRendered()).toBeTruthy();
            expect(bottomView2.isRendered()).toBeTruthy();

            // act
            layout.transition('Top', topView2);
            layout.transition('Bottom', bottomView2);
            
            // assert
            expect($('#content-transition #top')).toHaveText('top view 2');
            expect($('#content-transition #bottom')).toHaveText('bottom view 2');
        });

        it("should close (destroy) managed views/bindings within a layout (e.g. on transition to new layout)", function () {
            // arrange
            var layout;

            // act
            $('#wrapper').prepend('<div id="content-destroy" />');
            layout = new LayoutView({
                scheme: [this.topView, this.bottomView],
                destination: "#content-destroy",
                template: this.markup,
                displayWhen: "ready"
            });
            layout.render();

            // assert
            expect($('#content-destroy #top')).toHaveText('top view');
            expect($('#content-destroy #bottom')).toHaveText('bottom view');
            expect(layout.scheme.length).toBe(2);

            // act
            layout.clearLayoutScheme();

            // assert
            expect($('#content-destroy #top')).toHaveText('');
            expect($('#content-destroy #bottom')).toHaveText('');
            expect(layout.scheme[0]).toBeUndefined();
            expect(layout.scheme[1]).toBeUndefined();
            expect(layout.scheme.length).toBe(0);
        });

        it("should have method to get/set layout state - using sections' name and current state", function () {
            // arrange
            var layout;

            // act
            $('#wrapper').prepend('<div id="layout-state" />');
            layout = new LayoutView({
                scheme: [this.topView, this.bottomView],
                destination: "#layout-state",
                template: this.markup,
                displayWhen: "ready"
            });
            layout.render();

            // assert
            expect(layout.scheme.length).toBe(2);
            expect(layout.state()["Top"].state).toBe("displayed");
            expect(layout.state()["Top"].meta).toBe(undefined);
            expect(layout.state()["Bottom"].state).toBe("displayed");
            expect(layout.state()["Bottom"].meta).toBe(undefined);
            expect(layout.state()["route"]).toBe("/test/layout/");

            // act
            layout.section('Top').display(false);
            // assert
            expect(layout.state()["Top"].state).toBe("not-displayed");
            expect(layout.state()["Bottom"].state).toBe("displayed");

            // act
            layout.section('Bottom').display(false);
            // assert
            expect(layout.state()["Top"].state).toBe("not-displayed");
            expect(layout.state()["Bottom"].state).toBe("not-displayed");
            expect($('#layout-state #top')).toHaveText('');
            expect($('#layout-state #bottom')).toHaveText('');

            // act
            layout.state({
                "Top": { state: "displayed" }, 
                "Bottom": { state: "displayed" }
            }, layout.displayChangeHandler);
            // assert
            expect(layout.state()["Top"].state).toBe("displayed");
            expect(layout.state()["Bottom"].state).toBe("displayed");
            expect($('#layout-state #top')).toHaveText('top view');
            expect($('#layout-state #bottom')).toHaveText('bottom view');
        });

    }); // describe

    // describe("Section View", function () {
    //     
    //     it("should have metadata used to recreate view state", function () {});
    //     
    // });
    // describe("Base View", function () {});

}); // require
