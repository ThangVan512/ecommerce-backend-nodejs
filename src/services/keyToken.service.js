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
  };

  static findKeyByRefreshTokenUsed = async (refreshTokenUsed) => {
    return await keyTokenModel
      .findOne({
        refreshTokenUsed: { $in: [refreshTokenUsed] },
      })
      .lean();
  };

  static findKeyByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static deleteKeyById = async (keyId) => {
    try {
      if (!Types.ObjectId.isValid(keyId)) {
        throw new Error("Invalid key ID format");
      }
      const deletedKey = await keyTokenModel.findByIdAndDelete(
        new Types.ObjectId(keyId)
      );
      if (!deletedKey) {
        throw new Error("Key not found or already deleted");
      }
      return deletedKey;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;
