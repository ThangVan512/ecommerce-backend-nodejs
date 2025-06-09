'use strict'

const { uniqueId } = require('lodash');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

var apiKeySchema = new Schema({
    key: {
        type: String,
        unique: true, // Ensure that each key is unique
        required: true // Ensure that user is always provided
    },
    status: {
        type: Boolean, 
        default: true, // Default status is active
    },
    permissions: {
        type: [String], // Array of permissions associated with the API key
        required: true, // Ensure that permissions are always provided
        enum: ['0000', '1111', '2222'], // Define allowed permissions
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME // Specify the collection name
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);