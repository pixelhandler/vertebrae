// Iterator Collection
// ---------------
// Iterator methods added to collection object are `previous`, `next` and (get/set) `selected`

// Requires `define`  
// Return {IteratorCollection} object as constructor

define(['require','collections/base','facade','utils'], function (require) {

    var IteratorCollection,
        // Dependencies
        BaseCollection = require('collections/base'),
        facade = require('facade'),
        utils = require('utils'),
        // References to objects nested in dependencies
        Backbone = facade.Backbone,
        $ = facade.$,
        _ = facade._,
        lib = utils.lib,
        debug = utils.debug;

    // Constructor `{IteratorCollection}` extends BaseCollection.prototype
    // object literal argument to extend is the prototype for the IteratorCollection constructor
    IteratorCollection = BaseCollection.extend({

        // initialize: function (models, options) {
        //     this._activeModel = 0;
        //     BaseCollection.prototype.initialize.call(this, arguments);
        // },

        // Private Properties
        //-------------------

        _activeModel: null,

        // Private Methods
        //----------------

        // **Method:** `_setActive`
        // Param {Number} stepVal - positive or negative steps to iterate, 1/-1
        // Returns {Model} reveal - the model stepped to
        _setActive: function (stepVal) {
            var reveal = 0,
                sum;

            if (stepVal && _.isNumber(stepVal)) {
                if (stepVal !== reveal) {
                    sum = this._activeModel + stepVal;
                    if (sum < 0) {
                        reveal = this.length + sum;
                    } else if (sum < this.length) {
                        reveal = sum ;
                    } else {
                        reveal = sum - this.length ;
                    }
                } else {
                    reveal = this._activeModel;
                }
            }
            this._activeModel = reveal;

            return reveal;
        },

        // Public Methods
        //---------------

        // **Method:** `initialize`  
        // Param {Object} `models` - added during call to new BaseCollection([/*models*/])  
        // Param {Object} `options` - add a comparator
        initialize: function (models, options) {
            this._activeModel = 0;
            BaseCollection.prototype.initialize.call(this, arguments);
        },

        // **Method:** `previous` - steps (back) -1 in the collection
        previous: function () {
            this._activeModel = this._setActive(-1);
        },

        // **Method:** `next` - steps (forward) +1 in the collection
        next: function () {
            this._activeModel = this._setActive(1);
        },

        // **Method:** `selected` - Get/set selected item in collection
        selected: function (setVal) {
            var num;
            if (_.isNumber(setVal)) {
                num = parseInt(setVal, 10);
                if (num >= 0 && num < this.length) {
                    this._activeModel = num;
                }
            }
            return this._activeModel;
        },

        // **Method:** `toJSON` - wraps BaseCollection.prototype.toJSON call
        // Decorates the active model with an `active` property as `true`  
        // Returns JavaScript Object ready for JSON stringification
        toJSON: function () {
            var json = BaseCollection.prototype.toJSON.call(this);

            // Decorate data with { active : true } data based on index stored on _activeModel
            json[this._activeModel].active = true;
            // Decorate data with idx property as the index value
            _.each(json, function (element, index, list) {
                list[index].idx = index;
            });

            return json;
        }

    });

    return IteratorCollection;
});