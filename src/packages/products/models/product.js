// Product Model
// -----------
// Requires define
// Return {ProductModel} object as constructor  

define(['models/base'], function (BaseModel) {

    var ProductModel;

    ProductModel = BaseModel.extend({  

        defaults : {
            "title": null,  
            "description": null,  
            "images": [  
                {  
                    "kind": "thumbnail",  
                    "url": "images/products/noimage.jpg"  
                }  
            ],  
            "categories": [  
                { "name": null },  
            ],  
            "style": 0,  
            "varients": [  
              {  
                "color": null,  
                "images": [  
                    {  
                        "kind": "thumbnail",  
                        "url": "images/products/noimage.jpg"  
                    }  
                ],  
                "sizes": [  
                    {  
                        "size": null,  
                        "available": 0,  
                        "sku": null,  
                        "price": 0  
                    }  
                ]  
              }  
            ],  
            "catalogs": [  
                { "name": "general" }  
            ]  
        }  
    });

    return ProductModel;
});
