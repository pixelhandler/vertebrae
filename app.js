var application_root = __dirname
  , express = require("express")
  , path = require("path")
  , docroot = path.join(application_root, "public")
  , fs = require('fs')
  , app = express.createServer()
  , port = process.env.PORT || 4242;

// config
app.configure(function () {
    app.use(express.static(docroot));
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Any Route loads index.html like a 404 that just loads the index
app.get(/^.*$/, function(req, res) {
  res.redirect('/', 301);
});

// launch server
app.listen(port, function() {
    console.log("Listening on " + port);
});
