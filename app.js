var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    docroot = path.join(application_root, "src"), // or use "public" for built version
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

// response for hello model
app.get('/api/hello/101', function (req, res) {
    res.send({
        "_links": {
            "self": "/api/about/101",
            "shop": "http://www.hautelook.com/"
        },
        "title": "About HauteLook",
        "content": "Welcome to HauteLook, where you will discover thousands of the top fashion and lifestyle brands at amazing savings. Each day at 8 AM Pacific, shop new sale events featuring the best names in women's and men's fashion and accessories, beauty, kids' apparel and toys, and home décor at up to 75% off. Membership is free and everyone is welcome!",
        "callToAction": "To start shopping, go to: <a href=\"http://www.hautelook.com\">www.hautelook.com</a>"
    });
});

// response for products list
app.get('/api/products', function (req, res) {
    res.send([
        {
          "id": 0,
          "title": "My Awesome T-shirt",  
          "description": "All about the details. Of course it's black.",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1234/main.jpg"  
            }  
          ],  
          "categories": [  
              { "name": "Clothes" },
              { "name": "Shirts" } 
          ],  
          "style": "1234",  
          "variants": [  
            {  
              "color": "Black",  
              "images": [  
                {  
                  "kind": "thumbnail",  
                  "url": "images/products/1234/thumbnail.jpg"  
                },
                {  
                  "kind": "catalog",  
                  "url": "images/products/1234/black.jpg"  
                }  
              ],  
              "sizes": [  
                {  
                  "size": "S",  
                  "available": 10,  
                  "sku": "CAT-1234-Blk-S",  
                  "price": 99.99  
                },
                {
                  "size": "M",  
                  "available": 7,  
                  "sku": "CAT-1234-Blk-M",  
                  "price": 109.99  
                }  
              ]  
            }  
          ],
          "catalogs": [
              { "name": "Apparel" }
          ]  
        },
        {
          "id": 1,
          "title": "My Other T-shirt",  
          "description": "All about the details. Almost as nice as my Awesome T-Shirt",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1235/main.jpg"  
            }  
          ],  
          "categories": [  
              { "name": "Clothes" },
              { "name": "Shirts" } 
          ],  
          "style": "1235",  
          "variants": [  
            {  
              "color": "Blue",  
              "images": [  
                {  
                  "kind": "thumbnail",  
                  "url": "images/products/1235/thumbnail.jpg"  
                },
                {  
                  "kind": "catalog",  
                  "url": "images/products/1235/blue.jpg"  
                }  
              ],  
              "sizes": [  
                {  
                  "size": "S",  
                  "available": 8,  
                  "sku": "CAT-1235-Blu-S",  
                  "price": 79.99  
                },
                {
                  "size": "M",  
                  "available": 9,  
                  "sku": "CAT-1235-Blu-M",  
                  "price": 89.99  
                },
                {
                  "size": "L",  
                  "available": 12,  
                  "sku": "CAT-1235-Blu-L",  
                  "price": 99.99  
                }  
              ]  
            }  
          ],
          "catalogs": [
              { "name": "Apparel" }
          ]  
        },
        {
          "id": 2,
          "title": "My Gray T-shirt",  
          "description": "All about the details. Not too much color here, just gray.",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1236/main.jpg"  
            }  
          ],  
          "categories": [  
              { "name": "Clothes" },
              { "name": "Shirts" } 
          ],  
          "style": "1236",  
          "variants": [  
            {  
              "color": "Gray",  
              "images": [  
                {  
                  "kind": "thumbnail",  
                  "url": "images/products/1236/thumbnail.jpg"  
                },
                {  
                  "kind": "catalog",  
                  "url": "images/products/1236/gray.jpg"  
                }  
              ],  
              "sizes": [  
                {  
                  "size": "S",  
                  "available": 25,  
                  "sku": "CAT-1236-Gra-S",  
                  "price": 19.99  
                },
                {
                  "size": "L",  
                  "available": 16,  
                  "sku": "CAT-1236-Gra-L",  
                  "price": 29.99  
                }  
              ]  
            }  
          ],
          "catalogs": [
              { "name": "Apparel" }
          ]  
        },
        {
          "id": 3,
          "title": "My Red Hot T-shirt",  
          "description": "All about the details. Red Hot T, get 'em while they're hot.",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1237/main.jpg"  
            }  
          ],  
          "categories": [  
              { "name": "Clothes" },
              { "name": "Shirts" } 
          ],  
          "style": "1237",  
          "variants": [  
            {  
              "color": "Red",  
              "images": [  
                {  
                  "kind": "thumbnail",  
                  "url": "images/products/1237/thumbnails/red.jpg"  
                },
                {  
                  "kind": "catalog",  
                  "url": "images/products/1237/red.jpg"  
                }  
              ],  
              "sizes": [  
                {  
                  "size": "S",  
                  "available": 25,  
                  "sku": "CAT-1237-Red-S",  
                  "price": 19.99  
                },
                {
                  "size": "L",  
                  "available": 16,  
                  "sku": "CAT-1237-Red-L",  
                  "price": 29.99  
                }  
              ]  
            },
            {  
              "color": "White",  
              "images": [  
                {  
                  "kind": "thumbnail",  
                  "url": "images/products/1237/thumbnails/white.jpg"  
                },
                {  
                  "kind": "catalog",  
                  "url": "images/products/1237/white.jpg"  
                }  
              ],  
              "sizes": [  
                {  
                  "size": "M",  
                  "available": 7,  
                  "sku": "CAT-1237-Whi-M",  
                  "price": 18.99  
                },
                {
                  "size": "L",  
                  "available": 8,  
                  "sku": "CAT-1237-Whi-L",  
                  "price": 27.99  
                }  
              ]  
            }  
          ],
          "catalogs": [
              { "name": "Apparel" }
          ]  
        }
    ]);
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
