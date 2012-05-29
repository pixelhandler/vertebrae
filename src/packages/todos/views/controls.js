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
            this.allCheckbox = this.$("#toggle-all")[0];
            this.allCheckbox.checked = !!this.collection.remaining().length;
        },
        
        toggleAll: function () {
            this.collection.toggleAllComplete(this.allCheckbox.checked);
        },

        handleListDisplay: function () {
            var main = $('#main');

            if (this.collection.length) {
                main.show();
            } else {
                main.hide();
            }
        },
        
        addSubscribers: function () {
            Channel('todos:toggleAll').subscribe(this.toggleAll);
            this.collection.on('add remove reset sync', this.handleListDisplay);
        },

        removeSubscribers: function () {
            Channel('todos:toggleAll').unsubscribe(this.toggleAll);
            this.collection.off('add remove reset sync', this.handleListDisplay)
        }

    });

    return ControlsView;
});