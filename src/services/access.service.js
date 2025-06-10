"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const crypto = require("node:crypto"); // Import crypto for generating keys
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auths/authUtils");
const { getInfoData } = require("../utils/index"); // Import utility function for data extraction
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response"); // Import custom error class for handling bad requests
//Service for handling access-related operations
const {findByEmail} = require("./shop.service"); // Importing the findByEmail function from shop.service
const keytokenModel = require("../models/keytoken.model");
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
    // Check email existence
    const holderShop = await shopModel.findOne({ email: email }).lean();
    if (holderShop) {
      throw new BadRequestError(
        `Email ${email} already exists. Please use a different email.`
      );
    }
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
    const newShop = await shopModel.create({
      name: name,
      email: email,
      password: passwordHash, // Ensure to hash the password before saving in production
      role: RoleShop.SHOP,
    });
    if (!newShop) {
      throw new BadRequestError("Sign Up failed");
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
        throw new BadRequestError("Sign Up failed");
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
  }

  //Login
  static async login({ email, password, refreshToken = null }) {
    // Check email existence
    const holderShop = await findByEmail(email);
    if (!holderShop) {
      throw new BadRequestError(`Email ${email} does not exist.`);
    }
    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, holderShop.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password. Please try again.");
    }
    // Generate private key and public key for the shop
    const privateKey = crypto.randomBytes(64).toString("hex"); // Generate a random private key
    const publicKey = crypto.randomBytes(64).toString("hex"); // Generate a random public key
    const tokens = await createTokenPair(
      { user: holderShop._id, email: holderShop.email, role: holderShop.role },
      privateKey,
      publicKey
    ); // Create token pair using the public key
    await KeyTokenService.createKeyToken({
      user: holderShop._id, // Use the shop's ID
      publicKey, // Ensure publicKey is a string
      privateKey, // Ensure privateKey is a string
      refreshToken: tokens.refreshToken, // Use the provided refresh token or the newly generated one
    });
    return {
      code: 20000,
      message: "Login successful",
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email", "role"],
          object: holderShop,
        }),
        tokens
      },
      status: "success",
    };
  }
  
  //Logout
  static logout = async ({ keyStore }) => {
    // Remove the key token from the database
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("Key token deleted:", delKey);
    return delKey; // Return the deleted key token
  }

  static handlerRefreshToken = async ( refreshToken ) => {
    // Validate the refresh token
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required.");
    }
    // Find the key token associated with the refresh token
    const foundToken = await KeyTokenService.findKeyByRefreshTokenUsed(refreshToken);
     if(foundToken) {
      const { user, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(user); // Delete the key token
      throw new ForbiddenError("Refresh token has been used. Please login again.");
     }
    // Find the key token by user ID
    const holderToken = await KeyTokenService.findKeyByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new BadRequestError("Invalid refresh token.");
    }
    // Verify the refresh token
    const { user, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    if (!user || !email) {
      throw new UnauthorizedError("Invalid refresh token.");
    }
    const foundShop = await findByEmail(email)
    if (!foundShop) {
      throw new UnauthorizedError("Shop not found.");
    }
    // Create new token pair using the public key
    const tokens = await createTokenPair(
      { user: foundShop._id, email: foundShop.email, role: foundShop.role }, 
      holderToken.privateKey,
      holderToken.publicKey
    );
    //update the refresh token in the key token model
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken, // Update the refresh token
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // Add the used refresh token to the array
      },
    });
    return {
      code: 20000,
      message: "Refresh token successful",
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email", "role"],
          object: foundShop,
        }),
        tokens
      },
      status: "success",
    };

  }
}

module.exports = AccessService; // Exporting the AccessService class for use in other modules
