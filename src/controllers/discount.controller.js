"use strict";
const { DiscountService } = require("../services/discount.service");

const { OKResponse } = require("../core/success.response");

class DiscountController {
  // Create a new discount code
  createDiscountCode = async (req, res) => {
    new OKResponse({
      message: "Create discount code successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shop: req.user.user, // Assuming req.user contains the shop ID
      }),
    }).send(res);
  };

  // Get all discount codes for a shop
  getAllDiscountCodesByShop = async (req, res) => {
    new OKResponse({
      message: "Get all discount codes for shop successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        discount_shop: req.user.user, // Assuming req.user contains the shop ID
        ...req.query,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res) => {
    new OKResponse({
      message: "Get discount amount successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  getAllDiscountCodesWithProducts = async (req, res) => {
    new OKResponse({
      message: "Get all discount codes with products successfully",
      metadata: await DiscountService.getAllDiscountCodesWithProducts({
        ...req.query,
      }),
    }).send(res);
  };
  // Get a discount code by ID
  getDiscountCodeById = async (req, res) => {
    new OKResponse({
      message: "Get discount code by ID successfully",
      metadata: await DiscountService.getDiscountCodeById({
        discountId: req.params.id, // Assuming discountId is passed as a URL parameter
        discount_shop: req.user.user, // Assuming req.user contains the shop ID
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
