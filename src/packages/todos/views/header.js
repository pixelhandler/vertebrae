// Header View
// ---------
// (chrome) header with form to create todos

// Package Todos
// Requires `define`, `require`
// Returns {HeaderView} constructor

define([
        'require', 
        'text!todos/templates/header.html', 
        'todos/models/header',
        'todos/views/form',
        'facade', 
        'views'
        ], 
function(require, headerTemplate) {

    var HeaderView,
        facade = require('facade'),
        views = require('views'),
        HeaderModel = require('todos/models/header'),
        FormView = require('todos/views/form'),
        SectionView = views.SectionView,
        _ = facade._;

    HeaderView = SectionView.extend({

        id: 'branding',

        template: headerTemplate,

        initialize: function (options) {
            SectionView.prototype.initialize.call(this, options);
            this.setupFormView();
        },
        
        // **Method** `setOptions` - called by BaseView's initialize method
        setOptions: function (options) {
            if (!this.collection) {
                throw new Error("HeaderView expects option with collection property.");
            }
            if (!this.model) {
                this.model = new HeaderModel();
            }
        },
        
        // Child views...
        childViews: {},

        setupFormView: function () {
            var headerView = this,
                formView = new FormView({collection: this.collection}),
                renderFormView = this.addChildView(formView);

            this.childViews.form = formView;
            this.callbacks.add(function () {
                renderFormView();
                headerView.$('#create-todo').html(formView.el);
            });
        }

    });

    return HeaderView;
});