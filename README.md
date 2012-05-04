# Build and optimize using:

> r.js -o build.js

## to launch server

> node app.js

runs at : http://localhost:4242/

The app.js is the node.js script that runs the server and expects the "public" directory to have the application. 

The build.js should be configured to build to the "public" directory. 

So after you run `r.js -o build.js` to populate the "public" directory then you can use `node app.js` to view the site at : http://localhost:4242

# Overview of Hello World "Layout"

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

## New Route added in src/application.js 

```javascript
    'hello/:name': 'showHello'
```

## New Package added in src/main.js

```javascript
    // ** Packages **
    'hello'        : HL.prependBuild('/packages/hello'),
```

## Add dependency to application.js 

```javascript
define([ /*... ,*/ "hello" ], function ( /*... ,*/ HelloController ) {  
    // BTW this is the AMD module format with "hello" file as dependecy  
});
```

## Add Method for new '/hello/:name' route handler

```javascript
    showHello: function (name) {  
        controller = new HelloController({  
            "params": { "name": name },  
            "route": "/hello" + name,  
            "appStates" : this.states
        });
    },
```

The parameters hash is added as an option above for the controller object to deal with.

src/packages/hello/templates/layout.html  
src/packages/hello.js  
src/packages/hello/models/welcome.js  
src/packages/hello/templates/welcome.html  
src/packages/hello/views/welcome.js  
src/packages/hello/welcome.css  


## Part 2: Get JSON data for content using AJAX

### To get the 'About' section data a fixture (JSON file) was added in the test directory.

src/test/fixtures/hello/101:

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

### application.js updated with...

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
            "route": (name) ? "/hello" + name : "/hello",
            "appStates" : this.states,
            "useFixtures" : true
        });
    },
```

### Some files have changed...

    src/packages/hello.js  
    src/packages/hello/models/about.js  
    src/packages/hello/templates/about.html  
    src/packages/hello/templates/layout.html  
    src/packages/hello/templates/welcome.html  
    src/packages/hello/views/about.js  
    src/packages/hello/views/welcome.js  
    src/packages/hello/welcome.css

See the source code below and see how the new "About" section view is added in addition to the simple hello *name* view created by the welcome view.
