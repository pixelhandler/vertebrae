var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    app = express.createServer(),
    port = process.env.PORT || 4242;

// config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "build")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// launch server

app.listen(port, function() {
  console.log("Listening on " + port);
});
