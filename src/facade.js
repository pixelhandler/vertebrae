// Facade
// ------
// Requires define
// Returns {object} references to vendor / library methods

define(['vendor'/*, 'order!touch'*/], function (vendor) { 

    var facade = {},
        domLib,
        // vendor should have either jQuery or Zepto, so one of these two should be undefined below.
        jQuery = vendor.jQuery || window.jQuery,
        Zepto = vendor.Zepto || window.Zepto,
        _ = vendor._,
        Mustache = vendor.Mustache || window.Mustache,
        Backbone = vendor.Backbone;

    domLib = jQuery || Zepto;

    if (!jQuery && Zepto) {
        require(['vendor/plugins/type'], function() {
            domLib.type = $.type;
            require(['vendor/plugins/callbacks'], function() {
                domLib.Callbacks = $.Callbacks;
                require(['vendor/plugins/deferred'], function() {
                    domLib.Deferred = $.Deferred;
                });
            });
        });
    }

    if (domLib) {
        facade.type = domLib.type;
        facade.inArray = domLib.inArray;
        facade.Callbacks = domLib.Callbacks;
        facade.Deferred = domLib.Deferred;
    }

    facade.toHTML = Mustache.to_html;
    facade.$ = domLib;
    facade._ = _;
    facade.Backbone = Backbone;

    return facade;
});
