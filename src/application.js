// application.js  
// --------------  
// Requires define
// Return {Object} App

define( ["vendor", "utils", "chrome", "products"], 
function (vendor, utils, chromeBootstrap, productsBootstrap) {

    var App
      , $ = vendor.$
      , _ = vendor._
      , Backbone = vendor.Backbone
      , Channel = utils.lib.Channel
      , debug = utils.debug;

    App = Backbone.Router.extend({

        routes: {
            '': 'defaultRoute',
            'products': 'showProducts',
        },

        initialize: function (options) {
            _.bindAll(this);
            this.addSubscribers();
        },

        defaultRoute: function () {
            this.navigate("products/", {trigger: true});
        },

        showProducts: function () {
            chromeBootstrap();
            productsBootstrap();
        },

        addSubscribers: function () {
            Channel('load:css').subscribe(this.loadCss);
            debug.log("app subscribers added");
        },

        cssLoaded: [],

        loadCss: function (arr) {
            var i 
              , cssUrl;

            if (!_.isArray(arr)) {
                throw new Error("App method addCss expects an array");
            }
            for (i = 0; i < arr.length; i++) {
                cssUrl = arr[i];
                if (_.isString(cssUrl) && ($.inArray(cssUrl, this.cssLoaded) < 0)) {
                    utils.lib.loadCss(cssUrl);
                    this.cssLoaded.push(cssUrl);
                }
            }
        }

    });

    return App;
});

