"use strict";

const cart = require("../models/cart.model");
const { Types } = require("mongoose");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const {
  findAllProducts,
  getProductById,
} = require("../models/repositories/product.repo");
const { options } = require("../routes");

/* 
    Keyfeature: Cart Service
    - Add items to cart
    - Remove items from cart
    - Update item quantity in cart
    - Get cart items 
    - Clear cart
    - Apply discount code to cart
    - Calculate total price of cart
    
*/
class CartService {
  // Start Repository Cart
  static async createUserCart({ userId, product }) {
    // Logic to create a new cart for the user
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true, // Create a new cart if it doesn't exist
      new: true, // Return the updated document
      setDefaultsOnInsert: true, // Set default values on insert
    };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    // Logic to create a new cart for the user
    const query = {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId, // Ensure the product exists in the cart
      },
      updateSet = {
        $set: {
          "cart_products.$.quantity": quantity, // Update the quantity of the product
        },
      },
      options = {
        new: true, // Return the updated document
        setDefaultsOnInsert: true, // Set default values on insert
      };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  //End
  static async addItemToCart({ userId, product = {} }) {
    // Logic to add item to cart
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //Create a new cart for the user if it doesn't exist
      return await this.createUserCart({ userId, product });
    }
    // If the cart exits, but the product does not exist in the cart, add it
    if (
      userCart.cart_products.length === 0 ||
      !userCart.cart_products.some(
        (item) => item.productId.toString() === product.productId.toString()
      )
    ) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }
    // If the product already exists in the cart, update the quantity
    return await this.updateUserCartQuantity({
      userId,
      product,
    });
  }

  // Update cart
  /*
     shop_order_ids: [
      {
        shopId: "shopId1",
        item_products: [
          {
            productId: "productId1",
            quantity: 2,
            price: 100,
            shopId: "shopId1",
            old_quantity: 1,
          },
        version: 1,
        ],
      },
     ]
  */
  static async addItemToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity, price, shopId } =
      shop_order_ids[0]?.itemproducts[0];
    // Check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError(`Product with ID ${productId} not found.`);
    }
    if (
      foundProduct.product_shop.toString() !==
      shop_order_ids[0]?.shopId.toString()
    ) {
      throw new BadRequestError(
        `Product does not belong to shop with ID ${shopId}.`
      );
    }
    if (quantity === 0) {
      // If quantity is 0, remove the product from the cart
      return await this.removeItemFromCart({ userId, productId });
    }
    if (quantity < 0) {
      throw new BadRequestError("Quantity cannot be less than 0.");
    }
    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity, // Update the quantity based on the old quantity
        price,
        shopId,
        old_quantity,
      },
    });
  }

  static async removeItemFromCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: {
        cart_products: { productId: productId }, // Remove the product from the cart
      },
    };
    const removeCart = await cart.updateOne(query, updateSet);
    if (removeCart.modifiedCount === 0) {
      throw new NotFoundError(
        `Product with ID ${productId} not found in cart.`
      );
    }
    return removeCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: userId,
        cart_state: "active",
      })
      .populate("cart_products.productId", "name price image")
      .lean();
  }
}
module.exports = {
  CartService,
};
