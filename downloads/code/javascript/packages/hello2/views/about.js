// About '101' Section View
// ------------------

// Package Hello
// Requires define
// Returns {AboutSectionView} constructor

// Contrete prototype extends SectionView.prototype (class) to be used in a LayoutView.

define([
        'views',
        'hello/models/about',
        'text!hello/templates/about.html'
        ], 
function (
        views,
        AboutModel,
        aboutTemplate
        ) {

    var AboutSectionView,
        SectionView = views.SectionView;

    AboutSectionView = SectionView.extend({

        tagName: 'article',

        className: 'about',

        model: AboutModel,

        template: aboutTemplate

    });

    return AboutSectionView;
});
