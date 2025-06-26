"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("crypto");
const findById = async (key) => {
  try {
    // const newKey = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   status: true,
    //   permissions: ["0000"], // Default permissions, can be customized
    // });
    // console.log("New API key created:", newKey);
    const apiKey = await apiKeyModel.findOne({ key: key, status: true }).lean();
    if (!apiKey) {
      throw new Error("API key not found");
    }
    return apiKey;
  } catch (error) {
    console.error("Error finding API key:", error);
    throw new Error("Database query failed");
  }
};

module.exports = {
  findById,
};
