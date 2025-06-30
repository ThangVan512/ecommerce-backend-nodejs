'use strict'

const { uniqueId } = require('lodash');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

var cartSchema = new Schema({
    cart_state: {
        type: String, // State of the cart (e.g., active, completed)
        required: true, // Ensure that cart state is always provided
        enum: ['active', 'completed', 'cancelled','pending'], // Define allowed states
        default: 'active' // Default state is 'active'
    },
    cart_products: {
        type: Array, // Array to store products in the cart
        default: [], // Default to an empty array if no products are provided
        required: true // Ensure that cart products are always provided
    },
    cart_count_products: {
        type: Number, // Count of products in the cart
        default: 0, // Default to 0 if not provided
    },
    cart_userId: {
        type: Number, // User ID associated with the cart
        required: true, // Ensure that user ID is always provided
    },
    shop_order_ids: {
        type: Array, // Array to store shop order IDs
        default: [], // Default to an empty array if no shop order IDs are provided
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME // Specify the collection name
});

module.exports = model(DOCUMENT_NAME, cartSchema);