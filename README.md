# Vertebrae front-end framework built with Backbone.js and RequireJS using AMD

**Vertebrae** provides *AMD* structure and additional objects for extending *Backbone.js* as an application framework.

* About the project: [www.hautelooktech.com - Vertebrae post](http://www.hautelooktech.com/2012/05/24/vertebrae-front-end-framework-built-with-backbone-js-and-requirejs-using-amd/ "Vertebrae background")  
* The code for the demo app is in the todos package, for file structure
see: [www.hautelooktech.com - JavaSript application using packages](http://www.hautelooktech.com/2012/02/01/optimize-and-build-a-backbone-js-javascript-application-with-require-js-using-packages/ "Organize code in packages")
* Todos app / demo hosted on [Heroku](https://devcenter.heroku.com/articles/nodejs) at: <http://vertebrae-framework.herokuapp.com/> | optimized and built at: <http://vertebrae-optimized.herokuapp.com/>
  * Todos controller code: <https://github.com/hautelook/vertebrae/blob/master/src/packages/todos.js>
  * Todos package code: <https://github.com/hautelook/vertebrae/tree/master/src/packages/todos>
  * Links to see other sample packages in the framework:  
    * Products package at : <http://vertebrae-framework.herokuapp.com/products> (renders a list from mocked API)  
    * `hello` package at :
   <http://vertebrae-framework.herokuapp.com/hello/yourName>  
      * Replace the `yourName` parameter, e.g. 'joe': <http://vertebrae-framework.herokuapp.com/hello/joe>

## Project / Goals

*The project goals included*... dynamic script loading, AMD module format, dependency management, build with mostly open source libraries, organize code in packages, optimize and build for one or many single page apps, host on fully cached server, e.g. no server-side scripting using only an API for data, and the funnest for me, use behaviour driven development for the project. There is a description on the project at : [www.hautelooktech.com - Vertebrae post](http://www.hautelooktech.com/2012/05/24/vertebrae-front-end-framework-built-with-backbone-js-and-requirejs-using-amd/ "Vertebrae background")

**The Problem:**

Selected libraries for the framework (jQuery, Underscore.js, Backbone.js, RequireJS, Mustache) provide module loading, dependency management, application structure (for models, collections, views and routes), asynchronous interactions with API, various utilities and objects to manage asynchronous behaviors, e.g. (Promises) Deferreds, Callbacks. The remaining logic needed to complete the framework includes:

- An object (model) to manage state of the single-page application;
- A layout manager to present, arrange/transition and clear views, and
- Controllers which respond to routes, get/set application state, and hand off work to layout manager.

**Our Solutions** (implemented in Vertebrae):

*Application State Manager* -

The application manager stores data in memory and also persists data in browser storage to provide a resource for common data/metadata. Also provides data (state) to reconstruct the page views based on previous interactions (e.g. selected tab, applied filters). The application state manager provides a strategy for resources to retrieve state. Meant to act as a state machine.

*Layout Manager* -

The layout manager has one or many views as well as document (DOM) destinations for each (rendered) view. A page may transition between many views, so the layout manager keeps track of view states, e.g. rendered, not-rendered, displayed, not-displayed. You may use the layout manager to lazy load and render (detached) views that a site visitor is very likely to request, e.g. tab changes on a page. The transition between view states is managed by this object. An entire layout may be cleared so that view objects and their bindings are removed, preparing these objects for garbage collection (preventing memory leaks). The layout manager also communicates view state with controller(s).

*Controller* -

A controller object is called by a route handler function, and is responsible for getting relevant state (application models) to generate a page (layout), (also responsible for setting state when routes change). The controller passes dependent data (models/collections) and constructed view objects for a requested page to the layout manager. As a side-effect the use of controllers prevents the routes object from becoming bloated and tangled. A route should map to a controller which then kicks off the page view, keeping the route handling functions lean.

The Todos app is hosted both in dev mode and optimized on Heroku... 

- <http://vertebrae-framework.herokuapp.com/>
- <http://vertebrae-optimized.herokuapp.com/>

Many of the concepts in the frameworks are borrowed, e.g. the need to destroy views to prevent memory leaks, as pointed out by Derick Bailey - <http://lostechies.com/derickbailey/> ; the Layout Manager by Tim Branyen <http://tbranyen.github.com/backbone.layoutmanager/>

Backbone.js is meant to be a tool in an application; the Backbone.js library does not provide the architecture needed to build a complete application, however does provide great interactions with an API and solid code structure for... *Views* (which act like controllers too), *Models* and *Collections* (the data layer), and finally* Routes*. We built the Vertebrae framework to meat the goals of our project, and decided to extract the code as a framework for others to use, learn, or whatever. 

## Build and optimize using:

    r.js -o build.js

## To launch (Node.js) server

    node app.js

Based on the setting in [app.js](https://github.com/hautelook/vertebrae/blob/master/app.js) the server runs from either the `src` or `public` directory at : http://localhost:4242/  

    docroot = path.join(application_root, "src"), // "src" for dev, or "public" for built version

The [build.js](https://github.com/hautelook/vertebrae/blob/master/build.js) file is configured to build to the "public" directory. 

So after you run `r.js -o build.js` to populate the "public" directory then you can use `node app.js` to view the site at : http://localhost:4242

## Testing Framework using Jasmine, Sinon, Jasmine-jQuery

* Tests run in browser / console at : <http://vertebrae-framework.herokuapp.com/test/>  
* Source code: <https://github.com/hautelook/vertebrae/tree/master/src/test>  
* Run tests on command line using [phantomjs](http://phantomjs.org/)  
  * From Heroku env: `phantomjs /usr/local/lib/run-jasmine.js http://vertebrae-framework.herokuapp.com/test/`  
  * From localhost server running via Node.js `node app.js`:  `phantomjs /usr/local/lib/run-jasmine.js http://localhost:4242/test/`  
* phantomjs wiki, test framework integration: <http://code.google.com/p/phantomjs/wiki/TestFrameworkIntegration>  
* phantomjs wiki: <http://code.google.com/p/phantomjs/wiki/PhantomJS?tm=6>  

## Views: 

**`BaseView`, `CollectionView`, `SectionView`, `LayoutView` (Manages Sections)**

### Base View

A view object to construct a standard view with common properties and utilties
The base view extends Backbone.View adding methods for resolving deferreds, 
rendering, decorating data just in time for rendering, adding child views to 
form a composite of views under one view object, add a destroy method.

### Collection View

Manages rendering many views with a collection 

The CollectionView extends BaseView and is intended for rendering a collection.
A item view is required for rendering withing each iteration over the models. 
See: <http://liquidmedia.ca/blog/2011/02/lib-js-part-3/>

### Section View States

Mixin object to track view's state 'not-rendered', 'rendered', 'not-displayed', 'displayed'

A section view is the required view object for a layout view which expects
views to track their own state. This view may be extended as need. to use
in a layout, perhaps adding the Section prototype properties to another view.

### Layout Manager View

Presents, arranges, transitions and clears views

The layout manager has one or many views as well as document (DOM) 
destinations for each (rendered) view. A page may transition between 
many views, so the layout manager keeps track of view states, e.g. 
'not-rendered', 'rendered', 'not-displayed', 'displayed'. 

The layout manager can be utilized to lazy load and render (detached) views. 
that a site visitor is very likely to request, e.g. tab changes on a page. 
The transition between view states is managed by this object. 
An entire layout may be cleared so that view objects and their bindings 
are removed, preparing these objects for garbage collection (preventing 
memory leaks). The layout manager also communicates view state 
with controller(s).


## Models: 

**`BaseModel`, `ApplicationState`**

### Application state model

A model object to manage state within the single-page application Attributes: {String} `name`, {Object} `data`, {String} `storage`, {Date} `expires`


## Collections: 

**`BaseCollection`, `ApplicationStates`**

### Application state collection

A collection object to reference various states in the application.

The application manager stores data in memory and also persists data in 
browser storage to provide a resource for common data/metadata. Also provides 
data (state) to reconstruct the page views based on previous interactions 
(e.g. selected tab, applied filters). The application state manager provides 
a strategy for resources to retrieve state.

## Syncs: 

**syncFactory, application-state, storageFactory**


## Utils: 

**ajax-options, docCookies, debug, storage, shims, lib [checkType, duckTypeCheck, Channel (pub/sub), loadCss, formatCase, formatMoney]**


## Controller

A controller object should called withing a route handler function, and may 
be responsible for getting relevant state (application models) to generate 
a page (layout), (also responsible for setting state when routes change). 
The controller passes dependent data (models/collections) and constructed 
view objects for a requested page to the layout manager. As a side-effect 
the use of controllers prevents the routes object from becoming bloated and 
tangled. A route should map to a controller which then kicks off the page 
view, keeping the route handling functions lean.


## Facade 

Vendor libraries and specific methods used in the framework are required in the facade, and referenced from the facade module in the views, models, collections, lib and other objects in the framework.


## AMD - Asynchronous Module Definition 

Using RequireJS script loader and AMD there are a couple options for managing dependencies:

The the examples below the facade module has it's own dependencies for loading vendor libraries and maps them to an object. So vendor libraries Should only be required using the facade module which provides references to the libraries.

    define(['facade','utils'], function (facade, utils) {

        var ModuleName,
            // References to objects nested in dependencies
            Backbone = facade.Backbone,
            $ = facade.$,
            _ = facade._,
            lib = utils.lib;

        ModuleName = DO SOMETHING HERE

        return ModuleName;
    });


    define(['require','facade','utils'], function (require) {

        var ModuleName,
            // Dependencies
            facade = require('facade'),
            utils = require('utils'),
            // References to objects nested in dependencies
            Backbone = facade.Backbone,
            $ = facade.$,
            _ = facade._,
            lib = utils.lib;

        ModuleName = DO SOMETHING HERE

        return ModuleName;
    });


References:  
  * [AMD spec](https://github.com/amdjs/amdjs-api/wiki/AMD "AMD spec")
  * [RequireJS why AMD](http://requirejs.org/docs/whyamd.html "RequireJS why AMD")
  * [RequireJS AMD](http://requirejs.org/docs/whyamd.html#amd "RequireJS AMD")

## Code examples included in framework: application.js

The application.js has a few routes defined which handle a couple example code packages: `products` and `hello`. the `chrome` package has the [Twitter bootstrap](http://twitter.github.com/bootstrap/ "Twitter bootstrap")  markup for rendering header component on the page.

    App = Backbone.Router.extend({

        routes: {
            '': 'defaultRoute',
            'products': 'showProducts',
            'hello': 'showHello',
            'hello/': 'showHello',
            'hello/:name': 'showHello'
        },

The default route above links to the products route handler loading a list of products on the default page.




## Hello World *example* using a the Layout Manager (View)

Routes in the hello package 

    /hello  
    /hello/:name  

without the name parameter only one the 'about' view is rendered in the layout; with the parameter e.g. /hello/bill two views are rendered in the layout a 'welcome' and an 'about' view

### Part 1: *welcome* section

Using a Layout view involves: adding a route, route handler function in App, new "hello" package with a template and view. The package controller file *hello.js* extends the Controller.prototype and is based on a (template) copy of the Controller.prototype in *src/controller.js*. The WelcomeSectionView prototype extends the SectionView prototype (class) and requries both **name** and **destination** properties when instantiated. The *application.js* method 'showHello' is mapped to the route '/hello/:name' and the showHello method instantiates a controller object 

Files edited in the application:

    src/application.js  
    src/main.js  

Files added as a new package:

    src/packages/hello.js  [returns: HelloController]  
    src/packages/hello/models/welcome.js  
    src/packages/hello/templates/layout.html  [HTML used by layout, has section element]  
    src/packages/hello/templates/welcome.html  
    src/packages/hello/views/welcome.js  [returns: WelcomeSectionView, with article element] 
    src/packages/hello/welcome.css

#### New Route added in src/application.js 

```javascript
    'hello/:name': 'showHello'
```

#### New Package added in src/main.js

```javascript
    // ** Packages **
    'hello'        : HL.prependBuild('/packages/hello'),
```

#### Add dependency to application.js 

```javascript
define([ /*... ,*/ "hello" ], function ( /*... ,*/ HelloController ) {  
    // BTW this is the AMD module format with "hello" file as dependecy  
});
```

#### Add Method for new '/hello/:name' route handler

```javascript
    showHello: function (name) {  
        controller = new HelloController({  
            "params": { "name": name },  
            "route": "/hello/" + name,  
            "appStates" : this.states
        });
    },
```

The parameters hash is added as an option above for the controller object to deal with.

### Code to add in your `hello` package for a *welcome* section:

[src/packages/hello/templates/layout.html](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/templates/layout.html)  
[src/packages/hello.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello.js)  
[src/packages/hello/views/welcome.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/views/welcome.js)  
[src/packages/hello/templates/welcome.html](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/templates/welcome.html)  
[src/packages/hello/views/welcome.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/views/welcome.js)  
[src/packages/hello/welcome.css](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/welcome.css)  

### Part 2: Use JSON data for new *about* section

#### To get the 'about' section data a fixture (JSON file) was added in the test directory.

[src/test/fixtures/hello/101](https://github.com/hautelook/vertebrae/blob/master/src/test/fixtures/hello/101):

```javascript
{
    "_links": {
        "self": "/test/fixtures/hello/101",
        "shop": "http://www.hautelook.com/"
    },
    "title": "About HauteLook",
    "content": "Welcome to HauteLook, where you will discover thousands of the top fashion and lifestyle brands at amazing savings. Each day at 8 AM Pacific, shop new sale events featuring the best names in women's and men's fashion and accessories, beauty, kids' apparel and toys, and home décor at up to 75% off. Membership is free and everyone is welcome!",
    "callToAction": "To start shopping, go to: <a href=\"www.hautelook.com\">www.hautelook.com</a>"
}
```

The above object is added as a server response in the Node.js [app.js](https://github.com/hautelook/vertebrae/blob/master/app.js) as well, so you can simulate using an api for data. 


#### application.js updated with...

```javascript
    routes: {
        'hello': 'showHello',
        'hello/': 'showHello',
        'hello/:name': 'showHello'
    },
```

```javascript
    showHello: function (name) {
        controller = new HelloController({
            "params": { "name": name },
            "route": (name) ? "/hello/" + name : "/hello",
            "appStates" : this.states,
            "useFixtures" : true
        });
    },
```

#### Files added for a *about* section:

See the source code in the files below for how the new "About" section view is added to the layout (in addition to the simple hello *name* view created by the welcome view)...

[src/packages/hello/templates/about.html](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/templates/about.html)  
[src/packages/hello/views/about.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/views/about.js)  
[src/packages/hello/models/about.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/views/about.js)  

#### Files changed to support the additional section:

Some files should have changed when working with the *Hello World Part 2* example, and others need to be added for the *about* section...

[src/packages/hello.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello.js)  
[src/packages/hello/templates/layout.html](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/templates/layout.html)  
[src/packages/hello/templates/welcome.html](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/templates/welcome.html)  
[src/packages/hello/views/welcome.js](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/views/welcome.js)  
[src/packages/hello/welcome.css](https://github.com/hautelook/vertebrae/blob/master/src/packages/hello/welcome.css)


## Documentation:

Using docco annotated source code documentation is found in these directories:

    /docs/
    /models/docs/
    /collections/docs/
    /syncs/docs/
    /utils/docs/
    /views/docs/

View docs at:  

http://localhost:4242/docs/  
http://localhost:4242/models/docs/  
http://localhost:4242/collections/docs/  
http://localhost:4242/syncs/docs/  
http://localhost:4242/utils/docs/  
http://localhost:4242/views/docs/

Or, view docs on the demo site hosted on heroku at:  

<http://vertebrae-framework.herokuapp.com/docs/>  
<http://vertebrae-framework.herokuapp.com/models/docs/>  
<http://vertebrae-framework.herokuapp.com/collections/docs/>  
<http://vertebrae-framework.herokuapp.com/syncs/docs/>  
<http://vertebrae-framework.herokuapp.com/utils/docs/>  
<http://vertebrae-framework.herokuapp.com/views/docs/>

To generate the docs:

* Docco uses Pygments install using `sudo easy_install pygments`
* Install docco `npm install docco`

    cd src/
    docco application.js facade.js controller.js

    cd models  
    docco *.js  
    cd ../collections  
    docco *.js  
    cd ../syncs  
    docco *.js  
    cd ../utils  
    docco *.js  
    cd ../views  
    docco *.js
    cd ../  
    rm docs/docco.css collections/docs/docco.css models/docs/docco.css syncs/docs/docco.css utils/docs/docco.css views/docs/docco.css  

References:  
  * [Docco Annotated Source](http://jashkenas.github.com/docco/ "Docco Annotated Source")
  * [Docco Source Code](https://github.com/jashkenas/docco "Docco Source Code")
