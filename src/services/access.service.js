"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const crypto = require("node:crypto"); // Import crypto for generating keys
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auths/authUtils");
const { getInfoData } = require("../utils/index"); // Import utility function for data extraction
const RoleShop = {
  WRITER: "WRITER",
  SHOP: "SHOP",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  constructor() {
    // Initialize any properties or dependencies here if needed
  }

  static async signUp({ name, email, password }) {
    try {
      // Check email existence
      const holderShop = await shopModel.findOne({ email: email }).lean();
      if (holderShop) {
        return {
          code: 40000,
          message: "Email already exists",
          metadata: {},
          status: "error",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
      const newShop = await shopModel.create({
        name: name,
        email: email,
        password: passwordHash, // Ensure to hash the password before saving in production
        role: RoleShop.SHOP,
      });
      if (!newShop) {
        return {
          code: 40000,
          message: "Sign Up failed",
          metadata: {},
          status: "error",
        };
      } else {
        // Create private key and public key for the shop
        

        const privateKey = crypto.randomBytes(64).toString("hex"); // Generate a random private key
        const publicKey = crypto.randomBytes(64).toString("hex"); // Generate a random public key
        const keyStore = await KeyTokenService.createKeyToken({
          user: newShop._id, // Use the new shop's ID
          publicKey, // Ensure publicKey is a string
          privateKey, // Ensure privateKey is a string
        });
        if (!keyStore) {
          return {
            code: 40000,
            message: "Sign Up failed",
            metadata: {},
            status: "error",
          };
        } // Convert public key to string
        const { accessToken, refreshToken } = await createTokenPair(
          { user: newShop._id, email: newShop.email, role: newShop.role },
          privateKey,
          publicKey
        ); // Create token pair using the public key
        return {
          code: 20000,
          message: "Sign Up successful",
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email", "role"],
              object: newShop,
            }),
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          status: "success",
        };
      }
    } catch (error) {
      return {
        code: 50000,
        message: "Sign Up failed",
        metadata: error.message,
        status: "error",
      };
    }
  }
}

module.exports = AccessService; // Exporting the AccessService class for use in other modules
