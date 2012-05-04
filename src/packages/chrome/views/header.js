// header.js  
// -------  
// Requires `define`
// Return {HeaderView} object as constructor

define([
        'vendor', 
        'views',
        'text!chrome/templates/header.html',
        'chrome/models/header'
        ], 
function (
        vendor,
        views,
        headerTemplate,
        HeaderModel
        ) {

    var HeaderView,
        BaseView = views.BaseView,
        $ = vendor.$,
        Mustache = vendor.Mustache;

      HeaderView = BaseView.extend({

          tagName: 'header',

          className: 'container-fluid',

          initialize: function (options) {
              this.template = headerTemplate;
          },

          model: new HeaderModel(),

          render: function () {
              var markup = Mustache.to_html(this.template, this.model.toJSON());
              this.$el.html(markup);
              return this;
          }

      });

    return HeaderView;
});