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
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { compact } = require("lodash");
const { search } = require("../routes/product");
const { removeUndeFineObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
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
  static async updateProduct(type, productId, productData) {
    const ProductClass = this.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError(`Product type ${type} is not registered`);
    }
    const productInstance = new ProductClass(productData);
    return await productInstance.updateProduct(productId);
  }
  // PUT //
  static async publishProductByShop({ product_shop, productId }) {
    return await publishProductByShop({ product_shop, productId });
  }
  static async unPublishProductByShop({ product_shop, productId }) {
    return await unPublishProductByShop({ product_shop, productId });
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

  static async getListSearchProduct({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    skip = 0,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_quantity",
        "product_type",
        "product_shop",
      ],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unselect: ["__v", "product_variations"],
    });
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
    const newProduct = await product.create({ ...this, _id: productId }); // <-- thêm await

    // Add product_stock in inventory collection
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity || 0,
      });
    }
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }
    return newProduct;
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
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
  // Override updateProduct to handle Clothing-specific logic if needed
  async updateProduct(productId) {
    //1. Remove attributes are null or undefined
    const objectParam = removeUndeFineObject(this);
    //2. Check where update product
    if (objectParam.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParam.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParam)
    );
    if (!updateProduct) {
      throw new BadRequestError("Failed to update clothing product");
    }
    return updateProduct;
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
