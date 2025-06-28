"use strict";

/*
Discount Service
1- Generate a unique discount code
2- Get discount amount (User)
3- Get all discount code (User | Shop)
4- Verify discount code (User)
5- Delete discount code (Admin | Shop)
6- Cancel discount code (Admin | Shop)
7- Update discount code (Admin | Shop)
*/
const Discount = require("../models/discount.model");
const { Types } = require("mongoose");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const { product } = require("../models/product.model");
const { find } = require("lodash");
const {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnSelect,
  checkDiscountExits,
} = require("../models/repositories/discount.repo");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_status,
      discount_shopId,
      discount_minimum_order_amount,
      discount_min_order_value,
      discount_product_ids,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_max_uses,
      discount_used_count,
      discount_users_count,
      discount_max_uses_per_user,
    } = payload;
    if (new Date() < new Date(discount_start_date)) {
      throw new BadRequestError("Discount start date must be in the past.");
    }
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError(
        "Discount end date must be after the start date."
      );
    }
    // Create index for discount_code
    const foundDiscount = await Discount.findOne({
      discount_code: discount_code,
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
    }).lean();
    if (foundDiscount && foundDiscount.discount_status) {
      throw new BadRequestError(
        `Discount code ${discount_code} already exists for this shop and is active.`
      );
    }
    const newDiscount = await Discount.create({
      discount_code,
      discount_start_date: discount_start_date || Date.now(),
      discount_end_date: discount_end_date || Date.now(),
      discount_status: discount_status !== undefined ? discount_status : true,
      discount_shopId: new Types.ObjectId(discount_shopId),
      discount_minimum_order_amount: discount_minimum_order_amount || 0,
      discount_product_ids: discount_product_ids
        ? discount_product_ids.map((id) => new Types.ObjectId(id))
        : [],
      discount_name: discount_name || "Default Discount",
      discount_description: discount_description || "No description provided",
      discount_type: discount_type || "percentage", // 'percentage' or 'fixed'
      discount_value: discount_value || 0,
      discount_max_uses: discount_max_uses || 1,
      discount_used_count: discount_used_count || 0,
      discount_users_count: [],
      discount_max_uses_per_user: 1, // Default to 1 use per user
      discount_min_order_value: discount_min_order_value || 0,
    });
    if (!newDiscount) {
      throw new BadRequestError("Failed to create discount code");
    }
    return newDiscount;
  }
  // Update discount code
  static async updateDiscountCode(discountId, payload) {
    const {
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_status,
      discount_minimum_order_amount,
      discount_product_ids,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_max_uses,
      discount_used_count,
      discount_users_count,
      discount_max_uses_per_user,
    } = payload;

    const foundDiscount = await Discount.findById(discountId).lean();
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code with ID ${discountId} not found.`);
    }

    // Update fields only if they are provided
    const updateFields = {};
    if (discount_code) updateFields.discount_code = discount_code;
    if (discount_start_date)
      updateFields.discount_start_date = new Date(discount_start_date);
    if (discount_end_date)
      updateFields.discount_end_date = new Date(discount_end_date);
    if (discount_status !== undefined)
      updateFields.discount_status = discount_status;
    if (discount_minimum_order_amount !== undefined)
      updateFields.discount_minimum_order_amount =
        discount_minimum_order_amount;
    if (discount_product_ids) {
      updateFields.discount_product_ids = discount_product_ids.map((id) =>
        new Types.ObjectId(id)
      );
    }
    if (discount_name) updateFields.discount_name = discount_name;
    if (discount_description)
      updateFields.discount_description = discount_description;
    if (discount_type) updateFields.discount_type = discount_type;
    if (discount_value !== undefined)
      updateFields.discount_value = discount_value;
    if (discount_max_uses !== undefined)
      updateFields.discount_max_uses = discount_max_uses;
    if (discount_used_count !== undefined)
      updateFields.discount_used_count = discount_used_count;
    if (discount_users_count !== undefined)
      updateFields.discount_users_count = discount_users_count;
    if (discount_max_uses_per_user !== undefined)
      updateFields.discount_max_uses_per_user = discount_max_uses_per_user;

    const updatedDiscount = await Discount.findByIdAndUpdate(
      discountId,
      updateFields,
      { new: true }
    );

    return updatedDiscount;
  }

  // Get all discount codes for a shop
  static async getAllDiscountCodesWithProducts({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page,
  }) {
    let products;
    const foundDiscount = await Discount.findOne({
      discount_code: discount_code,
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
    }).lean();
    if (!foundDiscount || !foundDiscount.discount_status) {
      throw new NotFoundError(`Discount code ${discount_code} not found.`);
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          isPublished: true,
          product_shop: convertToObjectIdMongodb(discount_shopId),
        },
        limit,
        page,
        sort: "ctime",
        select: [
          "product_name",
          "product_thumb",
          "product_price",
          "product_quantity",
          "product_type",
          "product_shop",
        ],
      });
    }
    if (discount_applies_to === "specific") {
      if (
        !Array.isArray(discount_product_ids) ||
        discount_product_ids.length === 0
      ) {
        throw new BadRequestError(
          "No specific products found for this discount."
        );
      }
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids.map((id) => convertToObjectIdMongodb(id)),
          },
          isPublished: true,
          product_shop: convertToObjectIdMongodb(discount_shopId),
        },
        limit,
        page,
        sort: "ctime",
        select: [
          "product_name",
          "product_thumb",
          "product_price",
          "product_quantity",
          "product_type",
          "product_shop",
        ],
      });
    }
    return products;
  }

  // Get all discount codes for a shop
  static async getAllDiscountCodesByShop({ limit, page, discount_shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: limit || 50,
      page: page || 1,
      filter: {
        discount_shopId: convertToObjectIdMongodb(discount_shopId),
        discount_status: "active",
      },
      unSelect: ["__v", "discount_shopId", "createdAt", "updatedAt"],
      model: Discount,
    });
    return discounts;
  }
  //Apply discount code
  static async getDiscountAmount({ discount_code, userId, discount_shopId, products }) {
    const foundDiscount = await checkDiscountExits(Discount, {
      model: Discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectIdMongodb(discount_shopId),
        discount_status: "active",
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${discount_code} not found.`);
    }
    const {
      discount_status,
      discount_max_uses,
      discount_minimum_order_amount,
      discount_used_count,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_status) {
      throw new BadRequestError(`Discount code ${discount_code} is inactive.`);
    }
    if (discount_max_uses <= discount_used_count) {
      throw new BadRequestError(
        `Discount code ${discount_code} has reached its maximum uses.`
      );
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError(
        `Discount code ${discount_code} is not valid at this time.`
      );
    }
    // Check minimum order value
    if (discount_minimum_order_amount > 0) {
      const totalOrderValue = products.reduce((total, product) => {
        return total + product.product_price * product.product_quantity;
      }, 0);
      if (totalOrderValue < discount_minimum_order_amount) {
        throw new BadRequestError(
          `Minimum order value of ${discount_minimum_order_amount} not met for discount code ${discount_code}.`
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_count.find(
        (user) => user.userId.toString() === userId.toString()
      );
      if (
        userUseDiscount &&
        userUseDiscount.count >= discount_max_uses_per_user
      ) {
        throw new BadRequestError(
          `User has already used the discount code ${discount_code} the maximum number of times allowed.`
        );
      }
    }
    // Check if discount applies to specific products or all products
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrderValue * (discount_value / 100);
    return {
      totalOrderValue,
      discountAmount: amount,
      totalPrice: totalOrderValue - amount,
    };
  }

  //Delete discount code
  static async deleteDiscountCode({ discountId, discount_shopId }) {
    const deletedDiscount = await Discount.findOneAndDelete({
      _id: convertToObjectIdMongodb(discountId),
      discount_shopId: convertToObjectIdMongodb(discount_shopId),
    });
    if (!deletedDiscount) {
      throw new NotFoundError(`Discount code with ID ${discountId} not found.`);
    }
    return deletedDiscount;
  }

    // Cancel discount code
    static async cancelDiscountCode({ discountId, discount_shopId, userId }) {
        const foundDiscount = await checkDiscountExits(Discount, {
            model: Discount,
            filter: {
                _id: convertToObjectIdMongodb(discountId),
                discount_shopId: convertToObjectIdMongodb(discount_shopId),
            },
        });
        if (!foundDiscount) {
            throw new NotFoundError(`Discount code with ID ${discountId} not found.`);
        }
        if (foundDiscount.discount_used_count > 0) {
            throw new BadRequestError(
                `Cannot cancel discount code ${discountId} as it has already been used.`
            );
        }
        const updatedDiscount = await Discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId ? convertToObjectIdMongodb(userId) : null,
            },
            $inc: {
                discount_used_count: -1,
                discount_max_uses
            },
        })
        if (!updatedDiscount) {
            throw new BadRequestError(`Failed to cancel discount code ${discountId}.`);
        }
        return updatedDiscount;
    }
}
module.exports = { DiscountService }; // Exporting the DiscountService class for use in other modules
