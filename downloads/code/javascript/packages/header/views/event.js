// event view 
// ----------
// @requires define

define(['jquery', 
        'underscore',
        'backbone', 
        'views/base', 
        'text!packages/header/templates/event.html',
        'mustache',
        'utils/debug'],
function ($, _, Backbone, BaseView, eventTemplate, Mustache, debug) {

    var EventView;

    EventView = BaseView.extend({

        initialize: function () {
            this.template = eventTemplate;
            debug.log('EventView init');
        },
        render: function () {
            var view = this, rendered;

            rendered = Mustache.to_html(view.template, view.model.toJSON());
            $(view.el).html(rendered);
            debug.log('EventView rendered');
            return view;
        }
    });

    return EventView;
});
