// header.js Model
// ------------
// Requires define
// Return {BaseModel} model constructor object

define( ["models/base"], function (BaseModel) {

    var HeaderModel;

    HeaderModel = BaseModel.extend({

        defaults: {

            branding: {
                alt: "Pixelhandler",
                src: "/images/pixelhandler-logo.png"
            },

            nav: [
                {
                    page: "Products",
                    link: "/products"
                },
                {
                    page: "About",
                    link: "/about"
                },
                {
                    page: "Hello World",
                    link: "/hello/world"
                }
            ]
        }

    });

    return HeaderModel;
});

