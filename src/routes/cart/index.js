const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');


// Define routes for discount operations

// Authentication middleware
router.use(authentication); // Apply authentication middleware to all routes below this point
router.post('/add', asyncHandler(cartController.addToCart)); // Add product to cart
router.post('/add_v2', asyncHandler(cartController.addToCartV2)); // Add or update product in cart
router.post('/update', asyncHandler(cartController.updateCart)); // Update cart
router.delete('/delete', asyncHandler(cartController.removeItemFromCart)); // Delete item from cart
router.get('/list', asyncHandler(cartController.listToCart)); // List items in cart
module.exports = router; // Export the router