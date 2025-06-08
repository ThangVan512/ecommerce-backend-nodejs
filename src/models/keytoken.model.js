'use strict'

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Shop', // Reference to the Shop model
        required: true // Ensure that user is always provided
    },
    privateKey: {
        type: String,   // Private key for the user 
        required: true, // Ensure that privateKey is always provided
    },
    publicKey: {
        type: String,   // Public key for the user
        required: true, // Ensure that publicKey is always provided
    },
    refreshToken: {
        type: Array,   // Refresh token for the user
        default: [],   // Default to an empty array if no refresh tokens are provided
    },  
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h' // Token will expire after 1 hour
    }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    collection: COLLECTION_NAME // Specify the collection name
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);