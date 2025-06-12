"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true, // Ensure that product_name is always provided
    },
    product_thumb: {
      type: String,
      required: true, // Ensure that product_thumb is always provided
    },
    product_description: String, // Optional field for product description
    product_price: {
      type: Number,
      required: true, // Ensure that product_price is always provided
    },
    product_quantity: {
      type: Number,
      required: true, // Ensure that product_quantity is always provided
    },
    product_type: {
      type: String,
      required: true, // Ensure that product_type is always provided
      enum: ["Electronics", "Clothing", "Accessories", "Home_appliances"], // Define allowed product types
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_atributes: {
      type: Schema.Types.Mixed, // Store product attributes as an object
      required: true, // Ensure that product_atributes is always provided
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME, // Specify the collection name
  }
);

// Define the product type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: "Clothing", // Specify the collection name
  }
);

// Define the product type = Electronics
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: "Electronics", // Specify the collection name
  }
);

// Export the model
module.exports = {
  Product: model(DOCUMENT_NAME, productSchema),
  Clothing: model("Clothing", clothingSchema),
  Electronic: model("Electronics", electronicSchema),
};
