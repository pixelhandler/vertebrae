// debug.js
// --------

define(['jquery'], function ($) {

    var debug, append;

    debug = {
        
        // debug enabled by single url param like ?debug
        mode : function () {
            return (typeof console !== "undefined" && console !== null);
                // (window.location.href.slice(window.location.href.indexOf('?') + 1) == "debug"));
                // (window.location.hash.match(/!debug/) == "!debug")) 
        },

        msgs : [],

        log: function (msg) {
            var active = this.mode();
            if (active) { 
                this.msgs.push(msg);
                console.log(msg);
            }
        }
    };

    append = {

        // debug by logging directy to page, e.g. a mobile phone with no console.
        mode: function () {
            $('body').append('<div id="console"/>');
            return true;
        },

        msgs: [],

        log: function (msg) {
            var active = this.mode();
            if (active) { 
                this.msgs.push(msg);
                $('#console').append('<p>'+ msg +'</p>');
            }
        }
    };

    return debug;
});
