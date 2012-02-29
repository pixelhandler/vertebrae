# Build and optimize using:

> r.js -o build.js

## to launch server

> node app.js

runs at : http://localhost:4242/

The app.js is the node.js script that runs the server and expects the "public" directory to have the application. 

The build.js should be configured to build to the "public" directory. 

So after you run `r.js -o build.js` to populate the "public" directory then you can use `node app.js` to view the site at : http://localhost:4242