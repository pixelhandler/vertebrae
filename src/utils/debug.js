// debug.js  
// --------  
// debug enabled by single url param like ?debug or perhaps a hash like #!debug

define(function () {

    return {

        mode : function () {
            return ((typeof console !== "undefined" && console !== null) &&
                (window.location.href.slice(window.location.href.indexOf('?') + 1) == "debug"))
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

});
