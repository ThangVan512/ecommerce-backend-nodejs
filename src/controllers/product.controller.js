"use strict";
const {
  ProductFactory,
  ProductService,
} = require("../services/product.service");

// ...inside your controller class...
class ProductController {
    createProduct = async (req, res) => {
        new OkResponse({
            message: "Create product successfully",
            metadata: await ProductFactory.createProduct(req.body),
        }).send(res);
    };
}
module.exports = new ProductController(); // Exporting an instance of ProductController for use in routes
