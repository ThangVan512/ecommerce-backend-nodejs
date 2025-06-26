"use strict";

const { set } = require("lodash");
const { Schema, model } = require("mongoose");
const slugify = require("slugify");
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
    product_slug: String, // Optional field for product slug
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
    product_attributes: {
      type: Schema.Types.Mixed, // Store product attributes as an object
      required: true, // Ensure that product_attributes is always provided
    },
    // Add any other fields that are common to all products
    product_ratings: {
      type: Number,
      default: 4.5, // Default rating is 0
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (v) => Math.round(v * 10) / 10, // Round to one decimal place
    },
    product_variations: {
      type: Array,
      default: [], // Default to an empty array
    },
    isDraft: {
      type: Boolean,
      default: true, // Default to false, indicating the product is not a draft
      index: true, // Create an index for faster queries
      select: false, // Exclude this field from query results by default
    },
    isPublished: {
      type: Boolean,
      default: false, // Default to false, indicating the product is not published
      index: true, // Create an index for faster queries
      select: false, // Exclude this field from query results by default
    },
    isDeleted: {
      type: Boolean,
      default: false, // Default to false, indicating the product is not deleted
      index: true, // Create an index for faster queries
      select: false, // Exclude this field from query results by default
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME, // Specify the collection name
  }
);

// Create indexes for faster queries
productSchema.index({ product_name: "text", product_description: "text" }); // Create
// a text index on product_name and product_description for full-text search
// Create an index on product_slug for faster lookups
productSchema.index({ product_slug: 1 }, { unique: true }); // Ensure product_slug is unique
// Create an index on product_shop for faster lookups
productSchema.index({ product_shop: 1 }); // Ensure product_shop is indexed
// Create an index on product_type for faster lookups
productSchema.index({ product_type: 1 }); // Ensure product_type is indexed
// Create an index on isDraft for faster queries
productSchema.index({ isDraft: 1 }); // Ensure isDraft is indexed
// Create an index on isPublished for faster queries
productSchema.index({ isPublished: 1 }); // Ensure isPublished is indexed
// Create an index on isDeleted for faster queries
productSchema.index({ isDeleted: 1 }); // Ensure isDeleted is indexed

// Middleware to generate product slug before saving
productSchema.pre("save", function (next) {
  if (this.isModified("product_name")) {
    this.product_slug = slugify(this.product_name, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
    });
  }
  next();
});
// Define the product type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    }, // Reference to the Shop model}
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: "Clothing", // Specify the collection name
    strict: false,
  }
);

// Define the product type = Electronics
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    }, // Reference to the Shop model}
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: "Electronics", // Specify the collection name
    strict: false,
  }
);

const furnitureSchema = new Schema(
  {
    material: { type: String, require: true },
    dimensions: String,
    weight: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    }, // Reference to the Shop model}
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: "Furniture", // Specify the collection name
    strict: false,
  }
);

// Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
