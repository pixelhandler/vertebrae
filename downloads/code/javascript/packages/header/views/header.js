/**
 * header view 
 * @requires define
 * @return {HL.View} constructor object
 */

define([
        'jquery','underscore',
        'collections',
        'views/base',
        'views',
        'packages/header/views/event',
        'packages/header/models/branding',
        'packages/header/views/branding',
        'packages/header/models/nav',
        'packages/header/views/nav',
        'utils/debug'], 
function ($, _,
        collections,
        BaseView,
        views,
        EventView,
        brandingModel,
        BrandingView,
        navModel,
        NavView,
        debug) {

    // global header view
    var HeaderView; 

    HeaderView = BaseView.extend({
        el: 'header',

        initialize: function (options) {
            var view = this,
                _el = view.el;

            options = options || {};
            view.schedules = options.schedules || ['today','endingSoon'];
            view.types = options.types || ['women','home','kids','beauty','men','all','getaways'];

            view.branding = new BrandingView({ 
                el : _el,
                model : brandingModel 
            });
            view.nav = new NavView({ 
                el : _el,
                model: navModel
            });
            view.iterateSchedulesAndTypes.call(view, view.setupCollectionReference);

            debug.log('HeaderView init');
        },

        render: function () {
            this.branding.render();
            this.nav.render();
            this.iterateSchedulesAndTypes(this.buildCollectionView);
            this.iterateSchedulesAndTypes(this.renderCollectionView);
            debug.log('Header views rendered');
            return this;
        },

        // list of collections, set order of appearance in menu by order in arrays.  
        // the segmented `collections` object has multidimentional array 
        // using properties matching these strings. These properties can be set using
        // the options object as argument durig initialization.
        // TODO function to resort by members type prior to rendering
        schedules: null,
        types: null,

        iterateSchedulesAndTypes: function(callback) {
            var view = this;

            _.each(view.schedules, function (schedule) {
                _.each(view.types, function (type) {
                    callback.apply(view, [schedule, type]);
                });
            });
        },

        setupCollectionReference: function (schedule, type) {
            var view = this;

            if (!view[schedule]) { 
                view[schedule] = {};
            }
            if (!view[schedule][type]) {
                view[schedule][type] = {};
            }
        },

        buildCollectionView: function (schedule, type) {
            var view = this, collection, className = view.setClassName(schedule, type);

            // `collections` object should have properties with event segments
            if (!collections[schedule] || !collections[schedule][type]) {
                throw new Error('buildCollectionView cannot access collection in: collecions.' + schedule + '.' + type);
            }
            view[schedule][type] = new views.CollectionView({
                'collection': collections[schedule][type],
                'view': EventView,
                'tagName': 'li',
                'el': view.$('section.' + className + ' ul'),
                'className': className
            });
            debug.log('created collection: ' + schedule + '-' + type);
        },

        setClassName: function (schedule, type) {
            var className = type.charAt(0).toUpperCase();
            className += type.slice(1);
            className += '-';
            className += schedule;
            return className;
        },

        renderCollectionView: function (schedule, type) {
            var view = this;
            view[schedule][type].render();
            debug.log('rendered collection: ' + schedule + '-' + type);
        }

    });

    return HeaderView;

});
