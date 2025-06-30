"use strict";

const { find } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findCartByUserId } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");
class CheckoutService {
  /**
   * Checkout review service
   * @param {Object} params - Parameters for the checkout review
   * @param {string} params.cartId - The ID of the cart
   * @param {number} params.userId - The ID of the user
   * @param {Array} params.shop_order_ids - Array of shop order IDs
   * @returns {Promise<Object>} - Returns a promise that resolves to the checkout review details
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // Logic to review the checkout items
    const foundCart = await findCartByUserId(userId);
    // This could involve validating the cart items, checking stock, etc.
    const cartItems = foundCart?.items || [];
    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestError("Cart is empty or does not exist");
    }
    const check_out_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // Calculate total price, fees, and discounts
    for (const item of shop_order_ids) {
      const { shopId, shop_discount = [], item_products = [] } = item;
      // Validate shopId
      const checkProductServer = await checkProductByServer(
        item_products[0].productId
      );
      if (!checkProductServer) {
        throw new NotFoundError(
          `Product with ID ${item_products[0].productId} not found.`
        );
      }
      if (!checkProductServer[0]) {
        throw new NotFoundError(
          `Product with ID ${item_products[0].productId} not found in the server.`
        );
      }
      // Calculate total price for the shop order
      const checkoutPrice = checkProductServer.reduce((total, product, idx) => {
        const quantity = item_products[idx] ? item_products[idx].quantity : 1;
        return total + product.price * quantity;
      }, 0);
      check_out_order.totalPrice += checkoutPrice;
      check_out_order.feeShip += item.feeShip || 0;
      // Apply discounts if any
      let totalDiscount = 0;
      if (shop_discount && shop_discount.length > 0) {
        const discountResult = await getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          product: checkProductServer[0],
        });
        totalDiscount = discountResult.totalDiscount || 0;
        check_out_order.totalDiscount += totalDiscount;
      }
      const itemCheckout = {
        shopId,
        shop_discount,
        item_products: checkProductServer,
        priceRaw: checkoutPrice, // Raw price before discounts
        priceApplyCheckout: checkoutPrice - totalDiscount, // Price after applying discounts
      };
      check_out_order.totalCheckout += itemCheckout.priceApplyCheckout;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      check_out_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    // Validate input parameters
    const { shop_order_ids_new, check_out_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    if (!products || products.length === 0) {
      throw new BadRequestError("No products found in the order");
    }
    const acquireProduct = [];
    // Loop through each product and acquire locks
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock);
      if (!keyLock) {
        throw new BadRequestError(
          `Failed to acquire lock for product ${productId}. Please try again later.`
        );
      }
      await releaseLock(keyLock);
    }
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Failed to acquire lock for one or more products."
      );
    }
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: check_out_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
      order_status: "pending", // Default status for new orders
    });
    if (!newOrder) {
      throw new BadRequestError("Failed to create order. Please try again.");
    }
    // Optionally, you can clear the cart after successful order creation

    // await clearCart(cartId); // Assuming you have a method to clear the cart
    // Return the newly created order
    return newOrder;
  }
  /**
   * Get order by user ID and order ID
   * @param {Object} params - Parameters for retrieving the order
   * @param {string} params.userId - The ID of the user
   * @param {string} params.orderId - The ID of the order
   * @returns {Promise<Object>} - Returns a promise that resolves to the found order
   */
  static async getOrderByUser({ userId, orderId }) {
    // Validate input parameters
    if (!userId || !orderId) {
      throw new BadRequestError("User ID and Order ID are required");
    }
    // Find the order by user ID and order ID
    const foundOrder = await order.findOne({
      order_userId: userId,
      _id: orderId,
    });
    if (!foundOrder) {
      throw new NotFoundError(
        `Order with ID ${orderId} not found for user ${userId}`
      );
    }
    return foundOrder;
  }

  static async getOneOrderByUser({ userId, orderId }) {
    // Validate input parameters
    if (!userId || !orderId) {
      throw new BadRequestError("User ID and Order ID are required");
    }
    // Find the order by user ID and order ID
    const foundOrder = await order.findOne({
      order_userId: userId,
      _id: orderId,
    });
    if (!foundOrder) {
      throw new NotFoundError(
        `Order with ID ${orderId} not found for user ${userId}`
      );
    }
    return foundOrder;
  }

  static async cancelOrderByUser({ userId, orderId }) {
    // Validate input parameters
    if (!userId || !orderId) {
      throw new BadRequestError("User ID and Order ID are required");
    }
    // Find the order by user ID and order ID
    const foundOrder = await order.findOne({
      order_userId: userId,
      _id: orderId,
    });
    if (!foundOrder) {
      throw new NotFoundError(
        `Order with ID ${orderId} not found for user ${userId}`
      );
    }
    // Update the order status to 'cancelled'
    foundOrder.order_status = "cancelled";
    await foundOrder.save();
    return foundOrder;
  }

  static async updateOrderStatusByShop({ shopId, orderId, newStatus }) {
    // Validate input parameters
    if (!shopId || !orderId || !newStatus) {
      throw new BadRequestError(
        "Shop ID, Order ID, and new status are required"
      );
    }
    // Find the order by shop ID and order ID
    const foundOrder = await order.findOne({
      order_shopId: shopId,
      _id: orderId,
    });
    if (!foundOrder) {
      throw new NotFoundError(
        `Order with ID ${orderId} not found for shop ${shopId}`
      );
    }
    // Update the order status
    foundOrder.order_status = newStatus;
    await foundOrder.save();
    return foundOrder;
  }
}

module.exports = {
  CheckoutService,
};
