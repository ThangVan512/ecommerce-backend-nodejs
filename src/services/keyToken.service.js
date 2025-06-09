"use strict";
const keyTokenModel = require("../models/keytoken.model.js");
const { Types } = require("mongoose");
class KeyTokenService {
  constructor() {
    // Initialize any properties or dependencies here if needed
  }

  static createKeyToken = async ({
    user,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const userId = Types.ObjectId.isValid(user)
        ? new Types.ObjectId(user)
        : user;

      const keyToken = await keyTokenModel
        .findOneAndUpdate(
          { user: userId }, // Always use ObjectId for user
          { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
          { upsert: true, new: true }
        )
        .lean();

      return keyToken;
    } catch (error) {
      throw error;
    }
  };

  static findByUserId = async (userId) => {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      const keyToken = await keyTokenModel
        .findOne({ user: new Types.ObjectId(userId) }) // dùng new ở đây
        .lean();

      return keyToken;
    } catch (error) {
      throw error;
    }
  };

  static removeKeyById = async (keyId) => {
    return await keyTokenModel.findByIdAndDelete(keyId);
  }
}

module.exports = KeyTokenService;
