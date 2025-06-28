'use strict'

const { uniqueId } = require('lodash');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

var discountSchema = new Schema({
    discount_name: {
        type: String, // Name of the discount
        required: true, // Ensure that discount name is always provided
    },
    discount_description: {
        type: String, // Description of the discount
        default: "No description provided", // Default value if not provided
    },
    discount_type: {
        type: String, // Type of the discount (e.g., percentage, fixed amount)
        default: 'fixed_mount', // Default type if not provided
        enum: ['percentage', 'fixed'], // Define allowed types
    },
    discount_value: {
        type: Number, // Value of the discount
        required: true, // Ensure that discount value is always provided
    },
    discount_code: {
        type: String, // Code for the discount
        require: true, // Ensure that discount code is always provided
        unique: true, // Ensure that each discount code is unique 
        default: uniqueId('discount_'), // Generate a unique code if not provided
    },
    discount_start_date: {
        type: Date, // Start date of the discount
        required: true, // Ensure that start date is always provided
        default: Date.now, // Default to current date if not provided
    },
    discount_end_date: {
        type: Date, // End date of the discount
        required: true, // Ensure that end date is always provided
        default: Date.now, // Default to current date if not provided
    },
    discount_max_uses: {
        type: Number, // Maximum number of times the discount can be used
        default: 1, // Default to 1 use if not provided
        required: true, // Ensure that max uses is always provided
    },
    discount_used_count: {
        type: Number, // Count of how many times the discount has been used
        default: 0, // Default to 0 if not provided
        required: true, // Ensure that used count is always provided
    },
    discount_users_count: {
        type: Array, // Count of how many users have used the discount
        default: []
    },
    discount_user_used: {
        type: Array, // Array to store user IDs who have used the discount
        default: [], // Default to an empty array if not provided
        ref: 'User', // Assuming you have a User model
        required: true, // Ensure that user IDs are always provided
    },
    discount_max_uses_per_user: {
        type: Number, // Maximum number of times a single user can use the discount
        default: 1, // Default to 1 use per user if not provided
        required: true, // Ensure that max uses per user is always provided
    },
    discount_min_order_value: {
        type: Number, // Minimum order value to apply the discount  
        required: true, // Ensure that minimum order value is always provided
    },
    discount_status: {
        type: String,
        enum: ["active", "inactive"],
        default: true, // Default status is active
    },
    discount_applies_to: {
        type: String, // Specifies whether the discount applies to all products or specific products
        default: 'all', // Default to all products if not provided
        enum: ['all', 'specific'], // Define allowed values
    },
    discount_product_ids: {
        type: Array, // Array of product IDs to which the discount applies
        default: [], // Default to an empty array if not provided
        ref: 'Product', // Assuming you have a Product model
    },
    discount_shopId: {
        type: Schema.Types.ObjectId, // Reference to the shop
        ref: 'Shop', // Assuming you have a Shop model
        required: true, // Ensure that shop ID is always provided
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME // Specify the collection name
});

module.exports = model(DOCUMENT_NAME, discountSchema);