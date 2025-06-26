'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

var inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId, // Reference to the product
        ref: 'Product', // Assuming you have a Product model
    },
    inventory_location: {
        type: String, // Location of the inventory
        default: "unknown", // Default value if not provided
    },
    inventory_stock: {
        type: Number, // Stock quantity
        default: 0, // Default stock quantity
        required: true, // Ensure stock is always provided
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId, // Reference to the shop
        ref: 'Shop', // Assuming you have a Shop model
    },
    inventory_reservation: {
        type: Array, // Reserved stock quantity
        default: [], // Default to an empty array if not provided
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME // Specify the collection name
});

module.exports = model(DOCUMENT_NAME, inventorySchema);