// Controls View
// ---------
// Toggle done on entire list

// Package Todos
// Requires `define`
// Returns {ControlsView} constructor

define(['facade', 'views', 'text!todos/templates/controls.html', 'utils'], 
function(facade,   views,   controlsTemplate,                     utils) {

    var ControlsView,
        SectionView = views.SectionView,
        Channel = utils.lib.Channel,
        $ = facade.$;

    ControlsView = SectionView.extend({

        events: {
            "click #toggle-all": "toggleAll"
        },

        template: controlsTemplate,

        initialize: function (options) {
            SectionView.prototype.initialize.call(this, options);
            this.addSubscribers();
        },

        // **Method** `setOptions` - called by BaseView's initialize method
        setOptions: function (options) {
            if (!this.collection) {
                throw new Error("ControlsView expects option with collection property.");
            }
            // no model data needed, but we do need an empty object
            this.model = this.model || { toJSON: function () { return {}; } };
        },

        render: function () {
            SectionView.prototype.render.call(this);
            this.handleCheckbox();
        },

        toggleAll: function () {
            this.collection.toggleAllComplete(this.allCheckbox.checked);
            this.handleCheckbox();
        },

        handleCheckbox: function () {
            if (this.deferred.state() === 'resolved') {
                this.allCheckbox = this.allCheckbox || this.$("#toggle-all")[0];
                this.allCheckbox.checked = !this.collection.remaining().length;
            }
        },

        // Subscribers...

        addSubscribers: function () {
            this.collection.on('add remove reset sync toggleAllComplete', this.handleCheckbox);
            Channel('todo:clear').subscribe(this.handleCheckbox);
        },

        removeSubscribers: function () {
            this.collection.on('add remove reset sync toggleAllComplete', this.handleCheckbox);
            Channel('todo:clear').subscribe(this.handleCheckbox);
        }

    });

    return ControlsView;
});
