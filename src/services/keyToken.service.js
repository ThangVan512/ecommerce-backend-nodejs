'use strict'
const keyTokenModel = require("../models/keytoken.model.js");  
class KeyTokenService {
    constructor() {
        // Initialize any properties or dependencies here if needed
    }

    static createKeyToken = async ({ user, publicKey }) => {
        try {
            // Create a new key token document
            const publicKeyString = publicKey.toString();  
            const newKeyToken = await keyTokenModel.create({
                user: user,
                publicKey: publicKeyString, // Ensure publicKey is a string
            });
            return newKeyToken? newKeyToken.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}
module.exports = KeyTokenService;