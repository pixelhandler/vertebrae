// chrome package  
// --------------  
// Requires define
// Return {Function} chromeBootstrap

define( ['chrome/views/header'], function (HeaderView) {

    var chromeBootstrap;

    chromeBootstrap = function () {
        var header = new HeaderView();
        header.render().$el.preprendTo('body');
    };

    return chromeBootstrap;
});

