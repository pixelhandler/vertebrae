/**
 * Shims 
 */

define(function () {

    if (typeof Object.create !== 'function') { // ECMA 5 supports Object.create
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    if ( typeof Object.getPrototypeOf !== "function" ) { 
        if ( typeof "test".__proto__ === "object" ) {
            Object.getPrototypeOf = function(object){
              return object.__proto__;
            };
        } else {
            Object.getPrototypeOf = function(object){
                // May break if the constructor has been tampered with
                return object.constructor.prototype;
            };
        }
    }

    if (!Date.now) {
        Date.now = function now() {
            return +new Date();
        };
    }

    if(!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g,'');
      };
    }

});
