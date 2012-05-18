// debug.js
// --------
// Wrapper for console to log messages without throwing errors,
// It's safe to leave debug.log calls in code.
// Also as a debugging tool the output can be put onto the dom

// Return {Object} `debug` for normal behavior or append during development

define(['jquery'], function ($) {

    var debug, append;

    debug = {

        // debug enabled by single url param like ?debug
        mode : function () {
            return (typeof console !== "undefined" && console !== null);
                // (window.location.href.slice(window.location.href.indexOf('?') + 1) == "debug"));
                // (window.location.hash.match(/!debug/) == "!debug")) 
        },

        // msgs : [],
        log: function (msg) {
            var active = this.mode();
            if (active) { 
                // this.msgs.push(msg);
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
