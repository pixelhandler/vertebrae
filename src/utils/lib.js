// lib.js
// -----------------------------------
// decorate Base objects with common methods
// Return {Object} lib instance

define(["facade", "utils/debug"], function(facade, debug) {

    // **Constructor** `Lib`
    var Lib = function () {},
        $ = facade.$,
        _ = facade._,
        Backbone = facade.Backbone,
        inArray = facade.inArray,
        Callbacks = facade.Callbacks,
        channels = {};

    // Helper to check object's types, requires facade.type  
    // Param {Object} `given`  
    // Param {Object} `known`
    function checkType(given, known) {
        var truthyCheck = true;

        $.each(_.keys(known), function(key,val) {
            var needle = known, needleType, haystack = given, haystackType;

            needleType = facade.type(needle[val]);
            haystackType = facade.type(haystack[val]);
            if (needleType !== haystackType) {
                truthyCheck = false;
                debug.log("checkType: " + val + " is [" + haystackType + "] not expected [" + needleType + "] type.");
                return false;
            }
        });
        return truthyCheck;
    }

    // **Method:** `duckTypeCheck`  
    // Compare given object (as argument) with know (defaults) object
    // If it walks like a duck, must be a type of duck
    // Keys of the two arguments are compared by intersection  
    // Returns true if all the known key names are found in the given object
    // Param {Object} `given` the object you would like to test its interface (haystack)  
    // Param {Object} `known` the object (needles to find in the haystack)  
    // Return {Boolean} do the two objects have same properties,
    Lib.prototype.duckTypeCheck = function (given, known) {
        var hasSameProperties = false, keysGiven, keysKnown;

        if (!_.isUndefined(given) && !_.isUndefined(known)) {
            debug.log("duckTypeCheck...");
            keysGiven = _.keys(given); 
            debug.log("given: " + keysGiven.toString());
            keysKnown = _.keys(known);
            debug.log("known: " + keysKnown.toString());
            if (_.intersection(keysGiven, keysKnown).length >= keysKnown.length) {
                hasSameProperties = true;
                if (hasSameProperties && facade.type) {
                    hasSameProperties = checkType(given, known);
                }
                if (hasSameProperties) {
                    debug.log("it walks like a duck, must be a type of duck");
                }
            }
        }
        return hasSameProperties;
    };


    // Property topic 
    // - to subscribe use: object.topic.bind("event:namespace", callback, [context])
    // - to unsubscribe use: object.topic.unbind([event], [callback])
    // - to publish use: object.topic.trigger(event, [*args]) 
    Lib.prototype.topic = _.extend({}, Backbone.Events);

    // **Method:** `Channel` - Pub/Sub using jQuery Callbacks object  
    // See <http://api.jquery.com/jQuery.Callbacks/>  
    // Param {String} `id` - topic (channel) name for callbacks list  
    // Param {String} `flags` - set behavior of callbacks object,
    // - options are 'once', 'memory', 'unique', 'stopOnFalse', or 'nomemory'
    // - default option is 'memory'
    Lib.prototype.Channel = function(id, flags) {
        var callbacks, method, topic = id && channels[id], msg,
            allowedFlags = ['once', 'memory', 'unique', 'stopOnFalse'], flagsOk;

        if (!topic) {
            if (flags && typeof flags === 'string') {
                flag = flags.split(' ');
                $.each(flag, function () {
                    if (!inArray(this, allowedFlags)) {
                        flagsOk = false;
                        return flagsOk;
                    }
                });
                if (flags === 'nomemory') {
                    callbacks = Callbacks();
                } else if (flagsOk) {
                    callbacks = Callbacks(flags);
                } else {
                    msg = "Channel options expeced one or more of the following strings: ";
                    msg += "'once', 'memory', 'unique', 'stopOnFalse'";
                    throw new Error(msg);
                }
            } else {
                callbacks = Callbacks('memory');
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

    // **Method:** `loadCss`  
    // Param {String} `url` - "/packages/events/events.css"
    // or Param {Object} like { rel: 'stylesheet/less', href: "/packages/events/events.less" }

    Lib.prototype.loadCss = function (url) {
        var link = document.createElement("link");

        if (!( (_.isObject(url) && url.href) || _.isString(url) )) {
            throw new Error("loadCss expects a url string or object (with href property) as an argument.");
        } else {
            link.rel = url.rel || "stylesheet";
            link.href = url.href || url;
            link.type = url.type || "text/css";
            link.media = url.media || "screen";
            link.charset = "utf-8";
            if (url.title) {
                link.title = url.title;
            }
        }
        debug.log("loadCss url: " + url.href || url);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    // Formats a string to all lower, all upper or camelCase based on phrase (separated using a space)
    // e.g. formatCase("Red Hot", "lower") => 'red-hot'
    //      formatCase("Red Hot", "upper") => 'RED-HOT'
    //      formatCase("Red Hot", "camel") => 'redHot'
    Lib.prototype.formatCase = function (name, format) {
        switch (format) {
        case 'upper':
            name = name.toUpperCase().replace(/\s/g, '-');
            break;
        case 'lower':
            name = name.toLowerCase().replace(/\s/g, '-');
            break;
        case 'camel':
            name = name.split(' ');
            for (var i = 0; i < name.length; i++) {
                if (i > 0) {
                    name[i] = name[i].toLowerCase().charAt(0).toUpperCase() + name[i].toLowerCase().substr(1);
                } else {
                    name[i] = name[i].toLowerCase();
                }
            };
            name = name.join('');
            break;
        default:
            break;
        }
        return name;
    };

    // Method to format currency
    // http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
    // use like : formatMoney(123456789.12345, 2, '.', ',') 
    // or if you add this method to an object's prototype: (123456789.12345).formatMoney(2, '.', ',');
    Lib.prototype.formatMoney = function(number, decimals, decimal_sep, thousands_sep) { 
       var formatted = [], 
           n = number || this,
           // If decimal is zero we must take it, it means user does not want to show any decimal
           c = isNaN(decimals) ? 2 : Math.abs(decimals), 
           // If no decimal separetor is passed we use the comma as default decimal separator 
           // (we MUST use a decimal separator)
           d = decimal_sep || '.', 
           // If you don't want ot use a thousands separator you can pass empty string as thousands_sep value
           t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, 
           sign = (n < 0) ? '-' : '',
           // Extracting the absolute value of the integer part of the number and converting to string
           i = parseInt(n = Math.abs(n).toFixed(c), 10) + '', 
           j = ((j = i.length) > 3) ? j % 3 : 0; 

       formatted.push(sign);
       formatted.push(j ? i.substr(0, j) + t : '');
       formatted.push(i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t));
       formatted.push(c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');

       return formatted.join('');
    };

    return new Lib();
});
