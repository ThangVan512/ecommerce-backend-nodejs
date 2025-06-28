const express = require('express');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');

// Define routes for discount operations
router.post('/amount', asyncHandler(discountController.getDiscountAmount)); // Get discount amount
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts)); // Get all discount codes with products
// Authentication middleware
router.use(authentication); // Apply authentication middleware to all routes below this point
router.post('', asyncHandler(discountController.createDiscountCode)); // Create a new discount code
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop)); // Get all discount codes

module.exports = router; // Export the router