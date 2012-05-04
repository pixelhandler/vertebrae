var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    docroot = path.join(application_root, "src"),
    indexdoc = path.join(docroot,"index.html"),
    fs = require('fs'),
    app = express.createServer(),
    port = process.env.PORT || 4242;

// config
app.configure(function () {
    app.use(express.static(docroot));
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// List products
app.get('/api/hello/101', function (req, res) {
    res.send({
        "_links": {
            "self": "/api/about/101",
            "shop": "http://www.hautelook.com/"
        },
        "title": "About HauteLook",
        "content": "Welcome to HauteLook, where you will discover thousands of the top fashion and lifestyle brands at amazing savings. Each day at 8 AM Pacific, shop new sale events featuring the best names in women's and men's fashion and accessories, beauty, kids' apparel and toys, and home décor at up to 75% off. Membership is free and everyone is welcome!",
        "callToAction": "To start shopping, go to: <a href=\"www.hautelook.com\">www.hautelook.com</a>"
    });
});

// Any Route loads index.html like a 404 that just loads the index
app.get(/^.*$/, function(req, res) {
    //res.redirect('/', 301);
    fs.createReadStream(indexdoc).pipe(res);
});

// launch server
app.listen(port, function() {
    console.log("Listening on: " + port);
    console.log("Page: " + indexdoc);
});
