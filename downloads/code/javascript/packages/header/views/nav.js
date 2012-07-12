// header nav view 
// ---------------
// @requires define
// @return {NavView} view constructor object

define(['jquery','underscore','views/base','text!packages/header/templates/nav.html','mustache','utils/debug'], 
function ($,      _,           BaseView,    navTemplate,                              Mustache,  debug) {

    // global header view
    var NavView;

    NavView = BaseView.extend({

        initialize: function () {
            debug.log("navView init");
            this.template = navTemplate;
            NavView.__super__.initialize.call(this, arguments);
        },

        render: function () {
            // ...
        },

    });

    return NavView;

});