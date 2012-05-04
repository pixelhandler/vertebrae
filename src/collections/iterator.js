// Iterator Collection
// ---------------

// Requires `define`  
// Return {IteratorCollection} object as constructor
// Iterator methods added to collection object are `previous`, `next` and (get/set) `selected`

define(['require','collections/base','facade','utils'], function (require) {

    var IteratorCollection
      // Dependencies
      , BaseCollection = require('collections/base')
      , facade = require('facade')
      , utils = require('utils')
      // References to objects nested in dependencies
      , Backbone = facade.Backbone
      , $ = facade.$
      , _ = facade._
      , lib = utils.lib
      , debug = utils.debug;

    IteratorCollection = BaseCollection.extend({

        initialize: function (models, options) {
            this._activeModel = 0;
            BaseCollection.prototype.initialize.call(this, arguments);
        },

        // Private methods

        _activeModel: null,

        _setActive: function (stepVal) {
            var reveal = 0
              , sum;

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

        // Public methods

        previous: function () {
            this._activeModel = this._setActive(-1);
        },

        next: function () {
            this._activeModel = this._setActive(1);
        },

        // Get/set selected item in collection
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