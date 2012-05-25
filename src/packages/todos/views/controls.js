// Controls View
// ---------
// Toggle done on entire list

// Package Todos
// Requires `define`
// Returns {ControlsView} constructor

define(['views', 'text!todos/templates/controls.html', 'utils'], 
function(views,   controlsTemplate,                     utils) {

    var ControlsView,
        SectionView = views.SectionView,
        Channel = utils.lib.Channel;

    ControlsView = SectionView.extend({

        template: controlsTemplate,

        initialize: function (options) {
            SectionView.prototype.initialize.call(this, options);
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
            this.collections.toggleAllComplete(this.allCheckbox.checked);
        },
        
        addSubscribers: function () {
            Channel('todos:toggleAll').subscribe(this.toggleAll);
        },

        removeSubscribers: function () {
            Channel('todos:toggleAll').unsubscribe(this.toggleAll);
        }

    });

    return ControlsView;
});