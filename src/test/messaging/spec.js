// Messaging specs :
// ---------------
// - should check member cookie prior to loading views
// - should update or set member Cookie with summary data published on channel: 'credentials:login'
// - should read member summary data and publish cart count
// - should also publish gender data M / F


// Reference:
// https://github.com/velesin/jasmine-jquery
// https://github.com/pivotal/jasmine/wiki
// http://sinonjs.org/ | http://sinonjs.org/docs/


require(['facade', 'models/messaging', 'collections/messaging', 'views/messaging', 'utils'], 
function (facade,   MessagingModel,     MessagingCollection,     MessageView,       utils) {

    var $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        lib = utils.lib,
        Channel = utils.lib.Channel,
        debug = utils.debug;

    describe("Dependencies", function() {
        it("should load jQuery, _ and Backbone with require", function () {
            expect($).toBeDefined();
            expect($).toNotBe(null);
            expect(_).toBeDefined();
            expect(_).toNotBe(null);
            expect(Backbone).toBeDefined();
            expect(Backbone).toNotBe(null);
        });
    });

    describe("Messaging Model", function () {

        beforeEach(function () {
            this.MessagingModel = MessagingModel;
            this.MessagingCollection = MessagingCollection;
            this.MessageView = MessageView;
            this.messagingList = new this.MessagingCollection();
        });

        afterEach(function () {
            this.MessagingModel = null;
            this.MessagingCollection = null;
            this.messagingList = null;
        });

        it("should keep a collection of messages in a queue", function () {

            //arrange
            var MessagingModel = this.MessagingModel; //model constructor

            //act
            var messagingList = this.messagingList;

            //assert
            expect(messagingList).toBeDefined();
            expect(messagingList.length).toBe(0);

            //actII
            var testMessage = new MessagingModel({'status':'ok'});
            var testMessage2 = new MessagingModel({'status':'not ok'});
            var testMessage3 = new MessagingModel({'status':'continue'});
            messagingList.add([testMessage,testMessage2,testMessage3]);
            
            //assertII
            expect(messagingList.length).toBe(3);
        });

        it("should receive JSON as data model via subscription", function () {
            //arrange
            var messagingList = this.messagingList;
            var errObj = {'status':'error','message':'no name provided'};

            //act

            Channel('messaging:status').publish({'status':'error','message':'no name provided'});

            //assert
            expect(messagingList).toBeDefined();
            expect(messagingList.length).toBe(1); //collection object not empty
            expect(messagingList.at(0)).toBeDefined();
            expect(messagingList.at(0).toJSON().message).toEqual(errObj.message);

        });

        it("should manage state of messages: new, displayed, done", function () {

            //arrange
            $('#wrapper').append('<div id="manageState"/>');
            var testConfirm = null;
            var messagingList = new this.MessagingCollection();
            var errObj = {'status':'error','message':'no name provided'}; 
            var handler = function(msg, btns) {
                $('#manageState').append('<input type="button" class="tester"/>');
                $('#manageState .tester').click(function(){
                    btns[0].callback();
                });
            };

            //act
            Channel('messaging:status').publish({
                    'message':'no name provided',
                    'status':'error'
                    });

            //assert
            expect(messagingList.at(0).toJSON().message).toEqual(errObj.message);
            expect(messagingList.at(0).toJSON().state).toBe('new');
            expect(messagingList.length).toBe(1); //collection object not empty

            //act
            var messageView = new this.MessageView({'display': handler, 'collection': messagingList});

            //assert
            expect(messagingList.at(0).toJSON().state).toBe('displayed');

            //act
            Channel('messaging:status').publish({
                    'message':'please confirm',
                    'buttons':[
                        {
                           'name': 'ok', 
                           'callback': function(){ 
                                debug.log.call(debug, 'confirm ok'); 
                                testConfirm = true; 
                            }
                        }
                     ]
            });

            $('#manageState .tester').trigger('click');
            //assert
            expect(messagingList.at(0).toJSON().state).toBe('done');
        });

        it("should accept and handle callback; which executes when member completes the response to message ", function () {
            //arrange
            $('#wrapper').append('<div id="acceptCallbackHandler"/>');
            var testConfirm = null;
            var messagingList = this.messagingList;
            var handler = function(msg, btns) {
                $('#acceptCallbackHandler').append('<input type="button" class="tester"/>');
                $('#acceptCallbackHandler .tester').click(function(){
                    btns[0].callback();
                });
            };
            var messageView = new this.MessageView({'display':handler,'collection':messagingList});
            var pubObj = {
                    'message':'incoming message',
                    'buttons':[
                        {
                           'name': 'respond', 
                           'callback': function(){ 
                                //debug.log('callback has run'); 
                                testConfirm = true; 
                            }
                        }
                     ]
                };

            //act
            Channel('messaging:status').publish(pubObj);
            $('#acceptCallbackHandler .tester').trigger('click');

            //assert
            expect(messagingList.at(0).toJSON().message).toBe('incoming message');
            expect(testConfirm).toBe(true);
        });

        it("should support actions for Cancel, OK / Continue, and also (continue) destination with button name received from publisher", function () {
            //arrange
            $('#wrapper').append('<div id="supportActionsCancelOk"/>');
            var testCancel = null;
            var testConfirm = null;
            var messagingList = this.messagingList;
            var handler = function(msg, btns) {
                $('#supportActionsCancelOk').append('<input type="button" class="cancel"/><input type="button" class="continue"/>');
                $('#supportActionsCancelOk .cancel').click(function(){
                    btns[0].callback();
                });
                $('#supportActionsCancelOk .continue').click(function(){
                    btns[1].callback();
                    $(this).attr( 'data-destination', 'next-page' );
                    //debug.log($(this));
                });
            };
            var messageView = new this.MessageView({'display':handler,'collection':messagingList});
            var actionObj = {
                    'message':'action message',
                    'buttons':[
                        {
                           'name': 'cancel', 
                           'callback': function(){ 
                                //debug.log('cancel called'); 
                                testCancel = true; 
                            }
                        },
                        {
                           'name': 'continue', 
                           'callback': function(){ 
                                //debug.log('continue called'); 
                                testConfirm = true; 
                            }
                        }
                     ]
                };
                
            //act
            Channel('messaging:status').publish(actionObj);
            $('#supportActionsCancelOk .cancel').trigger('click');

            //assert
            expect(messagingList.at(0).toJSON().message).toBe('action message');
            expect(messagingList.at(0).toJSON().buttons[0].name).toBe('cancel');
            expect(testCancel).toBe(true);

            //act
            $('#supportActionsCancelOk .continue').trigger('click');

            //assert
            expect(messagingList.at(0).toJSON().message).toBe('action message');
            expect(messagingList.at(0).toJSON().buttons[1].name).toBe('continue');
            expect($('#supportActionsCancelOk .continue').attr('data-destination')).toBe('next-page');
            expect(testConfirm).toBe(true);
        });

        it("should destroy completed messages in queue", function () {
            //arrange
            $('#wrapper').append('<div id="destroyCompleted"/>');
            var testConfirm = null;
            var messagingList = this.messagingList;
            var handler = function(msg, btns) {
                $('#destroyCompleted').append('<input type="button" class="'+ btns[0].name +'"/>');
                $('#destroyCompleted .'+ btns[0].name).click(function(){
                    btns[0].callback();
                });
            };
            var messageView = new this.MessageView({'display':handler,'collection':messagingList});
            var pubObj1 = {
                'message':'continue',
                'buttons':[
                    {
                       'name': 'continue', 
                       'callback': function(){ 
                            debug.log('continue called'); 
                            this.state = 'done';
                            testConfirm = true; 
                        }
                    }
                ]
            };

            //act
            Channel('messaging:status').publish(pubObj1);
            $('#destroyCompleted .continue').trigger('click');

            //assert
            expect(messagingList.at(0).toJSON().message).toBe('continue');
            expect(messagingList.at(0).toJSON().state).toBe('done');
            expect(testConfirm).toBe(true);

            //arrange
            var testDestroy = null;

            var pubObj2 = {
                'message':'quit',
                'buttons':[
                    {
                       'name': 'destroy', 
                       'callback': function(){ 
                            debug.log('destroy called');
                            this.state = 'done';
                            testDestroy = true; 
                        }
                    }
                ]
            };
            //act
            Channel('messaging:status').publish(pubObj2);
            $('#destroyCompleted .destroy').trigger('click');
            
            //assert
            expect(testDestroy).toBe(true);
            expect(messagingList.length).toBe(1);
        });

    }); // describe

    Channel('testing', 'once memory').publish();
}); // require