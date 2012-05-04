// Messaging View
// ---------------

// Requires `define`

define(['facade','views/base','utils'], function (facade,  BaseView,   utils) {

    var MessageView,
        $ = facade.$,
        _ = facade._,
        debug = utils.debug;

    MessageView = BaseView.extend({

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
