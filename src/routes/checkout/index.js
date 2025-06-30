const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');


// Define routes for discount operations

// Authentication middleware
router.use(authentication); // Apply authentication middleware to all routes below this point
router.post('/review', asyncHandler(checkoutController.checkoutReview)); // Review checkout

module.exports = router; // Export the router