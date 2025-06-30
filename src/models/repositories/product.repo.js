"use strict";

const { filter } = require("lodash");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongodb,
} = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i"); // Case-insensitive search
  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } }) // Sort by
    .lean();
  return results;
};

const publishProductByShop = async ({ product_shop, productId }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(productId),
    product_shop: new Types.ObjectId(product_shop),
    isDraft: true, // Assuming isDraft is a field in the product schema
  });
  if (!foundShop) {
    throw new Error("Product not found or does not belong to the shop");
  }
  foundShop.isPublished = true; // Assuming you have a field to mark the product as published
  foundShop.isDraft = false; // Assuming you want to mark it as no longer a
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, productId }) => {
  const foundShop = await product.findOne({
    _id: new Types.ObjectId(productId),
    product_shop: new Types.ObjectId(product_shop),
    isDraft: true, // Assuming isDraft is a field in the product schema
  });
  if (!foundShop) {
    throw new Error("Product not found or does not belong to the shop");
  }
  foundShop.isPublished = false; // Assuming you have a field to mark the product as published
  foundShop.isDraft = true; // Assuming you want to mark it as no longer a
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean(); // Convert to plain JavaScript objects
  return products;
};

const findProduct = async ({ product_id, unselect }) => {
  if (!Types.ObjectId.isValid(product_id)) return null;
  return await product
    .findById(product_id)
    .select(unGetSelectData(unselect))
    .lean();
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
    runValidators: true,
  });
};
const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id") // Populate the product_shop field with name and email
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limit)
    .lean() // Convert to plain JavaScript objects
    .exec();
};
const getProductById = async (productId) => {
  return await product
    .findOne({
      _id: convertToObjectIdMongodb(productId),
    })
    .lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (!foundProduct) {
        throw new Error(`Product with ID ${product.productId} not found.`);
      }
      return {
        price: foundProduct.product_price,
        quantitry: product.quantity,
        productId: foundProduct._id,
        shopId: foundProduct.product_shop,
      };
    })
  );
};
module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
};
