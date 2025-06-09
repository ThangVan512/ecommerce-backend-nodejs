"use strict";

const shopModel = require("../models/shop.model"); // Make sure you import your model

const findByEmail = async (
  email,
  select = {
    _id: 1,
    name: 1,
    email: 1,
    password: 1,
    role: 1,
    createdAt: 1,
    updatedAt: 1,
  }
) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

module.exports = {
  findByEmail,
};