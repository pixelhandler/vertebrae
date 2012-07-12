// Welcome Section View
// ------------------

// Package Hello
// Requires define
// Returns {WelcomeSectionView} constructor

// Contrete prototype extends SectionView.prototype (class) to be used in a LayoutView.

define([
        'views',
        'hello/models/welcome',
        'text!hello/templates/welcome.html'
        ], 
function (
        views,
        WelcomeModel,
        welcomeTemplate
        ) {

    var WelcomeSectionView,
        SectionView = views.SectionView;

    WelcomeSectionView = SectionView.extend({

        tagName: 'article',

        className: 'welcome',

        model: WelcomeModel,

        template: welcomeTemplate // "Hello {{name}}!"

    });

    return WelcomeSectionView;
});
