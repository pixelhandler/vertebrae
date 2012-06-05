// Application state manager specs :
// a model object to manage state within the single-page application
// --------------
// - should use options for persistent storage of data
// - should reference stored data with string name, e.g. route name
// - should store (in memory) reference to model/collection objects for reuse
// - should use a singleton object to store data in memory
// - should provide strategy for data retrieval (memory/storage/api)
// - should store view state of page layouts
// - should have expiration for data objects that are in storage

// Reference:
// https://github.com/velesin/jasmine-jquery
// https://github.com/pivotal/jasmine/wiki
// http://sinonjs.org/ | http://sinonjs.org/docs/

require(['facade', 'models', 'collections', 'views', 'utils'], 
function (facade,   models,   collections,   views,   utils) {

    var $ = facade.$,
        _ = facade._,
        docCookies = utils.docCookies,
        Backbone = facade.Backbone,
        ApplicationStateModel = models.ApplicationStateModel,
        ApplicationStates = collections.ApplicationStates,
        EventModel = models.BaseModel,
        events = collections.BaseCollection,
        MemberSummaryModel = models.BaseModel,
        lib = utils.lib,
        Channel = lib.Channel,
        debug = utils.debug;

    describe("Dependencies", function() {

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

        it("should load jQuery, _ and Backbone from within facade object using require", function () {
            expect($).toBeDefined();
            expect($).not.toBe(null);
            expect(_).toBeDefined();
            expect(_).not.toBe(null);
            expect(Backbone).toBeDefined();
            expect(Backbone).not.toBe(null);
        });

        it("should load docCookies interface", function () {
            expect(docCookies).toBeDefined();
        });

        it('should load ApplicationStateModel in models reference object', function () {
            expect(ApplicationStateModel).toBeDefined();
            expect(ApplicationStateModel).not.toBeNull();
            expect(ApplicationStates).toBeDefined();
            expect(ApplicationStates).not.toBeNull();
        });

        it("should load MemberSummaryModel in models reference object", function () {
            expect(MemberSummaryModel).toBeDefined();
            expect(MemberSummaryModel).not.toBeNull();
        });

    });

    describe("Application state manager", function () {

        // delete existing cookie if exists
        docCookies.removeItem('member', null);

        it("should use options for persistent storage of data", function () {
            // arrange
            var optionsAvail = ['localStorage', 'sessionStorage', 'cookie'],
                appState,
                test;

            // act
            appState = new ApplicationStateModel({
                name: "memberID", 
                data: {
                    memberId: 12345
                }, 
                storage: 'localStorage'
            });
            test = appState.get('storage');

            // assert
            expect(test).toBe(optionsAvail[0]);

            // act
            appState = new ApplicationStateModel({
                name: "memberGender", 
                data: {
                    gender: "W"
                }, 
                storage: 'cookie'
            });
            test = appState.get('storage');

            // assert
            expect(test).toBe(optionsAvail[2]);

            // act
            appState = new ApplicationStateModel({ 
                name: "promoCode", 
                data: {
                    promoCode: 98765
                }, 
                storage: 'sessionStorage'
            });
            test = appState.get('storage');

            // assert
            expect(test).toBe(optionsAvail[1]);
        });

        it("should reference stored data with string name, e.g. route name", function () {
            // arrange
            var appDataCollection;

            // act
            appDataCollection = new ApplicationStates([{ 
                name: "product/98765", 
                data: {
                    defaultColor: "blue"
                },
                storage: 'sessionStorage'
            }]);
            appDataCollection.add([{ 
                name: "lastViewedEvent", 
                data: {
                    promoCode: 102938
                }, 
                storage: 'sessionStorage'
            }]);

            // assert
            expect(appDataCollection.findByName('product/98765')).toBeDefined();
            expect(appDataCollection.findByName('product/98765').get('name')).toBe('product/98765');
            expect(_.contains(ApplicationStates.references, 'product/98765')).toBeTruthy();

            expect(appDataCollection.findByName('lastViewedEvent')).toBeDefined();
            expect(appDataCollection.findByName('lastViewedEvent').get('name')).toBe('lastViewedEvent');
            expect(_.contains(ApplicationStates.references, 'lastViewedEvent')).toBeTruthy();
        });

        it("should store (in memory) reference to model/collection objects for reuse", function () {
            // arrange
            var server, eventsList, eventItem, memberData, appData,
                eventsData = {
                "_links": {
                    "self": {
                        "href": "/v4/events"
                    },
                    "events/upcoming": {
                        "href": "/v4/events?status=upcoming&days={days}"
                    }
                },
                "_embedded": {
                    "event": [
                        {
                            "_links": {
                                "self": {
                                    "href": "/v4/events/15301"
                                },
                                "/catalog": {
                                    "href": "/v4/events/15301/catalog"
                                },
                                "/availability": {
                                    "href": "/v4/events/15301/availability"
                                },
                                "/images/event-hero": {
                                    "href": "/assets/15301leviswd/event-small.jpg"
                                },
                                "/images/seals/event-hero": {
                                    "href": ""
                                },
                                "/images/seals/catalog-banner": {
                                    "href": ""
                                }
                            },
                            "id": 15301,
                            "title": "Levi's Made & Crafted",
                            "start_date": "2012-04-04T08:00:00-07:00",
                            "end_date": "2012-04-06T08:00:00-07:00",
                            "tagline": "Extraordinary details define this denim line",
                            "status": "active",
                            "visibility": "public",
                            "sale_type": "default",
                            "verticals": [
                                {
                                    "vertical": "Women"
                                }
                            ],
                            "nesting": {
                                "parents": [],
                                "children": [],
                                "siblings": []
                            }
                        },
                        {
                            "_links": {
                                "self": {
                                    "href": "/v4/events/15147"
                                },
                                "/catalog": {
                                    "href": "/v4/events/15147/catalog"
                                },
                                "/availability": {
                                    "href": "/v4/events/15147/availability"
                                },
                                "/images/event-hero": {
                                    "href": "/assets/15147chanluuwj/event-small.jpg"
                                },
                                "/images/seals/event-hero": {
                                    "href": ""
                                },
                                "/images/seals/catalog-banner": {
                                    "href": ""
                                }
                            },
                            "id": 15147,
                            "title": "Chan Luu",
                            "start_date": "2012-04-04T08:00:00-07:00",
                            "end_date": "2012-04-06T08:00:00-07:00",
                            "tagline": "Layer these colorful beaded wrap bracelets",
                            "status": "active",
                            "visibility": "public",
                            "sale_type": "default",
                            "verticals": [
                                {
                                    "vertical": "Women"
                                }
                            ],
                            "nesting": {
                                "parents": [],
                                "children": [
                                    {
                                        "id": 12635
                                    },
                                    {
                                        "id": 15163
                                    }
                                ],
                                "siblings": []
                            }
                        },
                        {
                            "_links": {
                                "self": {
                                    "href": "/v4/events/14137"
                                },
                                "/catalog": {
                                    "href": "/v4/events/14137/catalog"
                                },
                                "/availability": {
                                    "href": "/v4/events/14137/availability"
                                },
                                "/images/event-hero": {
                                    "href": "/assets/14137frockbytracyreesewc/event-small.jpg"
                                },
                                "/images/seals/event-hero": {
                                    "href": ""
                                },
                                "/images/seals/catalog-banner": {
                                    "href": ""
                                }
                            },
                            "id": 14137,
                            "title": "frock! by Tracy Reese",
                            "start_date": "2012-04-04T08:00:00-07:00",
                            "end_date": "2012-04-06T08:00:00-07:00",
                            "tagline": "Dress silhouettes with flirty embellishments",
                            "status": "active",
                            "visibility": "public",
                            "sale_type": "default",
                            "verticals": [
                                {
                                    "vertical": "Women"
                                }
                            ],
                            "nesting": {
                                "parents": [],
                                "children": [
                                    {
                                        "id": 14125
                                    },
                                    {
                                        "id": 14158
                                    }
                                ],
                                "siblings": []
                            }
                        },
                        {
                            "_links": {
                                "self": {
                                    "href": "/v4/events/15099"
                                },
                                "/catalog": {
                                    "href": "/v4/events/15099/catalog"
                                },
                                "/availability": {
                                    "href": "/v4/events/15099/availability"
                                },
                                "/images/event-hero": {
                                    "href": "/assets/15099invictablwtunisex/event-small.jpg"
                                },
                                "/images/seals/event-hero": {
                                    "href": "/images/scrims/Blowout_85percent_Event_Page.png"
                                },
                                "/images/seals/catalog-banner": {
                                    "href": "/images/scrims/Blowout_85percent_Catalog_Banner.png"
                                }
                            },
                            "id": 15099,
                            "title": "Invicta Blowout",
                            "start_date": "2012-04-04T08:00:00-07:00",
                            "end_date": "2012-04-06T08:00:00-07:00",
                            "tagline": "Casual styles and dressed-up timepieces",
                            "status": "active",
                            "visibility": "public",
                            "sale_type": "select",
                            "verticals": [
                                {
                                    "vertical": "Men"
                                },
                                {
                                    "vertical": "Women"
                                }
                            ],
                            "nesting": {
                                "parents": [],
                                "children": [],
                                "siblings": []
                            }
                        },
                        {
                            "_links": {
                                "self": {
                                    "href": "/v4/events/15280"
                                },
                                "/catalog": {
                                    "href": "/v4/events/15280/catalog"
                                },
                                "/availability": {
                                    "href": "/v4/events/15280/availability"
                                },
                                "/images/event-hero": {
                                    "href": "/assets/15280viviennetamwc/event-small.jpg"
                                },
                                "/images/seals/event-hero": {
                                    "href": ""
                                },
                                "/images/seals/catalog-banner": {
                                    "href": ""
                                }
                            },
                            "id": 15280,
                            "title": "Vivienne Tam",
                            "start_date": "2012-04-04T08:00:00-07:00",
                            "end_date": "2012-04-06T08:00:00-07:00",
                            "tagline": "Rich designs known for their fit and detail",
                            "status": "active",
                            "visibility": "public",
                            "sale_type": "default",
                            "verticals": [
                                {
                                    "vertical": "Women"
                                }
                            ],
                            "nesting": {
                                "parents": [],
                                "children": [],
                                "siblings": []
                            }
                        }
                    ]
                }
            };

            server = sinon.fakeServer.create();
            server.respondWith(
                "GET",
                "/v4/events",
                [
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify(eventsData)
                ]
            );
            server.respondWith(
                "GET",
                "/v4/events/15301",
                [
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify(eventsData._embedded["event"][0])
                ]
            );

            // act
            eventsList = new events([],{url: "/v4/events"});
            //eventsList.fetch();
            server.respond();

            appData = new ApplicationStates();
            appData.add([{ 
                name: "/v4/events", // eventsList.url
                data: eventsList, 
                storage: 'sessionStorage'
            }]);

            // assert
            expect(appData.findByName('/v4/events')).toBeDefined();
            expect(appData.findByName('/v4/events').get('name')).toBe('/v4/events');
            expect(_.contains(ApplicationStates.references, '/v4/events')).toBeTruthy();

            // act
            EventModel = EventModel.extend({
                urlRoot: "/v4/events"
            });
            eventItem = new EventModel({id: "15301"});
            eventItem.fetch({
                success:function(data){
                    debug.log(data);
                    // mock server doesn't return promise like jQuery does.
                    eventItem.deferred.resolve();
                }
            });
            server.respond();

            appData.add([
                { 
                    name: eventItem.url(), //"/v4/events/15301", 
                    data: eventItem, 
                    storage: 'sessionStorage'
                }
            ]);

            // assert
            expect(appData.findByName('/v4/events/15301')).toBeDefined();
            expect(appData.findByName('/v4/events/15301').get('name')).toBe('/v4/events/15301');
            expect(_.contains(ApplicationStates.references, '/v4/events/15301')).toBeTruthy();
            expect(appData.findByName('/v4/events/15301').get('data').cid).toEqual(eventItem.cid);
            expect(appData.findByName('/v4/events/15301').get('data').id).toEqual(eventItem.id);
            expect(appData.findByName('/v4/events/15301').get('data').get('title')).toEqual(eventItem.get('title'));

            // act
            memberData = new MemberSummaryModel({
                "member_id":1234567,
                "gender":"M"
            });

            // assert
            expect(memberData.get('member_id')).toBe(1234567);
            expect(memberData.get('gender')).toBe('M');

            // act
            appData.add([
                { 
                    name: "memberSummaryData",
                    data: memberData, 
                    storage: 'sessionStorage'
                }
            ]);

            // assert
            expect(appData.findByName('memberSummaryData')).toBeDefined();
            expect(appData.findByName('memberSummaryData').get('name')).toBe('memberSummaryData');
            expect(_.contains(ApplicationStates.references, 'memberSummaryData')).toBeTruthy();

            expect(appData.findByName('memberSummaryData').get('data').cid).toEqual(memberData.cid);
            expect(appData.findByName('memberSummaryData').get('data').get('member_id')).toEqual(memberData.get('member_id'));
            expect(appData.findByName('memberSummaryData').get('data').get('gender')).toEqual(memberData.get('gender'));

            server.restore();
        });

        it("should use a singleton object to store data in memory", function () {
            // arrange
            var appState, appStateAgain;

            // act
            appState = new ApplicationStates();
            appState.add([{ 
                name: "expiredCartItems", 
                data: {
                    expiredCartItems: [
                        {
                            event: 9866,
                            style: "BQ0561",
                            sku: {
                                color: "Watermelon",
                                size: "10"
                            }
                        }
                    ]
                }, 
                storage: 'localStorage'
            }]);

            // assert
            expect(appState instanceof ApplicationStates).toBeTruthy();
            expect(appState.length).toBe(1);

            // act
            appStateAgain = new ApplicationStates();
            appStateAgain.add([{ 
                name: "twitterUserName", 
                data: {
                    twitterUserName: "pixelhandler"
                }, 
                storage: 'localStorage'
            }]);

            // assert
            expect(appStateAgain instanceof ApplicationStates).toBeTruthy();

            expect(appStateAgain.cid).toEqual(appState.cid);
            expect(appStateAgain.length).toEqual(appStateAgain.length);
            expect(appStateAgain.constructor.references).toBe(appState.constructor.references);
            expect(_.contains(ApplicationStates.references, "expiredCartItems")).toBeTruthy();
            expect(_.contains(ApplicationStates.references, "twitterUserName")).toBeTruthy();
        });

        it("should store view state of page layouts", function () {
            var appState, 
                mockLayoutState = {
                    "header": { "state": "displayed", "meta": { "tab" : "Women" } }, 
                    "footer": { "state": "displayed", "meta": { "tab" : "Women" } },
                    "events": { "state": "displayed", "meta": { "tab" : "Women" } },
                    "upcoming": { "state": "displayed", "meta": { "tab" : "Women" } },
                    "route" : "/events"
                },
                layout, layoutState, 
                topModel, topView, bottomModel, bottomView;

            // act
            appState = new ApplicationStates();
            appState.add([{ 
                name: "/events", 
                data: mockLayoutState, 
                storage: 'sessionStorage'
            }]);

            // assert
            expect(_.contains(ApplicationStates.references, "/events")).toBeTruthy();

            runs(function () {
                // act
                topModel = new models.BaseModel({desc: 'top view'});
                topView = new views.SectionView({
                    name: "Top",
                    destination: "#top",
                    model: topModel,
                    template: "<h1>{{desc}}</h1>",
                    tagName: "section",
                    className: "topView"
                });

                bottomModel = new models.BaseModel({desc: 'bottom view'});
                bottomView = new views.SectionView({
                    name: "Bottom",
                    destination: "#bottom",
                    model: bottomModel,
                    template: "<h2>{{desc}}</h2>",
                    tagName: "section",
                    className: "bottomView"
                });

                layout = new views.LayoutView({
                    scheme: [topView, bottomView],
                    destination: "#content",
                    template: $('#layoutScheme').html(),
                    displayWhen: "ready"
                });
                layout.render();
            
            }); // runs

            waitsFor(function () {
                return layout.section("Top").isDisplayed() && layout.section("Bottom").isDisplayed();
            });

            runs(function () {

                layoutState = layout.state();
                appState.add([{ 
                    name: layoutState.route, 
                    data: layoutState, 
                    storage: 'sessionStorage'
                }]);

                // assert
                expect(layoutState["Top"].state).toBe("displayed");
                expect(layoutState["Bottom"].state).toBe("displayed");
                expect(layoutState["route"]).toBe("/test/applicationstates/");
                //expect(layoutState["meta"]).toBeDefined();
                expect(_.contains(ApplicationStates.references, layoutState.route)).toBeTruthy();
                expect(appState.findByName(layoutState.route).get('data').route).toBe(layoutState.route);

            }); // runs
        });

    }); // describe

    describe("Application state manager data storage strategy", function () {

        /*
            when a name is requested and not in memory the app state should check for browser storage 
            versions; when a name and data is given to the application state the storage option should 
            be used to utilize browser storage to save the data for retrieval later perhaps when app 
            states are removed from memory
        */
        describe("should provide strategy for data retrieval (memory/storage/api)", function () {

            beforeEach(function () {

                ApplicationStates.references = [];

                this.appState = new ApplicationStates();

                this.appState.add([
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
                    },
                    // localStorage
                    { 
                        name: "promoCode", 
                        data: {
                            promoCode: 9876543
                        }, 
                        storage: 'localStorage'
                    },
                    // cookie
                    {
                        name: "memberId", 
                        data: {
                            memberId: 1234567
                        },
                        storage: 'cookie',
                        expires: new Date(Date.now() + 1000 * (/*secs*/60 * /*mins*/60 * /*hrs*/24 * /*days*/365))
                    }
                ]);
            });

            afterEach(function () {
                delete this.appState;
            });

            it("should save items for persistent storage per items' storage property value", function () {
                // arrange
                var appState = this.appState, storedData, collectionData;

                // act
                // store data by storage option
                appState.save();

                // with localStorage
                storedData = JSON.parse(localStorage.getItem('promoCode')).data.promoCode;
                collectionData = appState.findByName('promoCode').toJSON().data.promoCode;

                // assert
                expect(storedData).toBe(9876543);
                expect(collectionData).toBe(9876543);
                expect(collectionData).toEqual(storedData);

                // act with sessionStorage
                storedData = JSON.parse(sessionStorage.getItem('/events')).data.events.state;
                collectionData = appState.findByName('/events').toJSON().data.events.state;

                // assert
                expect(storedData).toBe("displayed");
                expect(collectionData).toBe("displayed");
                expect(collectionData).toEqual(storedData);

                // act with cookie
                storedData = JSON.parse(docCookies.getItem('memberId')).data.memberId;
                collectionData = appState.findByName('memberId').toJSON().data.memberId;

                // assert
                expect(storedData).toBe(1234567);
                expect(collectionData).toBe(1234567);
                expect(collectionData).toEqual(storedData);
            });

            it("should get items from memory if exist in ApplicationStates collection", function () {
                // arrange
                var appState = this.appState, collectionData;

                // act
                collectionData = appState.findByName('promoCode').toJSON().data.promoCode;
                // assert
                expect(collectionData).toBe(9876543);

                // act
                collectionData = appState.findByName('/events').toJSON().data.events.state;
                // assert
                expect(collectionData).toBe("displayed");

                // act
                collectionData = appState.findByName('memberId').toJSON().data.memberId;
                // assert
                expect(collectionData).toBe(1234567);
            });

            it("should get item from sessionStorage (when not in memory)", function () {
                // arrange
                var appState = this.appState, storedData;

                // act
                appState.remove();
                // assert
                expect(appState.length).toBe(0);

                // act
                storedData = appState.findByNameInStorage('/events');
                // assert
                expect(sessionStorage.getItem('/events')).toBeTruthy();
                expect(storedData).toBeTruthy();
                expect(storedData.name).toBe('/events');
            });

            it("should get item from localStorage (when not in memory)", function () {
                // arrange
                var appState = this.appState, storedData;

                // act
                appState.remove();
                // assert
                expect(appState.length).toBe(0);

                // act
                storedData = appState.findByNameInStorage('promoCode');
                // assert
                expect(localStorage.getItem('promoCode')).toBeTruthy();
                expect(storedData).toBeTruthy();
                expect(storedData.name).toBe('promoCode');
            });

            it("should get item from cookie (when not in memory)", function () {
                // arrange
                var appState = this.appState, storedData;

                // act
                appState.remove();
                // assert
                expect(appState.length).toBe(0);

                // act
                storedData = appState.findByNameInStorage('memberId');
                // assert
                expect(docCookies.getItem('memberId')).toBeTruthy();
                expect(storedData).toBeTruthy();
                expect(storedData.name).toBe('memberId');
            });

            it("given callback function, should get item from api (when not in memory or storage)", function () {
                // arrange
                var appState = this.appState,
                    serverData,
                    server = sinon.fakeServer.create(),
                    Model = Backbone.Model.extend({urlRoot: '/v4/events/'});
                    model = new Model({id: 12345});

                server.respondWith(
                    "GET",
                    "/v4/events/12345",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify({
                            "id": 12345,
                            "title": "Levi's Made & Crafted",
                            "start_date": "2012-04-04T08:00:00-07:00"
                        })
                    ]
                );

                // act
                appState.destroy();
                appState.remove();

                // assert
                expect(appState.length).toBe(0);
                expect(appState.findByName('/v4/events/12345')).toBeNull();
                expect(appState.findByNameInStorage('/v4/events/12345')).toBeNull();
                expect(model.urlRoot).toBe('/v4/events/');
                expect(model.id).toBe(12345);
                expect(model.url()).toBe('/v4/events/12345');

                // act
                serverData = appState.findInCollectionOrStorage('/v4/events/12345', model);
                server.respond();

                // assert
                expect(model.get("title")).toBe("Levi's Made & Crafted");
                expect(serverData).toBeTruthy();
            });

            it("should have expiration for data objects that are in storage", function () {
                // arrange
                var appState = this.appState;

                // act
                appState.destroy();
                appState.remove();

                appState.add([
                    // sessionStorage
                    { 
                        name: "/v4/events/12345", 
                        data: {
                            "id": 12345,
                            "title": "Levi's Made & Crafted",
                            "start_date": "2012-04-04T08:00:00-07:00"
                        },
                        storage: 'sessionStorage',
                        expires: new Date(Date.now() - 1000 * (/*secs*/60 * /*mins*/60 * /*hrs*/24 * /*days*/1))
                    },
                    // localStorage
                    { 
                        name: "promoCode", 
                        data: {
                            promoCode: 9876543
                        }, 
                        storage: 'localStorage',
                        expires: new Date(Date.now() - 1000 * (/*secs*/60 * /*mins*/60 * /*hrs*/24 * /*days*/1))
                    },
                    // cookie
                    {
                        name: "lastViewedProduct", 
                        data: {
                            lastViewedProduct: 12345
                        },
                        storage: 'cookie',
                        expires: new Date(Date.now() - 1000 * (/*secs*/60 * /*mins*/60 * /*hrs*/24 * /*days*/1))
                    }
                ]);
                appState.save();

                // assert
                expect(appState.findByName('/v4/events/12345')).toBeNull();
                expect(appState.findByNameInStorage('/v4/events/12345')).toBeNull();
                expect(_.contains(ApplicationStates.references, "/v4/events/12345")).toBeFalsy();
                expect(appState.findByName('promoCode')).toBeNull();
                expect(appState.findByNameInStorage('promoCode')).toBeNull();
                expect(_.contains(ApplicationStates.references, "promoCode")).toBeFalsy();
                expect(appState.findByName('lastViewedProduct')).toBeNull();
                expect(appState.findByNameInStorage('lastViewedProduct')).toBeNull();
                expect(_.contains(ApplicationStates.references, "lastViewedProduct")).toBeFalsy();
                expect(appState.findInCollectionOrStorage('lastViewedProduct')).toBeNull();
            });

        }); // describe

    }); // describe

}); // require
