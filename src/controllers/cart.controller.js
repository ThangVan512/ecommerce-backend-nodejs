"use strict";
const { CartService } = require("../services/cart.service");

const { OKResponse } = require("../core/success.response");
const { update } = require("lodash");
const { getListSearchProduct } = require("./product.controller");

class CartController {
   
    addToCart = async (req, res) => {
        new OKResponse({
            message: "Add product to cart successfully",
            metadata: await CartService.addItemToCart(req.body),
        }).send(res);
    }
    addToCartV2 = async (req, res) => {
        new OKResponse({
            message: "Add product to cart successfully",
            metadata: await CartService.addItemToCartV2(req.body),
        }).send(res);
    }
    updateCart = async (req, res) => {
        new OKResponse({
            message: "Update cart successfully",
            metadata: await CartService.addItemToCartV2(req.body),
        }).send(res);
    };
    removeItemFromCart = async (req, res) => {
        new OKResponse({
            message: "Delete item from cart successfully",
            metadata: await CartService.removeItemFromCart(req.body),
        }).send(res);
    }
    listToCart = async (req, res) => {
        new OKResponse({
            message: "List cart successfully",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res);
    }
}
module.exports = new CartController();