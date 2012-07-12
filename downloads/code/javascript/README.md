# Build and optimize using node and r.js script - release.js

**release.js** is a shell script that executes with node.js.

  1. Edits build version number in main.js, build.js, and index.html
  2. Updates releases.txt and last_releases.txt with lists of builds
  3. Builds / optimizes with r.js script into a new directory with build name
  4. Has options for 'rollback', setting the build name, and using an alternate path for the r.js script
  5. Restores the main.js, build.js for development use

**Requirements**  
  * Software: node.js and the package (npm) 'requirejs'
  * Files: 
    * releases.txt and last_releases.txt (siblings to release.js)
    * src/index.html with script element for '/vendor/require.js'

## Executing the build with release.js

The release.js file needs to be executable, `chmod u+x release.js` 

*nix user path for node should be set, you can use .bash_profile  
    export NODE_PATH=$HOME/local/node/bin/node:$HOME/node_modules:$HOME/node_modules/.bin
    export PATH=$HOME/local/bin:$HOME/local/node/bin:$PATH

To execute the release.js script use `./release.js`

You can name the build using a single argument  
    ./release.js beta1

Or, without any arguments the script will generate a build number based on time  
    ./release.js

When a rollback is called for pass in two args 1) build name 2) rollback  
    ./release.js beta1 rollback

The script has a variable defined for the path the the r.js (optimizer) script. You can pass in an alternate path to r.js  
    ./release.js v0.1rc1 r.js

Or,  
    ./release.js pathto/r.js


## Notes :

  * The build.js follows this example : <http://requirejs.org/docs/faq-optimization.html#priority>
  * For background information, see the Require.JS optimization notes :
    * <http://requirejs.org/docs/optimization.html>
    * <http://requirejs.org/docs/faq-optimization.html>
  * The build directory has folders for builds generated with r.js
  * The index.html file in the build directory is a copy of the src/index.html file with links to build directory
  * File and directories generated with r.js script should not be committed to repository.

See: <http://wiki.hautelook.net/wiki/dev/frontend/rjs>

## AMD - Asynchronous Module Definition 

Using RequireJS script loader and AMD there are a couple options for managing dependencies:

the the examples below the facade module has it's own dependencies for loading vendor libraries and maps them to an object. So vendor libraries Should only be required using the facade module which provides references to the libraries.


    define(['facade','utils'], function (facade, utils) {

        var ModuleName,
            // References to objects nested in dependencies
            Backbone = facade.Backbone,
            $ = facade.$,
            _ = facade._,
            lib = utils.baselib;

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
            lib = utils.baselib;

        ModuleName = DO SOMETHING HERE

        return ModuleName;
    });


References:
  * [[https://github.com/amdjs/amdjs-api/wiki/AMD|AMD spec]]
  * [[http://requirejs.org/docs/whyamd.html|RequireJS why AMD]]
  * [[http://requirejs.org/docs/whyamd.html#amd|RequireJS AMD]]

See: <http://wiki.hautelook.net/wiki/dev/frontend/amdmodule>


## Documentation:

Using docco annotated source code documenation is found in these directories:

    /docs/
    /models/docs/
    /collections/docs/
    /syncs/docs/
    /utils/docs/
    /views/docs/

See:

http://*dev*.t.dev.hautelook.com/docs/
http://*dev*.t.dev.hautelook.com/models/docs/
http://*dev*.t.dev.hautelook.com/collections/docs/
http://*dev*.t.dev.hautelook.com/syncs/docs/
http://*dev*.t.dev.hautelook.com/utils/docs/
http://*dev*.t.dev.hautelook.com/views/docs/

To generate the docs:

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
  * [[http://jashkenas.github.com/docco/|Docco Annotated Source]]
  * [[https://github.com/jashkenas/docco|Docco Source Code]]

## Open source - `vertebrae` framework

Web application framework for a front-end built using RequireJS, Backbone.js, Underscore.js, jQuery, Mustache.js: <https://github.com/pixelhandler/vertebrae>

—Demo running on heroku (only has a couple examples):  
* <http://vertebrae-framework.herokuapp.com/products>  
* <http://vertebrae-framework.herokuapp.com/hello>  
* <http://vertebrae-framework.herokuapp.com/hello/joe>

—Source code annotated here:  
* <http://vertebrae-framework.herokuapp.com/docs/>  
* <http://vertebrae-framework.herokuapp.com/models/docs/>  
* <http://vertebrae-framework.herokuapp.com/collections/docs/>  
* <http://vertebrae-framework.herokuapp.com/views/docs/>  
* <http://vertebrae-framework.herokuapp.com/syncs/docs/>  
* <http://vertebrae-framework.herokuapp.com/utils/docs/>

—Post on the code organization and build:
* <http://www.hautelooktech.com/2012/02/01/optimize-and-build-a-backbone-js-javascript-application-with-require-js-using-packages/>

