"use strict";
const { CheckoutService } = require("../services/checkout.service");

const { OKResponse } = require("../core/success.response");

class CheckoutController {
    /**
     * Checkout review controller
     * @param {Object} req - The request object containing parameters for the checkout review
     * @param {Object} res - The response object to send the result
     */
    checkoutReview = async (req, res) => {
        new OKResponse({
            message: "Checkout review successfully",
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    };
}
module.exports = new CheckoutController();