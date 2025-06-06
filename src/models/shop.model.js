"use strict";

const { Schema, model } = require("mongoose");

const DOUCMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

const shopSchema = new Schema(
    {
    name: {
        type: String,
        trim: true,
        maxlength: 150, // Limit the length of the shop name
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    passsword: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive", // Default status is 'active'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false, // Default verification status is false
    },
    roles: {
        type: Array,
        default: [],
    },
},
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        collection: COLLECTION_NAME, // Specify the collection name
    }
);


//Export the model
module.exports = model(DOUCMENT_NAME, shopSchema);