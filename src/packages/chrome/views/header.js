// header.js  
// -------  
// Requires `define`
// Return {HeaderView} object as constructor

define([
        'vendor', 
        'views',
        'text!chrome/templates/header.html',
        'chrome/views/header'
        ], 
function (
        vendor,
        views,
        HeaderModel,
        headerTemplate
        ) {

    var HeaderView
      , BaseView = views.BaseView
      , $ = vendor.$;

      HeaderView = BaseView.extend({

          initialize: function (options) {
              this.template: headerTemplate;
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