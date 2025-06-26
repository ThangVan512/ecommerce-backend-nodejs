"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  searchProductsByUser,
} = require("../models/repositories/product.repo");
const { compact } = require("lodash");
const { search } = require("../routes/product");
class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, productClass) {
    if (!type || !productClass) {
      throw new BadRequestError("Invalid product type or class");
    }
    this.productRegistry[type] = productClass;
  }
  static async createProduct(type, productData) {
    const ProductClass = this.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError(`Product type ${type} is not registered`);
    }
    const productInstance = new ProductClass(productData);
    return await productInstance.createProduct();
  }
  // PUT //
  static async publishProductByShop({ product_shop,productId  }) {
    return await publishProductByShop({ product_shop,productId });
  }
  static async unPublishProductByShop({ product_shop,productId  }) {
    return await unPublishProductByShop({ product_shop,productId });
  }
  // QUERY ///
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProduct({keySearch}){
    return await searchProductsByUser({ keySearch });
  }
}
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

// Define the Clothing class
class Clothing extends Product {
  // Override createProduct to handle Clothing-specific logic if needed
  async createProduct() {
    console.log("this.product_attributes:", this.product_attributes);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop, // Ensure product_shop is included
    });
    if (!newClothing) {
      throw new BadRequestError("Failed to create clothing product");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

// Define the Electronic class
class Electronic extends Product {
  // Override createProduct to handle Electronic-specific logic if needed
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop, // Ensure product_shop is included
    });
    if (!newElectronic) {
      throw new BadRequestError("Failed to create electronic product");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

class Furniture extends Product {
  // Override createProduct to handle Furniture-specific logic if needed
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop, // Ensure product_shop is included
    });
    if (!newFurniture) {
      throw new BadRequestError("Failed to create furniture product");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = {
  ProductFactory,
};
