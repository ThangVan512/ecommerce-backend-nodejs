'use strict'

const { Product, Clothing, Electronic } = require('../models/product.model');
const { BadRequestError } = require('../errors');
class ProductFactory {
  static async createProduct() {
    const productType = this.product_type;
    if (productType === 'clothing') {
      return new Clothing(this);
    } else if (productType === 'electronic') {
      return new Electronic(this);
    } else {
      throw new BadRequestError('Invalid product type');
    }
  }
}
class Product {
    constructor({product_name,product_thumb,product_description,product_price,product_quantity,product_type,product_shop,product_atributes}) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_atributes = product_atributes;
    }

    // create new product
    async createProduct() {
        return await Product.create(this);
    }
}

// Define the Clothing class
class Clothing extends Product {
    constructor({ brand, size, material, ...rest }) {
        super(rest);
        this.brand = brand;
        this.size = size;
        this.material = material;
    }

    // Override createProduct to handle Clothing-specific logic if needed
    async createProduct() {
        const clothing = await Clothing.create(this.product_atributes);
        if(!clothing) {
            throw new BadRequestError('Failed to create clothing product');
        }
        const newProduct = await super.createProduct();
        if(!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        return newProduct;
    }
}

// Define the Electronic class
class Electronic extends Product {
    constructor({ manufacturer, warranty, ...rest }) {
        super(rest);
        this.manufacturer = manufacturer;
        this.warranty = warranty;
    }

    // Override createProduct to handle Electronic-specific logic if needed
    async createProduct() {
        const electronic = await Electronic.create(this.product_atributes);
        if(!electronic) {
            throw new BadRequestError('Failed to create electronic product');
        }
        const newProduct = await super.createProduct();
        if(!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        return newProduct;
    }
}
module.exports = {
  ProductFactory,
  Product,
  Clothing,
  Electronic
};