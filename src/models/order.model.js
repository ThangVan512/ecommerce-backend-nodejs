"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

var orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true, // Ensure user ID is always provided
    },
    order_checkout: {
      type: Object, // Object to store checkout details
      default: {}, // Default to an empty object if not provided
    },
    order_shipping: {
      type: Object, // Object to store shipping details
      default: {}, // Default to an empty object if not provided
    },
    order_payment: {
      type: Object, // Object to store payment details
      default: {}, // Default to an empty object if not provided
    },
    order_products: {
      type: Array, // Array to store products in the order
      default: [], // Default to an empty array if no products are provided
      required: true, // Ensure that order products are always provided
    },
    order_trackingNumber: {
      type: String, // Tracking number for the order
      default: "", // Default to an empty string if not provided
    },
    order_status: {
      type: String, // Status of the order (e.g., pending, completed, cancelled)
      required: true, // Ensure that order status is always provided
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"], // Define allowed statuses
      default: "pending", // Default status is 'pending'
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME, // Specify the collection name
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
