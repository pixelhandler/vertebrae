// lib.js
// -----------------------------------
// decorate Base objects with common methods
// Return {Object} lib instance

define(["jquery", "underscore", "utils/debug"], function($, _, debug) {

    // Constructor Lib
    var Lib = function () {}
      , channels = {};

    // Pub/Sub using jQuery Callbacks object
    // interface methods: publish subscribe unsubscribe disable 
    // use like: 
    //  - Channel('package:topic').subscribe(fn, flags)
    //  - Channel('package:topic').publish(args), 
    Lib.prototype.Channel = function(id, flags) {
        var callbacks, method, topic = id && channels[id]
          , allowedFlags = ['once', 'memory', 'unique', 'stopOnFalse'], flagsOk;

        if (!topic) {
            if (flags && typeof flags === 'string') {
                flag = flags.split(' ');
                $.each(flag, function () {
                    if (!$.inArray(this, allowedFlags)) {
                        flagsOk = false;
                        return flagsOk;
                    }
                });
                if (flags === 'nomemory') {
                    callbacks = jQuery.Callbacks();
                } else if (flagsOk) {
                    callbacks = jQuery.Callbacks(flags);
                } else {
                    throw new Error("Channel options expeced one or more of the following strings: "
                        + "'once', 'memory', 'unique', 'stopOnFalse'");
                }
            } else {
                callbacks = jQuery.Callbacks('memory');
            }
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove,
                disable: callbacks.disable
            };
            if (id) {
                channels[id] = topic;
            }
        }
        return topic;
    };

    // Method to load CSS
    Lib.prototype.loadCss = function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        debug.log("added css file: " + url);
    };

    return new Lib();
});
