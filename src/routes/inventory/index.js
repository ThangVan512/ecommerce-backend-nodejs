const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auths/authUtils');


// Define routes for discount operations

// Authentication middleware
router.use(authentication); // Apply authentication middleware to all routes below this point
router.post('/reservation', asyncHandler(inventoryController.addStockToInventory)); // Reserve inventory for a product

module.exports = router; // Export the router