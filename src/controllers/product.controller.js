"use strict";
const {
  ProductFactory,
  ProductService,
} = require("../services/product.service");

const { OKResponse } = require("../core/success.response");

// ...inside your controller class...
class ProductController {
  createProduct = async (req, res) => {
    new OKResponse({
      message: "Create product successfully",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body, // Spread operator to include all properties from req.body
        product_shop: req.user.user, // Assuming req.shop contains the shop ID
      }),
    }).send(res);
  };

  // Update product by ID
  updateProduct = async (req, res) => {
    new OKResponse({
      message: "Update product successfully",
      metadata: await ProductFactory.updateProduct(req.body.product_type,req.params.productId, {
        ...req.body, // Spread operator to include all properties from req.body
        product_shop: req.user.user, // Assuming req.shop contains the shop ID)
      }),
    }).send(res);
  };
  publishProductByShop = async (req, res) => {
    new OKResponse({
      message: "Publish product successfully",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.user,
        productId: req.params.id, // Assuming productId is passed as a URL parameter
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res) => {
    new OKResponse({
      message: "Unpublish product successfully",
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.user,
        productId: req.params.id, // Assuming productId is passed as a URL parameter
      }),
    }).send(res);
  };
  //query all products for shop
  /**
   * @desc Get all draft products for a shop
   * @param {Number} limit - The maximum number of products to return
   * @param {Number} skip - The number of products to skip (for pagination)
   * @return { JSON } - Returns a JSON response with a message and metadata containing the list of draft products
   */
  getAllDraftForShop = async (req, res) => {
    new OKResponse({
      message: "Get all draft products for shop successfully",
      metadata: await ProductFactory.findAllDraftForShop({
        product_shop: req.user.user,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res) => {
    new OKResponse({
      message: "Get all draft products for shop successfully",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.user,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res) => {
    new OKResponse({
      message: "Get products for shop successfully",
      metadata: await ProductFactory.getListSearchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res) => {
    new OKResponse({
      message: "Find all products for shop successfully",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res) => {
    new OKResponse({
      message: "Find product for shop successfully",
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id, // Assuming product_id is passed as a URL parameter
      }),
    }).send(res);
  };
}

module.exports = new ProductController(); // Exporting an instance of ProductController for use in routes
