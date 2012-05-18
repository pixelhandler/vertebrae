// Messaging View
// ---------------
// Manages rendering many views with a collection,

// Requires `define`
// Returns {MessageView} constructor

define(['facade','views/base','utils'], function (facade,  BaseView,   utils) {

    var MessageView,
        $ = facade.$,
        _ = facade._,
        debug = utils.debug;

    // Constructor `{MessageView}` extends BaseView.prototype
    // object literal argument to extend is the prototype for the MessageView constructor
    MessageView = BaseView.extend({

        // Param {Object} `options` should have property: `display` and `collection` (of messages)
        initialize: function(options) {
            _.bindAll(this);
            options = options || {};
            this.display = (options.display && _.isFunction(options.display)) ? options.display : alert;
            if(!options.collection) {
                throw new Error('MessageView expected collection option');
            }
            this.collection.on('add', this.checkNew);
            this.checkNew();
        },

        // **Method:** `render`  
        // Calls the display method passed in as option during initialize
        render: function() {
            var mesg = this.model.get('message');
            var btns = this.model.get('buttons');
            this.display(mesg, btns);
            this.model.set({
                'state': 'displayed'
            }, {
                'silent': true
            });
        },

        // **Method:** `wrapCallback`  
        // buttons should have callbacks to handle resolution of notices,
        // wrap the callbacks and set the model to a `done` state.
        wrapCallback: function() {
            var model = this.model;
            var buttons = model.get('buttons');

            _.each(buttons, function(button) {
                var fn = _.wrap(button.callback, function(callback){
                    model.set({'state':'done'});
                    callback();
                    return callback;
                });
                button.callback = fn;
            });
            model.set({'buttons':buttons},{'silent':true});
        },

        // **Method:** `checkNew`  
        // Check for new messages in the collection and process
        checkNew: function() {
            var newest = this.collection.find(function(message) {
                return message.get('state') === 'new';
            });
            if (newest) {
                this.model = newest;
                this.wrapCallback();
                this.render();
            }
        }
    });

    return MessageView;
});
